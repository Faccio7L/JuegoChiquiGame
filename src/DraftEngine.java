import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;


public class DraftEngine {

    private static final double BIAS_PER_EMPTY_SLOT = 0.6;
    private static final double BASE_WEIGHT = 1.0;

    
    private static final double PROB_LEYENDA = 0.0040;                 
    private static final double PROB_DIAMANTE = PROB_LEYENDA + 0.0070; 
    private static final double PROB_ORO = PROB_DIAMANTE + 0.0140;     

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

    
    public Player rollRarityForChoice(Player player) {
        if (player == null) return null;
        return rollRarity(player, player.getNativePosition() == Position.ARQ, new ArrayList<>());
    }

    
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
