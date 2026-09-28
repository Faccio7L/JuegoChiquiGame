
public class CupRoundOutcome {

    private final CupRound round;
    private final Club opponent;
    private final MatchResult matchResult;

    public CupRoundOutcome(CupRound round, Club opponent, MatchResult matchResult) {
        this.round = round;
        this.opponent = opponent;
        this.matchResult = matchResult;
    }

    public CupRound getRound() {
        return round;
    }

    public Club getOpponent() {
        return opponent;
    }

    public MatchResult getMatchResult() {
        return matchResult;
    }

    public boolean userWon() {
        return matchResult.isHomeWon();
    }

    @Override
    public String toString() {
        return String.format("%s vs %s: %s", round.getDisplayName(), opponent.getName(), matchResult.summary());
    }
}
