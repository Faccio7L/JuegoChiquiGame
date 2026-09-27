/**
 * Especialización de los 32 clubes de la copa en 3 categorías discretas:
 * - BUENO: Grandes históricos (River, Boca, Racing, Vélez, Estudiantes, Independiente, San Lorenzo).
 * - INTERMEDIO: Clubes de Primera División de mitad de tabla hacia arriba.
 * - MALO: Clubes con menor presupuesto / promedio / wildcards del ascenso.
 */
public enum ClubTier {
    BUENO,
    INTERMEDIO,
    MALO
}
