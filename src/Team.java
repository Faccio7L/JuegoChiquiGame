import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;


public class Team {

    private String name = "ChiquiTeam";
    private final List<TeamSlot> slots;

    public Team() {
        this("ChiquiTeam");
    }

    public Team(String name) {
        this.name = (name != null && !name.trim().isEmpty()) ? name.trim() : "ChiquiTeam";
        this.slots = new ArrayList<>();
        for (Position p : Formation.SLOTS) {
            slots.add(new TeamSlot(p));
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = (name != null && !name.trim().isEmpty()) ? name.trim() : "ChiquiTeam";
    }

    public List<TeamSlot> getSlots() {
        return slots;
    }

    public boolean isComplete() {
        return slots.stream().noneMatch(TeamSlot::isEmpty);
    }

    public boolean hasEmptySlotFor(Position position) {
        return slots.stream()
                .filter(TeamSlot::isEmpty)
                .anyMatch(s -> s.getRequiredPosition() == position);
    }

    public boolean hasEmptySlotFor(PositionCategory category) {
        return slots.stream()
                .filter(TeamSlot::isEmpty)
                .anyMatch(s -> s.getRequiredPosition().getCategory() == category);
    }

    
    public TeamSlot assignPlayer(Player player) {
        TeamSlot exact = findEmptySlot(s -> s.getRequiredPosition() == player.getNativePosition());
        if (exact != null) {
            exact.assign(player);
            return exact;
        }
        TeamSlot sameCategory = findEmptySlot(
                s -> s.getRequiredPosition().getCategory() == player.getNativePosition().getCategory());
        if (sameCategory != null) {
            sameCategory.assign(player);
            return sameCategory;
        }
        TeamSlot any = findEmptySlot(s -> true);
        if (any != null) {
            any.assign(player);
        }
        return any;
    }

    private TeamSlot findEmptySlot(java.util.function.Predicate<TeamSlot> matcher) {
        return slots.stream()
                .filter(TeamSlot::isEmpty)
                .filter(matcher)
                .findFirst()
                .orElse(null);
    }

    
    public Map<PositionCategory, Long> countEmptySlotsByCategory() {
        Map<PositionCategory, Long> result = new EnumMap<>(PositionCategory.class);
        for (PositionCategory cat : PositionCategory.values()) {
            long count = slots.stream()
                    .filter(TeamSlot::isEmpty)
                    .filter(s -> s.getRequiredPosition().getCategory() == cat)
                    .count();
            result.put(cat, count);
        }
        return result;
    }

    
    public double getEffectiveRating() {
        List<TeamSlot> filled = new ArrayList<>();
        for (TeamSlot s : slots) {
            if (!s.isEmpty()) {
                filled.add(s);
            }
        }
        if (filled.isEmpty()) {
            return 0.0;
        }
        double sum = 0.0;
        for (TeamSlot s : filled) {
            sum += s.getEffectiveMedia();
        }
        return sum / filled.size();
    }
}
