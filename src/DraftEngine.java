import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Motor de draft de ChiquiCup.
 * Reglas implementadas:
 * - Ronda 1: 4 arqueros a elegir, garantiza cobertura del puesto.
 * - Rondas 2 a 11: 4 jugadores de campo al azar, con sesgo ponderado hacia posiciones vacias.
 *
 * Calibracion de rarezas y boosts (probabilidad acumulada por cuadradito ~ 2.5%):
 * - ORO: ~1.40% (+3 de media explicito, el mas comun de los boosts)
 * - DIAMANTE: ~0.70% (+5 de media explicito)
 * - LEYENDA: ~0.40% (Idolos historicos del futbol argentino con media pico)
 * - NORMAL: ~97.50%
 *
 * Esto garantiza aproximadamente un 60% de probabilidad por partida de que el usuario
 * consiga al menos un tipo de boost (con suerte 2 o 3, o excepcionalmente 0),
 * haciendo el juego levemente mas accesible.
 */
public class DraftEngine {

    private static final double BIAS_PER_EMPTY_SLOT = 0.6;
    private static final double BASE_WEIGHT = 1.0;

    // Umbrales de probabilidad por cuadradito (evaluacion acumulativa - total 2.50%)
    private static final double PROB_LEYENDA = 0.0040;                 // 0.40% Leyenda
    private static final double PROB_DIAMANTE = PROB_LEYENDA + 0.0070; // 1.10% acumulado (+0.70% Diamante)
    private static final double PROB_ORO = PROB_DIAMANTE + 0.0140;     // 2.50% acumulado (+1.40% Oro)

    private final List<Player> goalkeeperPool;
    private final List<Player> fieldPlayerPool;
    private final List<Player> idolGoalkeepers;
    private final List<Player> idolFieldPlayers;
    private final Random random;

    public DraftEngine(List<Player> goalkeeperPool, List<Player> fieldPlayerPool, List<Player> idolPool, Random random) {
        this.goalkeeperPool = new ArrayList<>(goalkeeperPool);
        this.fieldPlayerPool = new ArrayList<>(fieldPlayerPool);
        this.idolGoalkeepers = new ArrayList<>();
        this.idolFieldPlayers = new ArrayList<>();
        if (idolPool != null) {
            for (Player p : idolPool) {
                if (p.getNativePosition() == Position.ARQ) {
                    this.idolGoalkeepers.add(p);
                } else {
                    this.idolFieldPlayers.add(p);
                }
            }
        }
        this.random = random;
    }

    public DraftEngine(List<Player> goalkeeperPool, List<Player> fieldPlayerPool, Random random) {
        this(goalkeeperPool, fieldPlayerPool, DataLoader.createIdolPool(), random);
    }

    /**
     * Ronda 1: 4 arqueros distintos, sorteados de forma uniforme,
     * con evaluacion independiente de rareza (Oro, Diamante o Idolo).
     */
    public List<Player> nextGoalkeeperChoices() {
        List<Player> raw = pickDistinctUniform(goalkeeperPool, 4);
        List<Player> result = new ArrayList<>(raw.size());
        List<String> namesInBatch = new ArrayList<>();

        for (Player p : raw) {
            Player rolled = rollRarity(p, true, namesInBatch);
            result.add(rolled);
            namesInBatch.add(rolled.getName());
        }
        return result;
    }

    /**
     * Rondas 2 a 11: 4 jugadores de campo distintos, sorteados con
     * ponderacion segun categorias faltantes y evaluacion de rarezas.
     */
    public List<Player> nextFieldPlayerChoices(Team team) {
        Map<PositionCategory, Long> emptyByCategory = team.countEmptySlotsByCategory();
        List<Player> available = new ArrayList<>(fieldPlayerPool);
        List<Player> result = new ArrayList<>(4);
        List<String> namesInBatch = new ArrayList<>();

        for (int i = 0; i < 4 && !available.isEmpty(); i++) {
            Player chosen = pickWeighted(available, emptyByCategory);
            Player rolled = rollRarity(chosen, false, namesInBatch);
            result.add(rolled);
            namesInBatch.add(rolled.getName());
            available.remove(chosen);
        }
        return result;
    }

    /**
     * Metodo de compatibilidad para evaluar rareza de un jugador base.
     */
    public Player rollRarityForChoice(Player player) {
        if (player == null) return null;
        return rollRarity(player, player.getNativePosition() == Position.ARQ, new ArrayList<>());
    }

    /**
     * Sorteo de rareza calibrado para cumplir con el 60% por partida de al menos un boost.
     */
    private Player rollRarity(Player base, boolean isGoalkeeper, List<String> excludedNames) {
        if (base == null) return null;
        double roll = random.nextDouble();

        if (roll < PROB_LEYENDA) {
            Player idol = pickAvailableIdol(isGoalkeeper, excludedNames);
            if (idol != null) {
                return idol;
            }
            return base.withRarity(PlayerRarity.DIAMANTE);
        } else if (roll < PROB_DIAMANTE) {
            return base.withRarity(PlayerRarity.DIAMANTE);
        } else if (roll < PROB_ORO) {
            return base.withRarity(PlayerRarity.ORO);
        } else {
            return base.withRarity(PlayerRarity.NORMAL);
        }
    }

    private Player pickAvailableIdol(boolean isGoalkeeper, List<String> excludedNames) {
        List<Player> pool = isGoalkeeper ? idolGoalkeepers : idolFieldPlayers;
        List<Player> candidates = new ArrayList<>();
        for (Player p : pool) {
            if (!excludedNames.contains(p.getName())) {
                candidates.add(p);
            }
        }
        if (candidates.isEmpty()) return null;
        return candidates.get(random.nextInt(candidates.size()));
    }

    /** Elimina un jugador del pool una vez que fue ofrecido y decidido (tomado o descartado). */
    public void removeFromPool(Player player) {
        if (player == null) return;
        goalkeeperPool.removeIf(p -> p.getName().equalsIgnoreCase(player.getName()));
        fieldPlayerPool.removeIf(p -> p.getName().equalsIgnoreCase(player.getName()));
        idolGoalkeepers.removeIf(p -> p.getName().equalsIgnoreCase(player.getName()));
        idolFieldPlayers.removeIf(p -> p.getName().equalsIgnoreCase(player.getName()));
    }

    private Player pickWeighted(List<Player> candidates, Map<PositionCategory, Long> emptyByCategory) {
        double totalWeight = 0.0;
        double[] weights = new double[candidates.size()];
        for (int i = 0; i < candidates.size(); i++) {
            PositionCategory cat = candidates.get(i).getNativePosition().getCategory();
            long emptySlots = emptyByCategory.getOrDefault(cat, 0L);
            double weight = BASE_WEIGHT + (emptySlots * BIAS_PER_EMPTY_SLOT);
            weights[i] = weight;
            totalWeight += weight;
        }

        double roll = random.nextDouble() * totalWeight;
        double cumulative = 0.0;
        for (int i = 0; i < candidates.size(); i++) {
            cumulative += weights[i];
            if (roll <= cumulative) {
                return candidates.get(i);
            }
        }
        return candidates.get(candidates.size() - 1);
    }

    private List<Player> pickDistinctUniform(List<Player> pool, int count) {
        List<Player> copy = new ArrayList<>(pool);
        List<Player> result = new ArrayList<>(count);
        for (int i = 0; i < count && !copy.isEmpty(); i++) {
            int idx = random.nextInt(copy.size());
            result.add(copy.remove(idx));
        }
        return result;
    }
}
