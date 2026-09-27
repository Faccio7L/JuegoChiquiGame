import java.util.Random;

/**
 * Simula un partido según las reglas de ChiquiCup:
 * - 90 minutos reglamentarios, 2,5% de probabilidad TOTAL de gol por minuto
 *   (evento combinado entre ambos equipos, no independiente por equipo).
 * - El gol se asigna mediante función logística calibrada:
 *   un equipo con +5 de media tiene ~56% de probabilidad de gol (superando el 55%).
 * - Empate a los 90' -> alargue hasta el 120'.
 * - Empate a los 120' -> tanda de penales tiro a tiro (75% acierto el mejor equipo, 70% el peor).
 */
public class MatchSimulator {

    /** Probabilidad total de que ocurra un gol (de cualquiera de los dos equipos) en un minuto dado. */
    public static final double GOAL_PROBABILITY_PER_MINUTE = 0.025;

    public static final int REGULATION_MINUTES = 90;
    public static final int EXTRA_TIME_MINUTES = 120;

    public static final double BEST_TEAM_PENALTY_ACCURACY = 0.75;
    public static final double WORST_TEAM_PENALTY_ACCURACY = 0.70;

    private final Random random;

    public MatchSimulator(Random random) {
        this.random = random;
    }

    /**
     * Calcula la probabilidad de que un gol sea convertido por el equipo local.
     * Con k = 0.048:
     * - Diferencia 0: 50.0%
     * - Diferencia +5: 56.0% (cumple >= 55%)
     * - Diferencia +10: 61.8%
     * - Diferencia +15: 67.3%
     */
    public static double calculateGoalProbability(double homeRating, double awayRating) {
        double diff = homeRating - awayRating;
        return 1.0 / (1.0 + Math.exp(-0.048 * diff));
    }

    /**
     * Simula el partido completo.
     *
     * @param homeRating media efectiva del equipo local (ej. el del usuario)
     * @param awayRating media efectiva del equipo visitante (ej. rival + boost oculto)
     */
    public MatchResult simulate(double homeRating, double awayRating) {
        MatchResult result = new MatchResult();

        // Tiempo reglamentario (1 a 90)
        simulateMinutes(result, 1, REGULATION_MINUTES, homeRating, awayRating);

        boolean tiedAt90 = result.getHomeGoalsAt(REGULATION_MINUTES) == result.getAwayGoalsAt(REGULATION_MINUTES);

        if (tiedAt90) {
            result.markExtraTime();
            // Alargue (91 a 120)
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

    /**
     * Tanda de penales tiro a tiro: 5 penales por equipo y eventual muerte súbita.
     * Registra cada disparo en el MatchResult para permitir narración paso a paso.
     */
    private boolean simulatePenalties(MatchResult result, boolean homeIsBetterTeam) {
        double homeAccuracy = homeIsBetterTeam ? BEST_TEAM_PENALTY_ACCURACY : WORST_TEAM_PENALTY_ACCURACY;
        double awayAccuracy = homeIsBetterTeam ? WORST_TEAM_PENALTY_ACCURACY : BEST_TEAM_PENALTY_ACCURACY;

        int homeScored = 0;
        int awayScored = 0;

        // Tanda regular de hasta 5 penales
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

        // Muerte súbita si persiste el empate
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
