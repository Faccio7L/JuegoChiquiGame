import java.util.Collections;
import java.util.List;


public final class Formation {

    /** Las 11 posiciones de slot, en el orden en que se completan durante el draft. */
    public static final List<Position> SLOTS = Collections.unmodifiableList(java.util.Arrays.asList(
            Position.ARQ,
            Position.LI, Position.DFC, Position.DFC, Position.LD,
            Position.MC, Position.MC, Position.MCO,
            Position.ED, Position.DC, Position.EL
    ));

    private Formation() {
    }
}
