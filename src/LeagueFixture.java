import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

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

    public static class LeagueSetup {
        private final List<String> zoneATeams;
        private final List<String> zoneBTeams;
        private final List<List<LeagueMatch>> matchdays;

        public LeagueSetup(List<String> zoneATeams, List<String> zoneBTeams, List<List<LeagueMatch>> matchdays) {
            this.zoneATeams = zoneATeams;
            this.zoneBTeams = zoneBTeams;
            this.matchdays = matchdays;
        }

        public List<String> getZoneATeams() {
            return zoneATeams;
        }

        public List<String> getZoneBTeams() {
            return zoneBTeams;
        }

        public List<List<LeagueMatch>> getMatchdays() {
            return matchdays;
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

    public static LeagueSetup generateSetup(String userTeamName, Random random) {
        String name = (userTeamName != null && !userTeamName.trim().isEmpty()) ? userTeamName.trim() : "ChiquiTeam";
        List<ClassicPair> base = getClassicPairs(name);
        List<ClassicPair> cpuPairs = new ArrayList<>(base.subList(0, 14));
        Collections.shuffle(cpuPairs, random);

        List<String> zoneA = new ArrayList<>();
        List<String> zoneB = new ArrayList<>();

        for (ClassicPair p : cpuPairs) {
            if (random.nextBoolean()) {
                zoneA.add(p.getTeamA());
                zoneB.add(p.getTeamB());
            } else {
                zoneA.add(p.getTeamB());
                zoneB.add(p.getTeamA());
            }
        }

        zoneA.add(name);
        zoneB.add("Deportivo Riestra");

        List<Integer> order = new ArrayList<>();
        for (int i = 0; i < 15; i++) {
            order.add(i);
        }
        Collections.shuffle(order, random);

        List<String> shuffledZoneA = new ArrayList<>(15);
        List<String> shuffledZoneB = new ArrayList<>(15);
        for (int i = 0; i < 15; i++) {
            shuffledZoneA.add(zoneA.get(order.get(i)));
            shuffledZoneB.add(zoneB.get(order.get(i)));
        }

        List<List<LeagueMatch>> matchdays = buildMatchdays(shuffledZoneA, shuffledZoneB, name);
        return new LeagueSetup(shuffledZoneA, shuffledZoneB, matchdays);
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

    public static List<List<LeagueMatch>> generate15Matchdays(String userTeamName) {
        String name = (userTeamName != null && !userTeamName.trim().isEmpty()) ? userTeamName.trim() : "ChiquiTeam";
        List<String> zoneA = getZoneATeams(name);
        List<String> zoneB = getZoneBTeams(name);
        return buildMatchdays(zoneA, zoneB, name);
    }

    public static List<List<LeagueMatch>> buildMatchdays(List<String> zoneA, List<String> zoneB, String userTeamName) {
        int n = 15;
        List<List<LeagueMatch>> matchdays = new ArrayList<>();
        List<Integer> circle = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            circle.add(i);
        }

        for (int r = 0; r < n; r++) {
            int matchdayNum = r + 1;
            List<LeagueMatch> fechaMatches = new ArrayList<>();

            int byeIdx = circle.get(0);
            String teamA_bye = zoneA.get(byeIdx);
            String teamB_bye = zoneB.get(byeIdx);
            boolean isUserInterzonal = isUser(teamA_bye, userTeamName) || isUser(teamB_bye, userTeamName);

            fechaMatches.add(new LeagueMatch(matchdayNum, teamA_bye, teamB_bye, true, isUserInterzonal));

            for (int i = 1; i <= 7; i++) {
                int idx1 = circle.get(i);
                int idx2 = circle.get(15 - i);
                String t1 = zoneA.get(idx1);
                String t2 = zoneA.get(idx2);
                boolean isUserM = isUser(t1, userTeamName) || isUser(t2, userTeamName);
                if ((r + i) % 2 == 0) {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t1, t2, false, isUserM));
                } else {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t2, t1, false, isUserM));
                }
            }

            for (int i = 1; i <= 7; i++) {
                int idx1 = circle.get(i);
                int idx2 = circle.get(15 - i);
                String t1 = zoneB.get(idx1);
                String t2 = zoneB.get(idx2);
                boolean isUserM = isUser(t1, userTeamName) || isUser(t2, userTeamName);
                if ((r + i) % 2 == 0) {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t1, t2, false, isUserM));
                } else {
                    fechaMatches.add(new LeagueMatch(matchdayNum, t2, t1, false, isUserM));
                }
            }

            matchdays.add(fechaMatches);

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
