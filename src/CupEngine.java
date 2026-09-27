


import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Motor de la copa de 32 equipos. Reglas implementadas (sección 2 y 3 del
 * documento de requisitos):
 * - El usuario NO ve el resto del cuadro, solo su propio camino (estilo "7-0"),
 *   por lo que este motor solo simula los partidos del usuario, ronda por ronda.
 * - En cada ronda se sortea un rival con probabilidad ponderada por el
 *   "weight" (peso/jerarquía) de cada club, sesgo que se inclina
 *   progresivamente hacia clubes grandes a medida que se avanza de ronda.
 * - El rival recibe un boost oculto de media que aumenta con cada ronda
 *   superada (invisible para el usuario).
 * - Un club ya enfrentado en este recorrido no puede volver a salir sorteado.
 */
public class CupEngine {

    private final List<Club> clubPool;
    private final MatchSimulator matchSimulator;
    private final Random random;

    public CupEngine(List<Club> clubPool, MatchSimulator matchSimulator, Random random) {
        if (clubPool.size() < CupRound.values().length) {
            throw new IllegalArgumentException("Se necesitan al menos " + CupRound.values().length + " clubes en el pool");
        }
        this.clubPool = new ArrayList<>(clubPool);
        this.matchSimulator = matchSimulator;
        this.random = random;
    }

    /**
     * Juega el camino completo del usuario en la copa: 5 rondas, deteniéndose
     * apenas el usuario pierde (o hasta ser campeón).
     */
    public CupRunResult playUserRun(Team userTeam) {
        CupRunResult result = new CupRunResult();
        List<Club> faced = new ArrayList<>();
        double userRating = userTeam.getEffectiveRating();

        for (CupRound round : CupRound.values()) {
            Club opponent = drawOpponent(round, faced);
            faced.add(opponent);

            double opponentEffectiveRating = opponent.getBaseMedia() + round.getCumulativeHiddenBoost();

            MatchResult matchResult = matchSimulator.simulate(userRating, opponentEffectiveRating);
            result.addRoundOutcome(new CupRoundOutcome(round, opponent, matchResult));

            if (!matchResult.isHomeWon()) {
                result.setChampion(false);
                return result;
            }
        }

        result.setChampion(true);
        return result;
    }

    /**
     * Sorteo por bombos discretos según la ronda:
     * - Buenos, Intermedios y Malos.
     * Probabilidades exactas por ronda:
     * 16vos: 0% Buenos, 30% Intermedios, 70% Malos
     * 8vos:  5% Buenos, 50% Intermedios, 45% Malos
     * 4tos:  25% Buenos, 50% Intermedios, 25% Malos
     * Semis: 50% Buenos, 35% Intermedios, 15% Malos
     * Final: 65% Buenos, 25% Intermedios, 10% Malos
     *
     * Dentro del bombo seleccionado, se elige el club ponderado por su jerarquía/weight.
     */
    public Club drawOpponent(CupRound round, List<Club> alreadyFaced) {
        List<Club> available = new ArrayList<>(clubPool);
        available.removeAll(alreadyFaced);

        if (available.isEmpty()) {
            throw new IllegalStateException("No quedan clubes disponibles para sortear en " + round);
        }

        List<Club> availBuenos = new ArrayList<>();
        List<Club> availIntermedios = new ArrayList<>();
        List<Club> availMalos = new ArrayList<>();

        for (Club c : available) {
            if (c.getTier() == ClubTier.BUENO) {
                availBuenos.add(c);
            } else if (c.getTier() == ClubTier.INTERMEDIO) {
                availIntermedios.add(c);
            } else {
                availMalos.add(c);
            }
        }

        double pBuenos = round.getProbBuenos();
        double pInter = round.getProbIntermedios();
        double rollTier = random.nextDouble();

        ClubTier targetTier;
        if (rollTier < pBuenos) {
            targetTier = ClubTier.BUENO;
        } else if (rollTier < pBuenos + pInter) {
            targetTier = ClubTier.INTERMEDIO;
        } else {
            targetTier = ClubTier.MALO;
        }

        List<Club> candidates;
        if (targetTier == ClubTier.BUENO && !availBuenos.isEmpty()) {
            candidates = availBuenos;
        } else if (targetTier == ClubTier.INTERMEDIO && !availIntermedios.isEmpty()) {
            candidates = availIntermedios;
        } else if (targetTier == ClubTier.MALO && !availMalos.isEmpty()) {
            candidates = availMalos;
        } else {
            candidates = available;
        }

        double totalWeight = 0.0;
        for (Club c : candidates) {
            totalWeight += c.getWeight();
        }

        double rollClub = random.nextDouble() * totalWeight;
        double cumulative = 0.0;
        for (Club c : candidates) {
            cumulative += c.getWeight();
            if (rollClub <= cumulative) {
                return c;
            }
        }
        return candidates.get(candidates.size() - 1);
    }
}
