/**
 * CLASE EXCLUSIVA DE CHIQUILEAGUE (NO UTILIZADA EN CHIQUICUP)
 *
 * Define las dos zonas de competencia de la ChiquiLeague:
 * - ZONA_A: 15 equipos (incluye a Tu Equipo).
 * - ZONA_B: 15 equipos rivales.
 */
public enum LeagueZone {
    ZONA_A("Zona A"),
    ZONA_B("Zona B");

    private final String displayName;

    LeagueZone(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
