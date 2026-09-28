import java.util.Objects;


public class Club {

    private final String name;
    private final double weight;
    private final double baseMedia;
    private final ClubTier tier;

    public Club(String name, double weight, double baseMedia, ClubTier tier) {
        this.name = Objects.requireNonNull(name, "name");
        if (weight <= 0) {
            throw new IllegalArgumentException("weight debe ser > 0");
        }
        this.weight = weight;
        this.baseMedia = baseMedia;
        this.tier = Objects.requireNonNull(tier, "tier");
    }

    public Club(String name, double weight, double baseMedia) {
        this(name, weight, baseMedia, inferTier(weight, baseMedia));
    }

    private static ClubTier inferTier(double weight, double baseMedia) {
        if (weight >= 7.0 || baseMedia >= 78.0) {
            return ClubTier.BUENO;
        } else if (weight >= 4.5 || baseMedia >= 74.0) {
            return ClubTier.INTERMEDIO;
        } else {
            return ClubTier.MALO;
        }
    }

    public String getName() {
        return name;
    }

    public double getWeight() {
        return weight;
    }

    public double getBaseMedia() {
        return baseMedia;
    }

    public ClubTier getTier() {
        return tier;
    }

    @Override
    public String toString() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Club)) return false;
        Club club = (Club) o;
        return name.equals(club.name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }
}
