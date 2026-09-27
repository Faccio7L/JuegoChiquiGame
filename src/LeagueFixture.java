import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * CLASE EXCLUSIVA DE CHIQUILEAGUE (NO UTILIZADA EN CHIQUICUP)
 *
 * Genera el fixture completo de 15 fechas para 30 clubes (15 en Zona A y 15 en Zona B).
 * En cada fecha se disputan:
 * - 7 partidos dentro de la Zona A
 * - 7 partidos dentro de la Zona B
 * - 1 partido Interzonal (Clásico entre el equipo libre de Zona A y el libre de Zona B)
 * Total: 15 partidos por fecha (14 simulados en segundo plano + 1 jugado por el usuario).
 */
public class LeagueFixture {

    public static class ClassicPair {
        private final String teamA;
        private final String teamB;
        private final String derbyName;

        public ClassicPair(String teamA, String teamB, String derbyName) {
            this.teamA = teamA;
            this.teamB = teamB;
            this.derbyName = derbyName;
        }

        public String getTeamA() {
            return teamA;
        }

        public String getTeamB() {
            return teamB;
        }

        public String getDerbyName() {
            return derbyName;
        }
    }

    public static List<ClassicPair> getClassicPairs(String userTeamName) {
        String name = (userTeamName != null && !userTeamName.trim().isEmpty()) ? userTeamName.trim() : "ChiquiTeam";
        return List.of(
                new ClassicPair("Boca Juniors", "River Plate", "Superclásico"),
                new ClassicPair("Racing Club", "Independiente", "Clásico de Avellaneda"),
                new ClassicPair("Rosario Central", "Newell's Old Boys", "Clásico Rosarino"),
                new ClassicPair("San Lorenzo", "Huracán", "Clásico Porteño"),
                new ClassicPair("Estudiantes LP", "Gimnasia LP", "Clásico Platense"),
                new ClassicPair("Belgrano de Córdoba", "Talleres de Córdoba", "Clásico Cordobés"),
                new ClassicPair("Lanús", "Banfield", "Clásico del Sur"),
                new ClassicPair("Vélez Sarsfield", "Unión de Santa Fe", "Duelo Interzonal"),
                new ClassicPair("Argentinos Juniors", "Platense", "Clásico Paternal vs Saavedra"),
                new ClassicPair("Defensa y Justicia", "Sarmiento de Junín", "Duelo Interzonal"),
                new ClassicPair("Atlético Tucumán", "Central Córdoba (SdE)", "Clásico del Norte"),
                new ClassicPair("Instituto de Córdoba", "Estudiantes (RC)", "Duelo Cordobés"),
                new ClassicPair("Independiente Rivadavia", "Gimnasia y Esgrima (M)", "Clásico Mendocino"),
                new ClassicPair("Tigre", "Barracas Central", "Duelo Metropolitano"),
                new ClassicPair(name, "Deportivo Riestra", "Interzonal Especial ChiquiLeague")
        );
    }

    public static List<String> getZoneATeams(String userTeamName) {
        List<String> list = new ArrayList<>();
        for (ClassicPair p : getClassicPairs(userTeamName)) {
            list.add(p.getTeamA());
        }
        return list;
    }

    public static List<String> getZoneBTeams() {
        return getZoneBTeams("ChiquiTeam");
    }

    public static List<String> getZoneBTeams(String userTeamName) {
        List<String> list = new ArrayList<>();
        for (ClassicPair p : getClassicPairs(userTeamName)) {
            list.add(p.getTeamB());
        }
        return list;
    }

    public static List<String> getZoneATeams() {
        return getZoneATeams("ChiquiTeam");
    }

    public static List<List<LeagueMatch>> generate15Matchdays() {
        return generate15Matchdays("ChiquiTeam");
    }

    /**
     * Genera la lista de partidos de las 15 fechas mediante el algoritmo de polígono / círculo.
     * En cada fecha se garantiza que cada equipo juegue exactamente 1 partido (en su zona o interzonal).
     */
    public static List<List<LeagueMatch>> generate15Matchdays(String userTeamName) {
        String name = (userTeamName != null && !userTeamName.trim().isEmpty()) ? userTeamName.trim() : "ChiquiTeam";
        List<String> zoneA = getZoneATeams(name);
        List<String> zoneB = getZoneBTeams(name);
        int n = 15;

        List<List<LeagueMatch>> matchdays = new ArrayList<>();
        List<Integer> circle = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            circle.add(i);
        }

        for (int r = 0; r < n; r++) {
            int matchdayNum = r + 1;
            List<LeagueMatch> fechaMatches = new ArrayList<>();

            // El equipo en circle.get(0) es el libre de la fecha en su zona y disputa el INTERZONAL
            int byeIdx = circle.get(0);
            String teamA_bye = zoneA.get(byeIdx);
            String teamB_bye = zoneB.get(byeIdx);
            boolean isUserInterzonal = isUser(teamA_bye, name) || isUser(teamB_bye, name);

            // 1. Partido Interzonal
            fechaMatches.add(new LeagueMatch(matchdayNum, teamA_bye, teamB_bye, true, isUserInterzonal));

            // 2. Siete partidos dentro de la Zona A
            for (int i = 1; i <= 7; i++) {
                int idx1 = circle.get(i);
                int idx2 = circle.get(15 - i);
                String t1 = zoneA.get(idx1);
                String t2 = zoneA.get(idx2);
                boolean isUserM = isUser(t1, name) || isUser(t2, name);
                // Alternar localía por fecha
                if ((r + i) % 2 == 0) {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t1, t2, false, isUserM));
                } else {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t2, t1, false, isUserM));
                }
            }

            // 3. Siete partidos dentro de la Zona B
            for (int i = 1; i <= 7; i++) {
                int idx1 = circle.get(i);
                int idx2 = circle.get(15 - i);
                String t1 = zoneB.get(idx1);
                String t2 = zoneB.get(idx2);
                boolean isUserM = isUser(t1, name) || isUser(t2, name);
                if ((r + i) % 2 == 0) {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t1, t2, false, isUserM));
                } else {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t2, t1, false, isUserM));
                }
            }

            matchdays.add(fechaMatches);

            // Rotar el círculo (el último pasa al frente)
            int last = circle.remove(circle.size() - 1);
            circle.add(0, last);
        }

        return matchdays;
    }

    private static boolean isUser(String team, String userTeamName) {
        if (team == null) return false;
        return team.equalsIgnoreCase(userTeamName) || "Tu Equipo".equalsIgnoreCase(team);
    }
}
