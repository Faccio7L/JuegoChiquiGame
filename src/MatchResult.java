import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Resultado completo de un partido: goles minuto a minuto, marcador en los
 * 90', marcador final tras eventual tiempo extra, y definición por penales
 * si correspondió.
 */
public class MatchResult {

    private final List<GoalEvent> events = new ArrayList<>();
    private final List<PenaltyEvent> penaltyEvents = new ArrayList<>();
    private boolean wentToExtraTime = false;
    private boolean wentToPenalties = false;
    private Integer homePenalties = null;
    private Integer awayPenalties = null;
    private boolean homeWon;

    void addGoal(GoalEvent event) {
        events.add(event);
    }

    void addPenaltyEvent(PenaltyEvent pe) {
        penaltyEvents.add(pe);
    }

    void markExtraTime() {
        this.wentToExtraTime = true;
    }

    void setPenaltyResult(int homePenalties, int awayPenalties) {
        this.wentToPenalties = true;
        this.homePenalties = homePenalties;
        this.awayPenalties = awayPenalties;
    }

    void setHomeWon(boolean homeWon) {
        this.homeWon = homeWon;
    }

    public List<GoalEvent> getEvents() {
        return Collections.unmodifiableList(events);
    }

    public int getHomeGoalsAt(int uptoMinuteInclusive) {
        return (int) events.stream()
                .filter(e -> e.getMinute() <= uptoMinuteInclusive)
                .filter(GoalEvent::isHomeTeamScored)
                .count();
    }

    public int getAwayGoalsAt(int uptoMinuteInclusive) {
        return (int) events.stream()
                .filter(e -> e.getMinute() <= uptoMinuteInclusive)
                .filter(e -> !e.isHomeTeamScored())
                .count();
    }

    /** Goles totales (incluyendo tiempo extra si lo hubo), sin contar penales. */
    public int getFinalHomeGoals() {
        return (int) events.stream().filter(GoalEvent::isHomeTeamScored).count();
    }

    public int getFinalAwayGoals() {
        return (int) events.stream().filter(e -> !e.isHomeTeamScored()).count();
    }

    public boolean wentToExtraTime() {
        return wentToExtraTime;
    }

    public boolean wentToPenalties() {
        return wentToPenalties;
    }

    public Integer getHomePenalties() {
        return homePenalties;
    }

    public Integer getAwayPenalties() {
        return awayPenalties;
    }

    public boolean isHomeWon() {
        return homeWon;
    }

    public List<PenaltyEvent> getPenaltyEvents() {
        return Collections.unmodifiableList(penaltyEvents);
    }

    public String summary() {
        StringBuilder sb = new StringBuilder();
        sb.append(getFinalHomeGoals()).append(" - ").append(getFinalAwayGoals());
        if (wentToExtraTime) {
            sb.append(" (90': ").append(getHomeGoalsAt(90)).append("-").append(getAwayGoalsAt(90)).append(", tras alargue)");
        }
        if (wentToPenalties) {
            sb.append(" | Penales: ").append(homePenalties).append("-").append(awayPenalties);
        }
        sb.append(" | Ganador: ").append(homeWon ? "Local" : "Visitante");
        return sb.toString();
    }
}
