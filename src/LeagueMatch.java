import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;


public class LeagueMatch {

    private final int matchday;
    private final String homeTeam;
    private final String awayTeam;
    private final boolean isInterzonal;
    private final boolean isUserMatch;

    private boolean played;
    private int homeGoals;
    private int awayGoals;
    private final List<GoalEvent> events = new ArrayList<>();

    public LeagueMatch(int matchday, String homeTeam, String awayTeam, boolean isInterzonal, boolean isUserMatch) {
        this.matchday = matchday;
        this.homeTeam = Objects.requireNonNull(homeTeam, "homeTeam");
        this.awayTeam = Objects.requireNonNull(awayTeam, "awayTeam");
        this.isInterzonal = isInterzonal;
        this.isUserMatch = isUserMatch;
    }

    public void setResult(int homeGoals, int awayGoals, List<GoalEvent> goalEvents) {
        this.homeGoals = homeGoals;
        this.awayGoals = awayGoals;
        this.events.clear();
        if (goalEvents != null) {
            this.events.addAll(goalEvents);
        }
        this.played = true;
    }

    public int getMatchday() {
        return matchday;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public boolean isInterzonal() {
        return isInterzonal;
    }

    public boolean isUserMatch() {
        return isUserMatch;
    }

    public boolean isPlayed() {
        return played;
    }

    public int getHomeGoals() {
        return homeGoals;
    }

    public int getAwayGoals() {
        return awayGoals;
    }

    public List<GoalEvent> getEvents() {
        return Collections.unmodifiableList(events);
    }

    @Override
    public String toString() {
        if (!played) {
            return String.format("Fecha %d: %s vs %s %s", matchday, homeTeam, awayTeam, isInterzonal ? "[INTERZONAL]" : "");
        }
        return String.format("Fecha %d: %s %d - %d %s %s", matchday, homeTeam, homeGoals, awayGoals, awayTeam, isInterzonal ? "[INTERZONAL]" : "");
    }
}
