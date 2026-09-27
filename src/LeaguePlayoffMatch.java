import java.util.Objects;

/**
 * CLASE EXCLUSIVA DE CHIQUILEAGUE (NO UTILIZADA EN CHIQUICUP)
 *
 * Representa una llave de eliminación directa en los Playoffs de la ChiquiLeague.
 * Incluye tiempo reglamentario, alargue si hay empate a los 90', y definición por penales si persiste el empate a los 120'.
 */
public class LeaguePlayoffMatch {

    private final LeaguePlayoffRound round;
    private final String homeTeam;
    private final String awayTeam;
    private final boolean isUserMatch;

    private MatchResult matchResult;
    private String winner;
    private boolean played;

    public LeaguePlayoffMatch(LeaguePlayoffRound round, String homeTeam, String awayTeam, boolean isUserMatch) {
        this.round = Objects.requireNonNull(round, "round");
        this.homeTeam = Objects.requireNonNull(homeTeam, "homeTeam");
        this.awayTeam = Objects.requireNonNull(awayTeam, "awayTeam");
        this.isUserMatch = isUserMatch;
    }

    public void setResult(MatchResult result, String winner) {
        this.matchResult = result;
        this.winner = winner;
        this.played = true;
    }

    public LeaguePlayoffRound getRound() {
        return round;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public boolean isUserMatch() {
        return isUserMatch;
    }

    public MatchResult getMatchResult() {
        return matchResult;
    }

    public String getWinner() {
        return winner;
    }

    public boolean isPlayed() {
        return played;
    }

    @Override
    public String toString() {
        if (!played) {
            return String.format("%s: %s vs %s", round.getDisplayName(), homeTeam, awayTeam);
        }
        return String.format("%s: %s %d - %d %s (Ganador: %s)",
                round.getDisplayName(), homeTeam, matchResult.getFinalHomeGoals(), matchResult.getFinalAwayGoals(), awayTeam, winner);
    }
}
