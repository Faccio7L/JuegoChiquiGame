import java.util.Objects;

/**
 * CLASE EXCLUSIVA DE CHIQUILEAGUE (NO UTILIZADA EN CHIQUICUP)
 *
 * Representa la posición y estadística de un club dentro de su zona en la ChiquiLeague:
 * Puntos (3 por victoria, 1 por empate, 0 por derrota), PJ, PG, PE, PP, GF, GC y Diferencia de Gol.
 */
public class LeagueTeamStanding implements Comparable<LeagueTeamStanding> {

    private final String teamName;
    private final LeagueZone zone;
    private double baseMedia;
    private final boolean isUserTeam;

    private int played;
    private int won;
    private int drawn;
    private int lost;
    private int goalsFor;
    private int goalsAgainst;

    public LeagueTeamStanding(String teamName, LeagueZone zone, double baseMedia, boolean isUserTeam) {
        this.teamName = Objects.requireNonNull(teamName, "teamName");
        this.zone = Objects.requireNonNull(zone, "zone");
        this.baseMedia = baseMedia;
        this.isUserTeam = isUserTeam;
    }

    public void recordMatch(int gf, int ga) {
        this.played++;
        this.goalsFor += gf;
        this.goalsAgainst += ga;
        if (gf > ga) {
            this.won++;
        } else if (gf == ga) {
            this.drawn++;
        } else {
            this.lost++;
        }
    }

    public int getPoints() {
        return (won * 3) + drawn;
    }

    public int getGoalDifference() {
        return goalsFor - goalsAgainst;
    }

    public String getTeamName() {
        return teamName;
    }

    public LeagueZone getZone() {
        return zone;
    }

    public double getBaseMedia() {
        return baseMedia;
    }

    public void setBaseMedia(double baseMedia) {
        this.baseMedia = baseMedia;
    }

    public boolean isUserTeam() {
        return isUserTeam;
    }

    public int getPlayed() {
        return played;
    }

    public int getWon() {
        return won;
    }

    public int getDrawn() {
        return drawn;
    }

    public int getLost() {
        return lost;
    }

    public int getGoalsFor() {
        return goalsFor;
    }

    public int getGoalsAgainst() {
        return goalsAgainst;
    }

    @Override
    public int compareTo(LeagueTeamStanding o) {
        // 1. Puntos descendente
        int ptsComp = Integer.compare(o.getPoints(), this.getPoints());
        if (ptsComp != 0) return ptsComp;

        // 2. Diferencia de gol descendente
        int diffComp = Integer.compare(o.getGoalDifference(), this.getGoalDifference());
        if (diffComp != 0) return diffComp;

        // 3. Goles a favor descendente
        int gfComp = Integer.compare(o.getGoalsFor(), this.getGoalsFor());
        if (gfComp != 0) return gfComp;

        // 4. Nombre alfabético
        return this.teamName.compareToIgnoreCase(o.teamName);
    }

    @Override
    public String toString() {
        return String.format("%-22s | PTS: %2d | PJ: %2d | PG: %2d | PE: %2d | PP: %2d | GF: %2d | GC: %2d | DIF: %+3d",
                teamName, getPoints(), played, won, drawn, lost, goalsFor, goalsAgainst, getGoalDifference());
    }
}
