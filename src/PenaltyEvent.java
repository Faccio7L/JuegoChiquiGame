
public class PenaltyEvent {
    private final int roundNumber;
    private final boolean isHomeTeam;
    private final String kickerName;
    private final boolean scored;
    private final int homeScoreAfter;
    private final int awayScoreAfter;

    public PenaltyEvent(int roundNumber, boolean isHomeTeam, String kickerName,
                        boolean scored, int homeScoreAfter, int awayScoreAfter) {
        this.roundNumber = roundNumber;
        this.isHomeTeam = isHomeTeam;
        this.kickerName = kickerName;
        this.scored = scored;
        this.homeScoreAfter = homeScoreAfter;
        this.awayScoreAfter = awayScoreAfter;
    }

    public int getRoundNumber() {
        return roundNumber;
    }

    public boolean isHomeTeam() {
        return isHomeTeam;
    }

    public String getKickerName() {
        return kickerName;
    }

    public boolean isScored() {
        return scored;
    }

    public int getHomeScoreAfter() {
        return homeScoreAfter;
    }

    public int getAwayScoreAfter() {
        return awayScoreAfter;
    }
}
