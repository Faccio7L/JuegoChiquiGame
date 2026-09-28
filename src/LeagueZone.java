
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
