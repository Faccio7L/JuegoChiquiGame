import java.util.*;


public class LeagueEngine {

    private final Random random;
    private Team userTeam;
    private List<Player> allPlayersMasterList = new ArrayList<>();
    private final Map<String, Club> clubsByName = new HashMap<>();

    
    private final Map<String, LeagueTeamStanding> standingsA = new LinkedHashMap<>();
    private final Map<String, LeagueTeamStanding> standingsB = new LinkedHashMap<>();

    
    private List<List<LeagueMatch>> fixture = new ArrayList<>();
    private int currentMatchdayIndex = 0; 
    private boolean regularSeasonFinished = false;

    
    private boolean playoffPhase = false;
    private LeaguePlayoffRound currentPlayoffRound;
    private List<LeaguePlayoffMatch> currentPlayoffMatches = new ArrayList<>();
    private List<LeaguePlayoffMatch> lastPlayedPlayoffMatches = new ArrayList<>();
    private final List<List<LeaguePlayoffMatch>> allPlayoffRoundsHistory = new ArrayList<>();
    private boolean userQualifiedForPlayoffs = false;
    private boolean userEliminated = false;
    private boolean userWonLeague = false;
    private String userTeamName = "ChiquiTeam";

    public boolean isUser(String team) {
        if (team == null) return false;
        return team.equalsIgnoreCase(userTeamName) || "Tu Equipo".equalsIgnoreCase(team);
    }

    public String getUserTeamName() {
        return userTeamName;
    }

    public LeagueEngine(Random random) {
        this.random = Objects.requireNonNull(random, "random");
    }

