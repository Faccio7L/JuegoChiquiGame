/**
 * Representa el evento de un gol en un minuto específico del partido,
 * indicando qué equipo convirtió y opcionalmente el autor del gol.
 */
public class GoalEvent {

    private final int minute;
    private final boolean homeTeamScored;
    private final String scorer;

    public GoalEvent(int minute, boolean homeTeamScored, String scorer) {
        this.minute = minute;
        this.homeTeamScored = homeTeamScored;
        this.scorer = scorer;
    }

    public GoalEvent(int minute, boolean homeTeamScored) {
        this(minute, homeTeamScored, null);
    }

    public int getMinute() {
        return minute;
    }

    public boolean isHomeTeamScored() {
        return homeTeamScored;
    }

    public String getScorer() {
        return scorer;
    }

    @Override
    public String toString() {
        String who = scorer != null ? scorer : (homeTeamScored ? "Local" : "Visitante");
        return String.format("Minuto %d': Gol de %s", minute, who);
    }
}
