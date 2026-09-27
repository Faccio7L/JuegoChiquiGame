/**
 * Las 5 rondas de la copa de 32 equipos (32 -> 16 -> 8 -> 4 -> 2 -> campeón).
 * Cada ronda define:
 * - el boost oculto ACUMULADO que recibe el rival en esa instancia:
 *   16vos: -2.0
 *   8vos:   0.0
 *   4tos:  +2.0
 *   Semis: +4.0
 *   Final: +8.0 (mejora real sin que el rival pase de 90)
 * - las probabilidades de sorteo por categorías discretas de clubes:
 *   [Buenos, Intermedios, Malos]
 *   16vos: 0%, 30%, 70%
 *   8vos:  5%, 50%, 45%
 *   4tos:  25%, 50%, 25%
 *   Semis: 50%, 35%, 15%
 *   Final: 65%, 25%, 10%
 */
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

    /** Boost total (acumulado hasta esta ronda inclusive) que se suma a la media del rival. Invisible para el usuario. */
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

    /** Exponente de respaldo si se necesitara sorteo continuo tradicional. */
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
