/**
 * Un puesto de la formación (ej. "DFC #1") con el jugador que lo ocupa,
 * si ya fue asignado.
 */
public class TeamSlot {

    private final Position requiredPosition;
    private Player player;

    public TeamSlot(Position requiredPosition) {
        this.requiredPosition = requiredPosition;
    }

    public Position getRequiredPosition() {
        return requiredPosition;
    }

    public Player getPlayer() {
        return player;
    }

    public boolean isEmpty() {
        return player == null;
    }

    public void assign(Player player) {
        this.player = player;
    }

    /**
     * Media efectiva del jugador asignado a este slot, aplicando la
     * penalización por posición sobre la media base efectiva (incluyendo bono ORO/DIAMANTE):
     * -3 si es de la misma categoría pero distinta posición específica,
     * -12 si es de categoría distinta, 0 si coincide exactamente.
     */
    public double getEffectiveMedia() {
        if (player == null) {
            return 0.0;
        }
        double base = player.getEffectiveBaseMedia();
        if (isExactPosition(player.getNativePosition(), requiredPosition)) {
            return base;
        }
        if (player.getNativePosition().getCategory() == requiredPosition.getCategory()) {
            return base - 3.0;
        }
        return base - 12.0;
    }

    public static boolean isExactPosition(Position p1, Position p2) {
        if (p1 == p2) return true;
        if ((p1 == Position.DFC || p1 == Position.CEN) && (p2 == Position.DFC || p2 == Position.CEN)) return true;
        if ((p1 == Position.EL || p1 == Position.EI) && (p2 == Position.EL || p2 == Position.EI)) return true;
        return false;
    }
}
