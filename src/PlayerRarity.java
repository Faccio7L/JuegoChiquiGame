
public enum PlayerRarity {
    NORMAL(0.0, "normal", "Normal"),
    ORO(3.0, "oro", "Oro"),
    DIAMANTE(5.0, "diamante", "Diamante"),
    LEYENDA(0.0, "leyenda", "Ídolo");

    private final double bonusMedia;
    private final String code;
    private final String displayName;

    PlayerRarity(double bonusMedia, String code, String displayName) {
        this.bonusMedia = bonusMedia;
        this.code = code;
        this.displayName = displayName;
    }

    public double getBonusMedia() {
        return bonusMedia;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }
}
