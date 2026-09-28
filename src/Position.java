
public enum Position {
    ARQ(PositionCategory.ARQUERO),

    LI(PositionCategory.DEFENSA),
    DFC(PositionCategory.DEFENSA),
    CEN(PositionCategory.DEFENSA),
    LD(PositionCategory.DEFENSA),

    MC(PositionCategory.MEDIOCAMPO),
    MCO(PositionCategory.MEDIOCAMPO),

    ED(PositionCategory.DELANTERO),
    DC(PositionCategory.DELANTERO),
    EL(PositionCategory.DELANTERO),
    EI(PositionCategory.DELANTERO);

    private final PositionCategory category;

    Position(PositionCategory category) {
        this.category = category;
    }

    public PositionCategory getCategory() {
        return category;
    }
}
