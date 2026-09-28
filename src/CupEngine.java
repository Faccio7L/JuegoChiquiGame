


import java.util.ArrayList;
import java.util.List;
import java.util.Random;


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
