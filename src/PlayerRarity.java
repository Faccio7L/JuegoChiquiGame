/**
 * Rarezas especiales de cartas de jugador en el draft de ChiquiCup:
 * - NORMAL: ~97.5% de probabilidad base
 * - ORO: ~1.40% de probabilidad (+3 de media explícito, reborde amarillo)
 * - DIAMANTE: ~0.70% de probabilidad (+5 de media explícito, bordes violetas)
 * - LEYENDA: ~0.40% de probabilidad (Ídolos históricos del fútbol argentino, media pico 82-91, bordes celestes/holográficos)
 *
 * Probabilidad total acumulada de boost por cuadradito ~ 2.5%, lo que da aproximadamente
 * un 60% de chances por partida de conseguir al menos un boost (Oro, Diamante o Ídolo).
 */
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