    public void initLeague(Team userTeam, List<Player> players, List<Club> clubs) {
        this.userTeam = Objects.requireNonNull(userTeam, "userTeam");
        this.userTeamName = (userTeam.getName() != null && !userTeam.getName().trim().isEmpty())
                ? userTeam.getName().trim() : "ChiquiTeam";
        this.allPlayersMasterList = new ArrayList<>(players);
        this.clubsByName.clear();
        for (Club c : clubs) {
            clubsByName.put(c.getName(), c);
        }

        LeagueFixture.LeagueSetup setup = LeagueFixture.generateSetup(userTeamName, random);

        standingsA.clear();
        for (String teamName : setup.getZoneATeams()) {
            double media = isUser(teamName) ? userTeam.getEffectiveRating() : getClubMedia(teamName);
            boolean isUserTeam = isUser(teamName);
            standingsA.put(teamName, new LeagueTeamStanding(teamName, LeagueZone.ZONA_A, media, isUserTeam));
        }

        standingsB.clear();
        for (String teamName : setup.getZoneBTeams()) {
            double media = getClubMedia(teamName);
            standingsB.put(teamName, new LeagueTeamStanding(teamName, LeagueZone.ZONA_B, media, false));
        }

        this.fixture = setup.getMatchdays();
        this.currentMatchdayIndex = 0;
        this.regularSeasonFinished = false;

        
        this.playoffPhase = false;
        this.currentPlayoffRound = null;
        this.currentPlayoffMatches.clear();
        this.lastPlayedPlayoffMatches.clear();
        this.allPlayoffRoundsHistory.clear();
        this.userQualifiedForPlayoffs = false;
        this.userEliminated = false;
        this.userWonLeague = false;
    }

    
    public LeagueMatch getCurrentUserMatch() {
        if (currentMatchdayIndex >= fixture.size() || regularSeasonFinished) {
            return null;
        }
        for (LeagueMatch m : fixture.get(currentMatchdayIndex)) {
            if (m.isUserMatch()) {
                return m;
            }
        }
        return null;
    }

    
    public List<LeagueMatch> playCurrentMatchday() {
        if (regularSeasonFinished || playoffPhase) {
            throw new IllegalStateException("La fase regular ya ha finalizado.");
        }
        if (currentMatchdayIndex >= fixture.size()) {
            throw new IllegalStateException("No quedan fechas por jugar.");
        }

        List<LeagueMatch> matches = fixture.get(currentMatchdayIndex);

        for (LeagueMatch m : matches) {
            if (m.isUserMatch()) {
                
                boolean homeIsUser = isUser(m.getHomeTeam());
                String opponentName = homeIsUser ? m.getAwayTeam() : m.getHomeTeam();
                double userRating = userTeam.getEffectiveRating();
                double opponentRating = getClubMedia(opponentName);

                List<Player> userAttackers = getUserOffensivePlayers();
                List<Player> rivalPlayers = getPlayersForClub(opponentName);

                MatchResult result = simulate90Minutes(userRating, opponentRating, homeIsUser, userAttackers, rivalPlayers, opponentName);
                m.setResult(result.getFinalHomeGoals(), result.getFinalAwayGoals(), result.getEvents());

                
                recordStandingMatch(m.getHomeTeam(), result.getFinalHomeGoals(), result.getFinalAwayGoals());
                recordStandingMatch(m.getAwayTeam(), result.getFinalAwayGoals(), result.getFinalHomeGoals());
            } else {
                
                double homeRating = getClubMedia(m.getHomeTeam());
                double awayRating = getClubMedia(m.getAwayTeam());
                List<Player> homeScorers = getPlayersForClub(m.getHomeTeam());
                List<Player> awayScorers = getPlayersForClub(m.getAwayTeam());

                MatchResult result = simulate90MinutesCPU(homeRating, awayRating, m.getHomeTeam(), m.getAwayTeam(), homeScorers, awayScorers);
                m.setResult(result.getFinalHomeGoals(), result.getFinalAwayGoals(), result.getEvents());

                recordStandingMatch(m.getHomeTeam(), result.getFinalHomeGoals(), result.getFinalAwayGoals());
                recordStandingMatch(m.getAwayTeam(), result.getFinalAwayGoals(), result.getFinalHomeGoals());
            }
        }

        currentMatchdayIndex++;

        
        if (currentMatchdayIndex >= fixture.size()) {
            regularSeasonFinished = true;
            initPlayoffs();
        }

        return matches;
    }

    
    private void initPlayoffs() {
        playoffPhase = true;
        currentPlayoffRound = LeaguePlayoffRound.OCTAVOS;

        List<LeagueTeamStanding> sortedA = getSortedStandingsA();
        List<LeagueTeamStanding> sortedB = getSortedStandingsB();

        
        userQualifiedForPlayoffs = false;
        for (int i = 0; i < 8; i++) {
            if (sortedA.get(i).isUserTeam()) {
                userQualifiedForPlayoffs = true;
                break;
            }
        }

        currentPlayoffMatches.clear();
        lastPlayedPlayoffMatches.clear();

        
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedA.get(0).getTeamName(), sortedB.get(7).getTeamName()));
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedB.get(3).getTeamName(), sortedA.get(4).getTeamName()));
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedA.get(1).getTeamName(), sortedB.get(6).getTeamName()));
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedB.get(2).getTeamName(), sortedA.get(5).getTeamName()));
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedB.get(0).getTeamName(), sortedA.get(7).getTeamName()));
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedA.get(3).getTeamName(), sortedB.get(4).getTeamName()));
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedB.get(1).getTeamName(), sortedA.get(6).getTeamName()));
        
        currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.OCTAVOS, sortedA.get(2).getTeamName(), sortedB.get(5).getTeamName()));
    }

    private LeaguePlayoffMatch createPlayoffMatch(LeaguePlayoffRound round, String team1, String team2) {
        boolean isUser = isUser(team1) || isUser(team2);
        return new LeaguePlayoffMatch(round, team1, team2, isUser);
    }

    
    public List<LeaguePlayoffMatch> playCurrentPlayoffRound() {
        if (!playoffPhase || currentPlayoffRound == null) {
            throw new IllegalStateException("No hay ronda de playoffs activa.");
        }

        List<LeaguePlayoffMatch> roundMatches = new ArrayList<>(currentPlayoffMatches);
        List<String> winners = new ArrayList<>();

        for (LeaguePlayoffMatch match : roundMatches) {
            String home = match.getHomeTeam();
            String away = match.getAwayTeam();
            boolean isUser = match.isUserMatch();

            if (isUser) {
                boolean homeIsUser = isUser(home);
                String opponentName = homeIsUser ? away : home;
                double userRating = userTeam.getEffectiveRating();
                
                double opponentRating = getClubMedia(opponentName) + currentPlayoffRound.getRivalHiddenBoost();

                List<Player> userAttackers = getUserOffensivePlayers();
                List<Player> rivalPlayers = getPlayersForClub(opponentName);

                MatchResult result = simulatePlayoffKnockoutMatch(userRating, opponentRating, homeIsUser, userAttackers, rivalPlayers, opponentName);
                String winner = (homeIsUser == result.isHomeWon()) ? userTeamName : opponentName;
                match.setResult(result, winner);
                winners.add(winner);

                if (!isUser(winner)) {
                    userEliminated = true;
                }
            } else {
                
                double homeRating = getClubMedia(home);
                double awayRating = getClubMedia(away);
                List<Player> homeScorers = getPlayersForClub(home);
                List<Player> awayScorers = getPlayersForClub(away);

                MatchResult result = simulatePlayoffKnockoutMatchCPU(homeRating, awayRating, home, away, homeScorers, awayScorers);
                String winner = result.isHomeWon() ? home : away;
                match.setResult(result, winner);
                winners.add(winner);
            }
        }

        
        this.lastPlayedPlayoffMatches = new ArrayList<>(roundMatches);
        this.allPlayoffRoundsHistory.add(new ArrayList<>(roundMatches));

        
        if (currentPlayoffRound == LeaguePlayoffRound.OCTAVOS) {
            currentPlayoffRound = LeaguePlayoffRound.CUARTOS;
            currentPlayoffMatches.clear();
            
            currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.CUARTOS, winners.get(0), winners.get(1)));
            currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.CUARTOS, winners.get(2), winners.get(3)));
            currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.CUARTOS, winners.get(4), winners.get(5)));
            currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.CUARTOS, winners.get(6), winners.get(7)));
        } else if (currentPlayoffRound == LeaguePlayoffRound.CUARTOS) {
            currentPlayoffRound = LeaguePlayoffRound.SEMIFINAL;
            currentPlayoffMatches.clear();
            
            currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.SEMIFINAL, winners.get(0), winners.get(1)));
            currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.SEMIFINAL, winners.get(2), winners.get(3)));
        } else if (currentPlayoffRound == LeaguePlayoffRound.SEMIFINAL) {
            currentPlayoffRound = LeaguePlayoffRound.FINAL;
            currentPlayoffMatches.clear();
            
            currentPlayoffMatches.add(createPlayoffMatch(LeaguePlayoffRound.FINAL, winners.get(0), winners.get(1)));
        } else if (currentPlayoffRound == LeaguePlayoffRound.FINAL) {
            currentPlayoffRound = null;
            currentPlayoffMatches.clear();
            String champion = winners.get(0);
            if (isUser(champion)) {
                userWonLeague = true;
            }
        }

        return roundMatches;
    }

    private void recordStandingMatch(String teamName, int gf, int ga) {
        if (standingsA.containsKey(teamName)) {
            standingsA.get(teamName).recordMatch(gf, ga);
        } else if (standingsB.containsKey(teamName)) {
            standingsB.get(teamName).recordMatch(gf, ga);
        }
    }

    private double getClubMedia(String clubName) {
        if (isUser(clubName)) {
            return userTeam != null ? userTeam.getEffectiveRating() : 70.0;
        }
        Club c = clubsByName.get(clubName);
        return c != null ? c.getBaseMedia() : 70.0;
    }

    private List<Player> getPlayersForClub(String clubName) {
        Set<String> userAssignedNames = new HashSet<>();
        if (userTeam != null) {
            for (TeamSlot s : userTeam.getSlots()) {
                if (!s.isEmpty()) {
                    userAssignedNames.add(s.getPlayer().getName().toLowerCase());
                }
            }
        }
        List<Player> list = new ArrayList<>();
        for (Player p : allPlayersMasterList) {
            if (p.getClub().equalsIgnoreCase(clubName) && p.getNativePosition() != Position.ARQ) {
                if (!userAssignedNames.contains(p.getName().toLowerCase())) {
                    list.add(p);
                }
            }
        }
        return list;
    }

    private List<Player> getUserOffensivePlayers() {
        List<Player> list = new ArrayList<>();
        if (userTeam != null) {
            for (TeamSlot s : userTeam.getSlots()) {
                if (!s.isEmpty()) {
                    Player p = s.getPlayer();
                    if (p.getNativePosition().getCategory() == PositionCategory.DELANTERO ||
                        p.getNativePosition().getCategory() == PositionCategory.MEDIOCAMPO ||
                        p.getNativePosition() == Position.LI || p.getNativePosition() == Position.LD) {
                        list.add(p);
                    }
                }
            }
        }
        return list;
    }

    private List<String> getPenaltyKickers(String clubName, boolean isUser) {
        List<String> kickers = new ArrayList<>();
        if (isUser && userTeam != null) {
            List<Player> players = new ArrayList<>();
            for (TeamSlot s : userTeam.getSlots()) {
                if (!s.isEmpty()) {
                    players.add(s.getPlayer());
                }
            }
            players.sort((p1, p2) -> {
                int pComp = Integer.compare(positionPriority(p1.getNativePosition()), positionPriority(p2.getNativePosition()));
                if (pComp != 0) return pComp;
                return Double.compare(p2.getBaseMedia(), p1.getBaseMedia());
            });
            for (Player p : players) {
                kickers.add(p.getName());
            }
        } else {
            List<Player> players = getAllPlayersForClub(clubName);
            players.sort((p1, p2) -> {
                int pComp = Integer.compare(positionPriority(p1.getNativePosition()), positionPriority(p2.getNativePosition()));
                if (pComp != 0) return pComp;
                return Double.compare(p2.getBaseMedia(), p1.getBaseMedia());
            });
            for (Player p : players) {
                kickers.add(p.getName());
            }
        }
        if (kickers.isEmpty()) {
            kickers.add(clubName);
        }
        return kickers;
    }

    private List<Player> getAllPlayersForClub(String clubName) {
        List<Player> list = new ArrayList<>();
        for (Player p : allPlayersMasterList) {
            if (p.getClub().equalsIgnoreCase(clubName)) {
                list.add(p);
            }
        }
        return list;
    }

    private int positionPriority(Position pos) {
        if (pos == null) return 99;
        return switch (pos.getCategory()) {
            case DELANTERO -> 1;
            case MEDIOCAMPO -> 2;
            case DEFENSA -> 3;
            case ARQUERO -> 4;
        };
    }

    
    private MatchResult simulate90Minutes(double userRating, double opponentRating, boolean homeIsUser,
                                          List<Player> userAttackers, List<Player> rivalPlayers, String opponentName) {
        MatchResult result = new MatchResult();
        double homeRating = homeIsUser ? userRating : opponentRating;
        double awayRating = homeIsUser ? opponentRating : userRating;
        double pHomeGivenGoal = MatchSimulator.calculateGoalProbability(homeRating, awayRating);

        for (int m = 1; m <= MatchSimulator.REGULATION_MINUTES; m++) {
            if (random.nextDouble() < MatchSimulator.GOAL_PROBABILITY_PER_MINUTE) {
                boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                String scorer;
                if (homeScores) {
                    if (homeIsUser) {
                        scorer = !userAttackers.isEmpty() ? userAttackers.get(random.nextInt(userAttackers.size())).getName() : userTeamName;
                    } else {
                        scorer = !rivalPlayers.isEmpty() ? rivalPlayers.get(random.nextInt(rivalPlayers.size())).getName() : opponentName;
                    }
                } else {
                    if (homeIsUser) {
                        scorer = !rivalPlayers.isEmpty() ? rivalPlayers.get(random.nextInt(rivalPlayers.size())).getName() : opponentName;
                    } else {
                        scorer = !userAttackers.isEmpty() ? userAttackers.get(random.nextInt(userAttackers.size())).getName() : userTeamName;
                    }
                }
                result.addGoal(new GoalEvent(m, homeScores, scorer));
            }
        }
        return result;
    }

    
    private MatchResult simulate90MinutesCPU(double homeRating, double awayRating, String homeTeam, String awayTeam,
                                             List<Player> homeScorers, List<Player> awayScorers) {
        MatchResult result = new MatchResult();
        double pHomeGivenGoal = MatchSimulator.calculateGoalProbability(homeRating, awayRating);

        for (int m = 1; m <= MatchSimulator.REGULATION_MINUTES; m++) {
            if (random.nextDouble() < MatchSimulator.GOAL_PROBABILITY_PER_MINUTE) {
                boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                String scorer;
                if (homeScores) {
                    scorer = !homeScorers.isEmpty() ? homeScorers.get(random.nextInt(homeScorers.size())).getName() : homeTeam;
                } else {
                    scorer = !awayScorers.isEmpty() ? awayScorers.get(random.nextInt(awayScorers.size())).getName() : awayTeam;
                }
                result.addGoal(new GoalEvent(m, homeScores, scorer));
            }
        }
        return result;
    }

    
    private MatchResult simulatePlayoffKnockoutMatch(double userRating, double opponentRating, boolean homeIsUser,
                                                     List<Player> userAttackers, List<Player> rivalPlayers, String opponentName) {
        MatchResult result = new MatchResult();
        double homeRating = homeIsUser ? userRating : opponentRating;
        double awayRating = homeIsUser ? opponentRating : userRating;
        double pHomeGivenGoal = MatchSimulator.calculateGoalProbability(homeRating, awayRating);

        
        for (int m = 1; m <= MatchSimulator.REGULATION_MINUTES; m++) {
            if (random.nextDouble() < MatchSimulator.GOAL_PROBABILITY_PER_MINUTE) {
                boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                String scorer = pickScorer(homeScores, homeIsUser, userAttackers, rivalPlayers, opponentName);
                result.addGoal(new GoalEvent(m, homeScores, scorer));
            }
        }

        boolean tiedAt90 = result.getHomeGoalsAt(90) == result.getAwayGoalsAt(90);
        if (tiedAt90) {
            result.markExtraTime();
            for (int m = 91; m <= MatchSimulator.EXTRA_TIME_MINUTES; m++) {
                if (random.nextDouble() < MatchSimulator.GOAL_PROBABILITY_PER_MINUTE) {
                    boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                    String scorer = pickScorer(homeScores, homeIsUser, userAttackers, rivalPlayers, opponentName);
                    result.addGoal(new GoalEvent(m, homeScores, scorer));
                }
            }
        }

        boolean tiedAt120 = result.getFinalHomeGoals() == result.getFinalAwayGoals();
        if (tiedAt120) {
            boolean homeIsBetter = homeRating >= awayRating;
            double homeAccuracy = homeIsBetter ? MatchSimulator.BEST_TEAM_PENALTY_ACCURACY : MatchSimulator.WORST_TEAM_PENALTY_ACCURACY;
            double awayAccuracy = homeIsBetter ? MatchSimulator.WORST_TEAM_PENALTY_ACCURACY : MatchSimulator.BEST_TEAM_PENALTY_ACCURACY;

            List<String> homeKickers = getPenaltyKickers(homeIsUser ? userTeamName : opponentName, homeIsUser);
            List<String> awayKickers = getPenaltyKickers(homeIsUser ? opponentName : userTeamName, !homeIsUser);

            int homeScore = 0;
            int awayScore = 0;

            for (int r = 1; r <= 5; r++) {
                boolean hGoal = random.nextDouble() < homeAccuracy;
                if (hGoal) homeScore++;
                String hKicker = homeKickers.get((r - 1) % homeKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(r, true, hKicker, hGoal, homeScore, awayScore));

                int homeRem = 5 - r;
                int awayRem = 5 - (r - 1);
                if (homeScore > awayScore + awayRem || awayScore > homeScore + homeRem) break;

                boolean aGoal = random.nextDouble() < awayAccuracy;
                if (aGoal) awayScore++;
                String aKicker = awayKickers.get((r - 1) % awayKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(r, false, aKicker, aGoal, homeScore, awayScore));

                if (homeScore > awayScore + (5 - r) || awayScore > homeScore + (5 - r)) break;
            }

            int roundNum = 6;
            while (homeScore == awayScore) {
                boolean hGoal = random.nextDouble() < homeAccuracy;
                if (hGoal) homeScore++;
                String hKicker = homeKickers.get((roundNum - 1) % homeKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(roundNum, true, hKicker, hGoal, homeScore, awayScore));

                boolean aGoal = random.nextDouble() < awayAccuracy;
                if (aGoal) awayScore++;
                String aKicker = awayKickers.get((roundNum - 1) % awayKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(roundNum, false, aKicker, aGoal, homeScore, awayScore));
                roundNum++;
            }

            result.setPenaltyResult(homeScore, awayScore);
            result.setHomeWon(homeScore > awayScore);
        } else {
            result.setHomeWon(result.getFinalHomeGoals() > result.getFinalAwayGoals());
        }

        return result;
    }

    private String pickScorer(boolean homeScores, boolean homeIsUser, List<Player> userAttackers, List<Player> rivalPlayers, String opponentName) {
        if (homeScores) {
            if (homeIsUser) {
                return !userAttackers.isEmpty() ? userAttackers.get(random.nextInt(userAttackers.size())).getName() : userTeamName;
            } else {
                return !rivalPlayers.isEmpty() ? rivalPlayers.get(random.nextInt(rivalPlayers.size())).getName() : opponentName;
            }
        } else {
            if (homeIsUser) {
                return !rivalPlayers.isEmpty() ? rivalPlayers.get(random.nextInt(rivalPlayers.size())).getName() : opponentName;
            } else {
                return !userAttackers.isEmpty() ? userAttackers.get(random.nextInt(userAttackers.size())).getName() : userTeamName;
            }
        }
    }

    
    private MatchResult simulatePlayoffKnockoutMatchCPU(double homeRating, double awayRating, String homeTeam, String awayTeam,
                                                        List<Player> homeScorers, List<Player> awayScorers) {
        MatchResult result = new MatchResult();
        double pHomeGivenGoal = MatchSimulator.calculateGoalProbability(homeRating, awayRating);

        for (int m = 1; m <= MatchSimulator.REGULATION_MINUTES; m++) {
            if (random.nextDouble() < MatchSimulator.GOAL_PROBABILITY_PER_MINUTE) {
                boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                String scorer = homeScores ? (!homeScorers.isEmpty() ? homeScorers.get(random.nextInt(homeScorers.size())).getName() : homeTeam)
                                           : (!awayScorers.isEmpty() ? awayScorers.get(random.nextInt(awayScorers.size())).getName() : awayTeam);
                result.addGoal(new GoalEvent(m, homeScores, scorer));
            }
        }

        boolean tiedAt90 = result.getHomeGoalsAt(90) == result.getAwayGoalsAt(90);
        if (tiedAt90) {
            result.markExtraTime();
            for (int m = 91; m <= MatchSimulator.EXTRA_TIME_MINUTES; m++) {
                if (random.nextDouble() < MatchSimulator.GOAL_PROBABILITY_PER_MINUTE) {
                    boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                    String scorer = homeScores ? (!homeScorers.isEmpty() ? homeScorers.get(random.nextInt(homeScorers.size())).getName() : homeTeam)
                                               : (!awayScorers.isEmpty() ? awayScorers.get(random.nextInt(awayScorers.size())).getName() : awayTeam);
                    result.addGoal(new GoalEvent(m, homeScores, scorer));
                }
            }
        }

        boolean tiedAt120 = result.getFinalHomeGoals() == result.getFinalAwayGoals();
        if (tiedAt120) {
            boolean homeIsBetter = homeRating >= awayRating;
            double homeAccuracy = homeIsBetter ? MatchSimulator.BEST_TEAM_PENALTY_ACCURACY : MatchSimulator.WORST_TEAM_PENALTY_ACCURACY;
            double awayAccuracy = homeIsBetter ? MatchSimulator.WORST_TEAM_PENALTY_ACCURACY : MatchSimulator.BEST_TEAM_PENALTY_ACCURACY;

            List<String> homeKickers = getPenaltyKickers(homeTeam, false);
            List<String> awayKickers = getPenaltyKickers(awayTeam, false);

            int homeScore = 0;
            int awayScore = 0;

            for (int r = 1; r <= 5; r++) {
                boolean hGoal = random.nextDouble() < homeAccuracy;
                if (hGoal) homeScore++;
                String hKicker = homeKickers.get((r - 1) % homeKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(r, true, hKicker, hGoal, homeScore, awayScore));

                int homeRem = 5 - r;
                int awayRem = 5 - (r - 1);
                if (homeScore > awayScore + awayRem || awayScore > homeScore + homeRem) break;

                boolean aGoal = random.nextDouble() < awayAccuracy;
                if (aGoal) awayScore++;
                String aKicker = awayKickers.get((r - 1) % awayKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(r, false, aKicker, aGoal, homeScore, awayScore));

                if (homeScore > awayScore + (5 - r) || awayScore > homeScore + (5 - r)) break;
            }

            int roundNum = 6;
            while (homeScore == awayScore) {
                boolean hGoal = random.nextDouble() < homeAccuracy;
                if (hGoal) homeScore++;
                String hKicker = homeKickers.get((roundNum - 1) % homeKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(roundNum, true, hKicker, hGoal, homeScore, awayScore));

                boolean aGoal = random.nextDouble() < awayAccuracy;
                if (aGoal) awayScore++;
                String aKicker = awayKickers.get((roundNum - 1) % awayKickers.size());
                result.addPenaltyEvent(new PenaltyEvent(roundNum, false, aKicker, aGoal, homeScore, awayScore));
                roundNum++;
            }

            result.setPenaltyResult(homeScore, awayScore);
            result.setHomeWon(homeScore > awayScore);
        } else {
            result.setHomeWon(result.getFinalHomeGoals() > result.getFinalAwayGoals());
        }

        return result;
    }

    public List<LeagueTeamStanding> getSortedStandingsA() {
        List<LeagueTeamStanding> list = new ArrayList<>(standingsA.values());
        Collections.sort(list);
        return list;
    }

    public List<LeagueTeamStanding> getSortedStandingsB() {
        List<LeagueTeamStanding> list = new ArrayList<>(standingsB.values());
        Collections.sort(list);
        return list;
    }

    public int getCurrentMatchdayIndex() {
        return currentMatchdayIndex;
    }

    public int getCurrentMatchdayNumber() {
        return Math.min(currentMatchdayIndex + 1, 15);
    }

    public boolean isRegularSeasonFinished() {
        return regularSeasonFinished;
    }

    public boolean isPlayoffPhase() {
        return playoffPhase;
    }

    public LeaguePlayoffRound getCurrentPlayoffRound() {
        return currentPlayoffRound;
    }

    public List<LeaguePlayoffMatch> getCurrentPlayoffMatches() {
        return Collections.unmodifiableList(currentPlayoffMatches);
    }

    public List<LeaguePlayoffMatch> getLastPlayedPlayoffMatches() {
        return Collections.unmodifiableList(lastPlayedPlayoffMatches);
    }

    public List<List<LeaguePlayoffMatch>> getAllPlayoffRoundsHistory() {
        return Collections.unmodifiableList(allPlayoffRoundsHistory);
    }

    public boolean isUserQualifiedForPlayoffs() {
        return userQualifiedForPlayoffs;
    }

    public boolean isUserEliminated() {
        return userEliminated;
    }

    public boolean isUserWonLeague() {
        return userWonLeague;
    }

    public List<List<LeagueMatch>> getFixture() {
        return Collections.unmodifiableList(fixture);
    }

    public LeagueTeamStanding getUserStanding() {
        LeagueTeamStanding std = standingsA.get(userTeamName);
        if (std == null) {
            std = standingsA.get("Tu Equipo");
        }
        if (std == null) {
            for (LeagueTeamStanding s : standingsA.values()) {
                if (s.isUserTeam()) return s;
            }
        }
        return std;
    }

    
    public List<LeaguePlayoffMatch> getUserPlayoffMatches() {
        List<LeaguePlayoffMatch> list = new ArrayList<>();
        for (List<LeaguePlayoffMatch> round : allPlayoffRoundsHistory) {
            for (LeaguePlayoffMatch m : round) {
                if (m.isUserMatch()) {
                    list.add(m);
                }
            }
        }
        return list;
    }

    
    public String getPlayoffStageSummary() {
        if (userWonLeague) {
            return "¡CAMPEÓN DE LA CHIQUILEAGUE! 🏆 Conquistó el título ganando Octavos, Cuartos, Semifinal y la Gran Final.";
        }
        if (!userQualifiedForPlayoffs && regularSeasonFinished) {
            LeagueTeamStanding std = getUserStanding();
            int pos = getSortedStandingsA().indexOf(std) + 1;
            return "No clasificó a los Playoffs (finalizó #" + pos + " en la Zona A).";
        }
        if (userEliminated) {
            List<LeaguePlayoffMatch> pMatches = getUserPlayoffMatches();
            if (!pMatches.isEmpty()) {
                LeaguePlayoffMatch lastMatch = pMatches.get(pMatches.size() - 1);
                String rival = isUser(lastMatch.getHomeTeam()) ? lastMatch.getAwayTeam() : lastMatch.getHomeTeam();
                String details = "";
                if (lastMatch.getMatchResult() != null) {
                    MatchResult mr = lastMatch.getMatchResult();
                    if (mr.wentToPenalties()) {
                        details = String.format(" (%d-%d, penales %d-%d)", mr.getFinalHomeGoals(), mr.getFinalAwayGoals(), mr.getHomePenalties(), mr.getAwayPenalties());
                    } else if (mr.wentToExtraTime()) {
                        details = String.format(" (%d-%d en alargue)", mr.getFinalHomeGoals(), mr.getFinalAwayGoals());
                    } else {
                        details = String.format(" (%d-%d)", mr.getFinalHomeGoals(), mr.getFinalAwayGoals());
                    }
                }
                if (lastMatch.getRound() == LeaguePlayoffRound.FINAL) {
                    return "Subcampeón de la ChiquiLeague (cayó en la Gran Final vs " + rival + details + ").";
                } else if (lastMatch.getRound() == LeaguePlayoffRound.SEMIFINAL) {
                    return "Semifinalista (eliminado en Semifinales vs " + rival + details + ").";
                } else if (lastMatch.getRound() == LeaguePlayoffRound.CUARTOS) {
                    return "Cuartofinalista (eliminado en Cuartos de Final vs " + rival + details + ").";
                } else {
                    return "Octavofinalista (eliminado en Octavos de Final vs " + rival + details + ").";
                }
            }
            return "Eliminado en Playoffs.";
        }
        if (playoffPhase) {
            return "En carrera en Playoffs (" + (currentPlayoffRound != null ? currentPlayoffRound.getDisplayName() : "Fase Final") + ").";
        }
        return "Fase Regular en disputa.";
    }
}
