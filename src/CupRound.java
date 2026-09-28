
public enum CupRound {
    DIECISEISAVOS("Dieciseisavos de final", -2.0, 0.00, 0.30, 0.70),
    OCTAVOS("Octavos de final", 0.0, 0.05, 0.50, 0.45),
    CUARTOS("Cuartos de final", 2.0, 0.25, 0.50, 0.25),
    SEMIFINAL("Semifinal", 4.0, 0.50, 0.35, 0.15),
    FINAL("Final", 8.0, 0.65, 0.25, 0.10);

    private final String displayName;
    private final double cumulativeHiddenBoost;
    private final double probBuenos;
    private final double probIntermedios;
    private final double probMalos;

    CupRound(String displayName, double cumulativeHiddenBoost,
             double probBuenos, double probIntermedios, double probMalos) {
        this.displayName = displayName;
        this.cumulativeHiddenBoost = cumulativeHiddenBoost;
        this.probBuenos = probBuenos;
        this.probIntermedios = probIntermedios;
        this.probMalos = probMalos;
    }

    public String getDisplayName() {
        return displayName;
    }

    
    public double getCumulativeHiddenBoost() {
        return cumulativeHiddenBoost;
    }

    public double getProbBuenos() {
        return probBuenos;
    }

    public double getProbIntermedios() {
        return probIntermedios;
    }

    public double getProbMalos() {
        return probMalos;
    }

    
    public double getDrawWeightExponent() {
        switch (this) {
            case DIECISEISAVOS: return 1.00;
            case OCTAVOS: return 1.25;
            case CUARTOS: return 1.50;
            case SEMIFINAL: return 1.80;
            case FINAL: default: return 2.20;
        }
    }
}
