/**
 * CLASE EXCLUSIVA DE CHIQUILEAGUE (NO UTILIZADA EN CHIQUICUP)
 *
 * Rondas eliminatorias de los Playoffs de la ChiquiLeague:
 * - OCTAVOS (16 equipos, boost rival = 0)
 * - CUARTOS (8 equipos, boost rival = 2)
 * - SEMIFINAL (4 equipos, boost rival = 4)
 * - FINAL (2 equipos, boost rival = 6)
 */
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
