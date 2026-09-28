import java.util.Random;


public class MatchSimulator {

    
    public static final double GOAL_PROBABILITY_PER_MINUTE = 0.025;

    public static final int REGULATION_MINUTES = 90;
    public static final int EXTRA_TIME_MINUTES = 120;

    public static final double BEST_TEAM_PENALTY_ACCURACY = 0.75;
    public static final double WORST_TEAM_PENALTY_ACCURACY = 0.70;

    private final Random random;

    public MatchSimulator(Random random) {
        this.random = random;
    }

    
    public static double calculateGoalProbability(double homeRating, double awayRating) {
        double diff = homeRating - awayRating;
        return 1.0 / (1.0 + Math.exp(-0.048 * diff));
    }

    
    public MatchResult simulate(double homeRating, double awayRating) {
        MatchResult result = new MatchResult();

        
        simulateMinutes(result, 1, REGULATION_MINUTES, homeRating, awayRating);

        boolean tiedAt90 = result.getHomeGoalsAt(REGULATION_MINUTES) == result.getAwayGoalsAt(REGULATION_MINUTES);

        if (tiedAt90) {
            result.markExtraTime();
            
            simulateMinutes(result, REGULATION_MINUTES + 1, EXTRA_TIME_MINUTES, homeRating, awayRating);
        }

        boolean tiedAt120 = result.getFinalHomeGoals() == result.getFinalAwayGoals();

        if (tiedAt120) {
            boolean homeIsBetter = homeRating >= awayRating;
            boolean homeWonPenalties = simulatePenalties(result, homeIsBetter);
            result.setHomeWon(homeWonPenalties);
        } else {
            result.setHomeWon(result.getFinalHomeGoals() > result.getFinalAwayGoals());
        }

        return result;
    }

    private void simulateMinutes(MatchResult result, int fromMinuteInclusive, int toMinuteInclusive,
                                 double homeRating, double awayRating) {
        double pHomeGivenGoal = calculateGoalProbability(homeRating, awayRating);

        for (int minute = fromMinuteInclusive; minute <= toMinuteInclusive; minute++) {
            if (random.nextDouble() < GOAL_PROBABILITY_PER_MINUTE) {
                boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                result.addGoal(new GoalEvent(minute, homeScores));
            }
        }
    }

    
    private boolean simulatePenalties(MatchResult result, boolean homeIsBetterTeam) {
        double homeAccuracy = homeIsBetterTeam ? BEST_TEAM_PENALTY_ACCURACY : WORST_TEAM_PENALTY_ACCURACY;
        double awayAccuracy = homeIsBetterTeam ? WORST_TEAM_PENALTY_ACCURACY : BEST_TEAM_PENALTY_ACCURACY;

        int homeScored = 0;
        int awayScored = 0;

        
        for (int r = 1; r <= 5; r++) {
            boolean homeGoal = random.nextDouble() < homeAccuracy;
            if (homeGoal) homeScored++;
            result.addPenaltyEvent(new PenaltyEvent(r, true, "Pateador Local " + r, homeGoal, homeScored, awayScored));

            int homeRemaining = 5 - r;
            int awayRemaining = 5 - (r - 1);
            if (homeScored > awayScored + awayRemaining || awayScored > homeScored + homeRemaining) {
                break;
            }

            boolean awayGoal = random.nextDouble() < awayAccuracy;
            if (awayGoal) awayScored++;
            result.addPenaltyEvent(new PenaltyEvent(r, false, "Pateador Visitante " + r, awayGoal, homeScored, awayScored));

            awayRemaining = 5 - r;
            if (homeScored > awayScored + awayRemaining || awayScored > homeScored + homeRemaining) {
                break;
            }
        }

        
        int round = 6;
        while (homeScored == awayScored) {
            boolean homeGoal = random.nextDouble() < homeAccuracy;
            if (homeGoal) homeScored++;
            result.addPenaltyEvent(new PenaltyEvent(round, true, "Pateador Local " + round, homeGoal, homeScored, awayScored));

            boolean awayGoal = random.nextDouble() < awayAccuracy;
            if (awayGoal) awayScored++;
            result.addPenaltyEvent(new PenaltyEvent(round, false, "Pateador Visitante " + round, awayGoal, homeScored, awayScored));

            round++;
        }

        result.setPenaltyResult(homeScored, awayScored);
        return homeScored > awayScored;
    }
}
