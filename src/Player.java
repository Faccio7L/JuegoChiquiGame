import java.util.Objects;

/**
 * Un jugador ofrecido durante el draft.
 * Soporta rarezas especiales (ORO +3 de media, DIAMANTE +5 de media).
 */
public class Player {

    private final String name;
    private final String club;
    private final Position nativePosition;
    private final double baseMedia;
    private final PlayerRarity rarity;

    public Player(String name, String club, Position nativePosition, double baseMedia, PlayerRarity rarity) {
        this.name = Objects.requireNonNull(name, "name");
        this.club = Objects.requireNonNull(club, "club");
        this.nativePosition = Objects.requireNonNull(nativePosition, "nativePosition");
        this.baseMedia = baseMedia;
        this.rarity = rarity != null ? rarity : PlayerRarity.NORMAL;
    }

    public Player(String name, String club, Position nativePosition, double baseMedia) {
        this(name, club, nativePosition, baseMedia, PlayerRarity.NORMAL);
    }

    public Player(String name, Position nativePosition, double baseMedia) {
        this(name, "Libre", nativePosition, baseMedia, PlayerRarity.NORMAL);
    }

    public Player withRarity(PlayerRarity newRarity) {
        return new Player(this.name, this.club, this.nativePosition, this.baseMedia, newRarity);
    }

    public String getName() {
        return name;
    }

    public String getClub() {
        return club;
    }

    public Position getNativePosition() {
        return nativePosition;
    }

    public double getBaseMedia() {
        return baseMedia;
    }

    public PlayerRarity getRarity() {
        return rarity;
    }

    public double getBonusMedia() {
        return rarity.getBonusMedia();
    }

    /**
     * Media base efectiva sumando el bono por rareza (+3 ORO, +5 DIAMANTE).
     */
    public double getEffectiveBaseMedia() {
        return baseMedia + rarity.getBonusMedia();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return Objects.equals(name, player.name) && Objects.equals(club, player.club);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, club);
    }

    @Override
    public String toString() {
        return String.format("%s [%s] (%s, %.1f + %.0f %s)", name, club, nativePosition, baseMedia, getBonusMedia(), rarity);
    }
}
