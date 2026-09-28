import java.util.ArrayList;
import java.util.List;


public class CupRunResult {

    private final List<CupRoundOutcome> roundOutcomes = new ArrayList<>();
    private boolean champion = false;

    void addRoundOutcome(CupRoundOutcome outcome) {
        roundOutcomes.add(outcome);
    }

    void setChampion(boolean champion) {
        this.champion = champion;
    }

    public List<CupRoundOutcome> getRoundOutcomes() {
        return roundOutcomes;
    }

    public boolean isChampion() {
        return champion;
    }

    public CupRound getEliminationRound() {
        if (champion || roundOutcomes.isEmpty()) {
            return null;
        }
        return roundOutcomes.get(roundOutcomes.size() - 1).getRound();
    }

    public String summary() {
        StringBuilder sb = new StringBuilder();
        for (CupRoundOutcome outcome : roundOutcomes) {
            sb.append(outcome).append(System.lineSeparator());
        }
        sb.append(champion ? "🏆 ¡CAMPEÓN!" : "Eliminado en " + getEliminationRound().getDisplayName());
        return sb.toString();
    }
}
