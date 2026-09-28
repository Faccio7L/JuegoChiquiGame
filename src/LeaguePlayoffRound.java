
public enum LeaguePlayoffRound {
    OCTAVOS("Octavos de Final", 0.0),
    CUARTOS("Cuartos de Final", 2.0),
    SEMIFINAL("Semifinales", 4.0),
    FINAL("Gran Final", 6.0);

    private final String displayName;
    private final double rivalHiddenBoost;

    LeaguePlayoffRound(String displayName, double rivalHiddenBoost) {
        this.displayName = displayName;
        this.rivalHiddenBoost = rivalHiddenBoost;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getRivalHiddenBoost() {
        return rivalHiddenBoost;
    }
}
