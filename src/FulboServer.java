import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;


public class FulboServer {

    private final int port;
    private final File webDir;
    private HttpServer server;

    
    private final Random random = new Random();
    private LeagueEngine leagueEngine;
    private Team userTeam;
    private DraftEngine draftEngine;
    private List<Player> currentChoices = new ArrayList<>();
    private int currentDraftRound = 1; 
    private boolean draftFinished = false;
    private int rerollsRemaining = 3; 

    private List<Club> clubPool;
    private List<Player> allPlayersMasterList = new ArrayList<>();
    private List<Club> facedClubs = new ArrayList<>();
    private int currentCupRoundIndex = 0; 
    private boolean cupFinished = false;
    private boolean userWonCup = false;

    public FulboServer(int port, File webDir) {
        this.port = port;
        this.webDir = webDir;
        resetGame();
        leagueEngine = new LeagueEngine(random);
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);

        
        server.createContext("/api/game/new", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod()) || "GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String teamName = parseTeamName(exchange);
                resetGame(teamName);
                leagueEngine = new LeagueEngine(random);
                sendJsonResponse(exchange, 200, buildGameStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/draft/choose", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                int choiceIndex = parseChoiceIndex(body);
                if (choiceIndex < 0 || choiceIndex >= currentChoices.size() || draftFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"Elección inválida o draft finalizado\"}");
                    return;
                }

                Player chosen = currentChoices.get(choiceIndex);
                userTeam.assignPlayer(chosen);
                draftEngine.removeFromPool(chosen);

                if (currentDraftRound < 11) {
                    currentDraftRound++;
                    currentChoices = draftEngine.nextFieldPlayerChoices(userTeam);
                } else {
                    draftFinished = true;
                    currentChoices.clear();
                }

                sendJsonResponse(exchange, 200, buildGameStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/draft/reroll", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                if (draftFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"El draft ya ha finalizado\"}");
                    return;
                }
                if (rerollsRemaining <= 0) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"No quedan más re-sorteos disponibles\"}");
                    return;
                }

                rerollsRemaining--;
                if (currentDraftRound == 1) {
                    currentChoices = draftEngine.nextGoalkeeperChoices();
                } else {
                    currentChoices = draftEngine.nextFieldPlayerChoices(userTeam);
                }

                sendJsonResponse(exchange, 200, buildGameStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        
        server.createContext("/api/league/new", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod()) || "GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String teamName = parseTeamName(exchange);
                resetLeague(teamName);
                sendJsonResponse(exchange, 200, buildLeagueStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/league/choose", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                int choiceIndex = parseChoiceIndex(body);
                if (choiceIndex < 0 || choiceIndex >= currentChoices.size() || draftFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"Elección inválida o draft finalizado\"}");
                    return;
                }

                Player chosen = currentChoices.get(choiceIndex);
                userTeam.assignPlayer(chosen);
                draftEngine.removeFromPool(chosen);

                if (currentDraftRound < 11) {
                    currentDraftRound++;
                    currentChoices = draftEngine.nextFieldPlayerChoices(userTeam);
                } else {
                    draftFinished = true;
                    currentChoices.clear();
                    leagueEngine.initLeague(userTeam, allPlayersMasterList, clubPool);
                }

                sendJsonResponse(exchange, 200, buildLeagueStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/league/reroll", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                if (draftFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"El draft ya ha finalizado\"}");
                    return;
                }
                if (rerollsRemaining <= 0) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"No quedan más re-sorteos disponibles\"}");
                    return;
                }

                rerollsRemaining--;
                if (currentDraftRound == 1) {
                    currentChoices = draftEngine.nextGoalkeeperChoices();
                } else {
                    currentChoices = draftEngine.nextFieldPlayerChoices(userTeam);
                }

                sendJsonResponse(exchange, 200, buildLeagueStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/league/state", exchange -> {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 200, buildLeagueStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/league/play-matchday", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                if (!draftFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"Primero debes completar el draft de tu equipo\"}");
                    return;
                }
                if (leagueEngine.isRegularSeasonFinished()) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"La fase regular de 15 fechas ya ha finalizado\"}");
                    return;
                }

                leagueEngine.playCurrentMatchday();
                sendJsonResponse(exchange, 200, buildLeagueStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/league/play-playoff", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                if (!draftFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"Primero debes completar el draft de tu equipo\"}");
                    return;
                }
                if (!leagueEngine.isPlayoffPhase()) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"La fase de playoffs aún no ha comenzado\"}");
                    return;
                }
                if (leagueEngine.getCurrentPlayoffRound() == null) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"Los playoffs ya han finalizado\"}");
                    return;
                }

                leagueEngine.playCurrentPlayoffRound();
                sendJsonResponse(exchange, 200, buildLeagueStateJson());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        server.createContext("/api/cup/next-match", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                if (!draftFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"Primero debes completar el draft\"}");
                    return;
                }
                if (cupFinished) {
                    sendJsonResponse(exchange, 400, "{\"error\":\"La copa ya ha finalizado\"}");
                    return;
                }

                CupRound round = CupRound.values()[currentCupRoundIndex];
                Club opponent = drawOpponent(round, facedClubs);
                facedClubs.add(opponent);

                double userRating = userTeam.getEffectiveRating();
                
                double opponentEffectiveRating = opponent.getBaseMedia() + round.getCumulativeHiddenBoost();

                
                MatchResult matchResult = simulateMatchWithRealPlayers(userRating, opponentEffectiveRating, opponent);

                boolean userWon = matchResult.isHomeWon();
                boolean isFinalRound = (currentCupRoundIndex == CupRound.values().length - 1);

                if (userWon) {
                    if (isFinalRound) {
                        cupFinished = true;
                        userWonCup = true;
                    } else {
                        currentCupRoundIndex++;
                    }
                } else {
                    cupFinished = true;
                    userWonCup = false;
                }

                String json = buildMatchResultJson(round, opponent, matchResult, userWon, isFinalRound);
                sendJsonResponse(exchange, 200, json);
            } else {
                sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            }
        });

        
        server.createContext("/", new StaticFileHandler(webDir));

        server.setExecutor(null);
        server.start();
        System.out.println("==================================================================");
        System.out.println("⚽ Fulbo Server corriendo con éxito en: http://localhost:" + port);
        System.out.println("==================================================================");
    }

    private synchronized void resetLeague() {
        resetLeague("ChiquiTeam");
    }

    private synchronized void resetLeague(String teamName) {
        String name = (teamName != null && !teamName.trim().isEmpty()) ? teamName.trim() : "ChiquiTeam";
        userTeam = new Team(name);
        List<Player> allGks = DataLoader.createGoalkeeperPool();
        List<Player> allFps = DataLoader.createFieldPlayerPool();

        
        List<Player> gks = new ArrayList<>();
        for (Player p : allGks) {
            if (!isExcludedLeagueClub(p.getClub())) {
                gks.add(p);
            }
        }
        List<Player> fps = new ArrayList<>();
        for (Player p : allFps) {
            if (!isExcludedLeagueClub(p.getClub())) {
                fps.add(p);
            }
        }

        allPlayersMasterList = new ArrayList<>(gks);
        allPlayersMasterList.addAll(fps);

        draftEngine = new DraftEngine(gks, fps, random);
        clubPool = DataLoader.createClubPool();
        facedClubs.clear();
        currentDraftRound = 1;
        draftFinished = false;
        rerollsRemaining = 3;
        currentChoices = draftEngine.nextGoalkeeperChoices();

        leagueEngine.initLeague(userTeam, allPlayersMasterList, clubPool);
    }

    private static boolean isExcludedLeagueClub(String club) {
        return "Ferro Carril Oeste".equalsIgnoreCase(club) ||
                "Colón de Santa Fe".equalsIgnoreCase(club) ||
                "Aldosivi".equalsIgnoreCase(club);
    }

    
    private String buildLeagueStateJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"mode\":\"LEAGUE\",");
        sb.append("\"userTeamName\":").append(escapeJson(userTeam != null ? userTeam.getName() : "ChiquiTeam")).append(",");
        sb.append("\"currentDraftRound\":").append(currentDraftRound).append(",");
        sb.append("\"draftFinished\":").append(draftFinished).append(",");
        sb.append("\"rerollsRemaining\":").append(rerollsRemaining).append(",");
        sb.append("\"effectiveTeamRating\":").append((int) Math.round(userTeam.getEffectiveRating())).append(",");

        
        sb.append("\"choices\":[");
        for (int i = 0; i < currentChoices.size(); i++) {
            Player p = currentChoices.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"index\":").append(i).append(",");
            sb.append("\"name\":").append(escapeJson(p.getName())).append(",");
            sb.append("\"club\":").append(escapeJson(p.getClub())).append(",");
            sb.append("\"position\":\"").append(p.getNativePosition().name()).append("\",");
            sb.append("\"category\":\"").append(p.getNativePosition().getCategory().name()).append("\",");
            sb.append("\"baseMedia\":").append((int) Math.round(p.getBaseMedia())).append(",");
            sb.append("\"effectiveBaseMedia\":").append((int) Math.round(p.getEffectiveBaseMedia())).append(",");
            sb.append("\"bonusMedia\":").append((int) Math.round(p.getBonusMedia())).append(",");
            sb.append("\"rarity\":\"").append(p.getRarity().getCode()).append("\",");
            sb.append("\"projectedFit\":\"").append(calculateProjectedFit(p)).append("\"");
            sb.append("}");
        }
        sb.append("],");

        
        sb.append("\"slots\":[");
        List<TeamSlot> slots = userTeam.getSlots();
        for (int i = 0; i < slots.size(); i++) {
            TeamSlot slot = slots.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"slotIndex\":").append(i).append(",");
            sb.append("\"requiredPosition\":\"").append(slot.getRequiredPosition().name()).append("\",");
            sb.append("\"requiredCategory\":\"").append(slot.getRequiredPosition().getCategory().name()).append("\",");
            sb.append("\"isEmpty\":").append(slot.isEmpty());
            if (!slot.isEmpty()) {
                Player p = slot.getPlayer();
                sb.append(",");
                sb.append("\"player\":{");
                sb.append("\"name\":").append(escapeJson(p.getName())).append(",");
                sb.append("\"club\":").append(escapeJson(p.getClub())).append(",");
                sb.append("\"nativePosition\":\"").append(p.getNativePosition().name()).append("\",");
                sb.append("\"baseMedia\":").append((int) Math.round(p.getBaseMedia())).append(",");
                sb.append("\"effectiveBaseMedia\":").append((int) Math.round(p.getEffectiveBaseMedia())).append(",");
                sb.append("\"bonusMedia\":").append((int) Math.round(p.getBonusMedia())).append(",");
                sb.append("\"rarity\":\"").append(p.getRarity().getCode()).append("\"");
                sb.append("},");
                sb.append("\"effectiveMedia\":").append((int) Math.round(slot.getEffectiveMedia())).append(",");
                double penalty = p.getEffectiveBaseMedia() - slot.getEffectiveMedia();
                sb.append("\"penalty\":").append((int) Math.round(penalty));
            }
            sb.append("}");
        }
        sb.append("],");

        
        sb.append("\"league\":{");
        sb.append("\"currentMatchdayIndex\":").append(leagueEngine.getCurrentMatchdayIndex()).append(",");
        sb.append("\"currentMatchdayNumber\":").append(leagueEngine.getCurrentMatchdayNumber()).append(",");
        sb.append("\"regularSeasonFinished\":").append(leagueEngine.isRegularSeasonFinished()).append(",");
        sb.append("\"playoffPhase\":").append(leagueEngine.isPlayoffPhase()).append(",");
        sb.append("\"userQualifiedForPlayoffs\":").append(leagueEngine.isUserQualifiedForPlayoffs()).append(",");
        sb.append("\"userEliminated\":").append(leagueEngine.isUserEliminated()).append(",");
        sb.append("\"userWonLeague\":").append(leagueEngine.isUserWonLeague()).append(",");
        sb.append("\"currentPlayoffRoundName\":").append(leagueEngine.getCurrentPlayoffRound() != null ? "\"" + leagueEngine.getCurrentPlayoffRound().getDisplayName() + "\"" : "null").append(",");
        sb.append("\"currentPlayoffRoundBoost\":").append(leagueEngine.getCurrentPlayoffRound() != null ? (int) leagueEngine.getCurrentPlayoffRound().getRivalHiddenBoost() : 0).append(",");

        
        LeagueMatch userMatch = leagueEngine.getCurrentUserMatch();
        if (userMatch != null) {
            sb.append("\"currentUserMatch\":{");
            sb.append("\"matchday\":").append(userMatch.getMatchday()).append(",");
            sb.append("\"homeTeam\":").append(escapeJson(userMatch.getHomeTeam())).append(",");
            sb.append("\"awayTeam\":").append(escapeJson(userMatch.getAwayTeam())).append(",");
            sb.append("\"isInterzonal\":").append(userMatch.isInterzonal()).append(",");
            sb.append("\"played\":").append(userMatch.isPlayed());
            sb.append("},");
        } else {
            sb.append("\"currentUserMatch\":null,");
        }

        
        sb.append("\"standingsA\":[");
        List<LeagueTeamStanding> stdA = leagueEngine.getSortedStandingsA();
        for (int i = 0; i < stdA.size(); i++) {
            LeagueTeamStanding s = stdA.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"pos\":").append(i + 1).append(",");
            sb.append("\"teamName\":").append(escapeJson(s.getTeamName())).append(",");
            sb.append("\"baseMedia\":").append((int) Math.round(s.getBaseMedia())).append(",");
            sb.append("\"isUserTeam\":").append(s.isUserTeam()).append(",");
            sb.append("\"points\":").append(s.getPoints()).append(",");
            sb.append("\"played\":").append(s.getPlayed()).append(",");
            sb.append("\"won\":").append(s.getWon()).append(",");
            sb.append("\"drawn\":").append(s.getDrawn()).append(",");
            sb.append("\"lost\":").append(s.getLost()).append(",");
            sb.append("\"goalsFor\":").append(s.getGoalsFor()).append(",");
            sb.append("\"goalsAgainst\":").append(s.getGoalsAgainst()).append(",");
            sb.append("\"goalDifference\":").append(s.getGoalDifference());
            sb.append("}");
        }
        sb.append("],");

        
        sb.append("\"standingsB\":[");
        List<LeagueTeamStanding> stdB = leagueEngine.getSortedStandingsB();
        for (int i = 0; i < stdB.size(); i++) {
            LeagueTeamStanding s = stdB.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"pos\":").append(i + 1).append(",");
            sb.append("\"teamName\":").append(escapeJson(s.getTeamName())).append(",");
            sb.append("\"baseMedia\":").append((int) Math.round(s.getBaseMedia())).append(",");
            sb.append("\"isUserTeam\":").append(s.isUserTeam()).append(",");
            sb.append("\"points\":").append(s.getPoints()).append(",");
            sb.append("\"played\":").append(s.getPlayed()).append(",");
            sb.append("\"won\":").append(s.getWon()).append(",");
            sb.append("\"drawn\":").append(s.getDrawn()).append(",");
            sb.append("\"lost\":").append(s.getLost()).append(",");
            sb.append("\"goalsFor\":").append(s.getGoalsFor()).append(",");
            sb.append("\"goalsAgainst\":").append(s.getGoalsAgainst()).append(",");
            sb.append("\"goalDifference\":").append(s.getGoalDifference());
            sb.append("}");
        }
        sb.append("],");

        
        sb.append("\"lastPlayedMatches\":[");
        int lastIdx = Math.max(0, leagueEngine.getCurrentMatchdayIndex() - 1);
        if (lastIdx < leagueEngine.getFixture().size()) {
            List<LeagueMatch> lastMatches = leagueEngine.getFixture().get(lastIdx);
            for (int i = 0; i < lastMatches.size(); i++) {
                LeagueMatch m = lastMatches.get(i);
                if (i > 0) sb.append(",");
                sb.append("{");
                sb.append("\"matchday\":").append(m.getMatchday()).append(",");
                sb.append("\"homeTeam\":").append(escapeJson(m.getHomeTeam())).append(",");
                sb.append("\"awayTeam\":").append(escapeJson(m.getAwayTeam())).append(",");
                sb.append("\"isInterzonal\":").append(m.isInterzonal()).append(",");
                sb.append("\"isUserMatch\":").append(m.isUserMatch()).append(",");
                sb.append("\"played\":").append(m.isPlayed()).append(",");
                sb.append("\"homeGoals\":").append(m.getHomeGoals()).append(",");
                sb.append("\"awayGoals\":").append(m.getAwayGoals()).append(",");
                sb.append("\"events\":[");
                List<GoalEvent> evts = m.getEvents();
                for (int j = 0; j < evts.size(); j++) {
                    GoalEvent ge = evts.get(j);
                    if (j > 0) sb.append(",");
                    sb.append("{");
                    sb.append("\"minute\":").append(ge.getMinute()).append(",");
                    sb.append("\"homeTeamScored\":").append(ge.isHomeTeamScored()).append(",");
                    sb.append("\"scorer\":").append(escapeJson(ge.getScorer()));
                    sb.append("}");
                }
                sb.append("]");
                sb.append("}");
            }
        }
        sb.append("],");

        
        sb.append("\"lastPlayedPlayoffMatches\":[");
        List<LeaguePlayoffMatch> lastPMatches = leagueEngine.getLastPlayedPlayoffMatches();
        for (int i = 0; i < lastPMatches.size(); i++) {
            if (i > 0) sb.append(",");
            serializePlayoffMatch(sb, lastPMatches.get(i));
        }
        sb.append("],");

        
        sb.append("\"allPlayoffHistory\":[");
        List<List<LeaguePlayoffMatch>> allHistory = leagueEngine.getAllPlayoffRoundsHistory();
        for (int h = 0; h < allHistory.size(); h++) {
            if (h > 0) sb.append(",");
            sb.append("[");
            List<LeaguePlayoffMatch> rMatches = allHistory.get(h);
            for (int i = 0; i < rMatches.size(); i++) {
                if (i > 0) sb.append(",");
                serializePlayoffMatch(sb, rMatches.get(i));
            }
            sb.append("]");
        }
        sb.append("],");

        
        sb.append("\"playoffMatches\":[");
        List<LeaguePlayoffMatch> pMatches = leagueEngine.getCurrentPlayoffMatches();
        for (int i = 0; i < pMatches.size(); i++) {
            if (i > 0) sb.append(",");
            serializePlayoffMatch(sb, pMatches.get(i));
        }
        sb.append("],");

        
        sb.append("\"tournamentSummary\":{");
        LeagueTeamStanding userStd = leagueEngine.getUserStanding();
        if (userStd != null) {
            sb.append("\"points\":").append(userStd.getPoints()).append(",");
            sb.append("\"won\":").append(userStd.getWon()).append(",");
            sb.append("\"drawn\":").append(userStd.getDrawn()).append(",");
            sb.append("\"lost\":").append(userStd.getLost()).append(",");
            sb.append("\"played\":").append(userStd.getPlayed()).append(",");
            sb.append("\"goalsFor\":").append(userStd.getGoalsFor()).append(",");
            sb.append("\"goalsAgainst\":").append(userStd.getGoalsAgainst()).append(",");
            sb.append("\"goalDifference\":").append(userStd.getGoalDifference()).append(",");
        } else {
            sb.append("\"points\":0,\"won\":0,\"drawn\":0,\"lost\":0,\"played\":0,\"goalsFor\":0,\"goalsAgainst\":0,\"goalDifference\":0,");
        }
        sb.append("\"playoffSummary\":").append(escapeJson(leagueEngine.getPlayoffStageSummary())).append(",");

        
        sb.append("\"userPlayoffMatches\":[");
        List<LeaguePlayoffMatch> userPList = leagueEngine.getUserPlayoffMatches();
        for (int i = 0; i < userPList.size(); i++) {
            if (i > 0) sb.append(",");
            serializePlayoffMatch(sb, userPList.get(i));
        }
        sb.append("]");
        sb.append("}");

        sb.append("}"); 
        sb.append("}");
        return sb.toString();
    }

    private void serializePlayoffMatch(StringBuilder sb, LeaguePlayoffMatch pm) {
        sb.append("{");
        sb.append("\"roundName\":\"").append(pm.getRound().getDisplayName()).append("\",");
        sb.append("\"homeTeam\":").append(escapeJson(pm.getHomeTeam())).append(",");
        sb.append("\"awayTeam\":").append(escapeJson(pm.getAwayTeam())).append(",");
        sb.append("\"isUserMatch\":").append(pm.isUserMatch()).append(",");
        sb.append("\"played\":").append(pm.isPlayed()).append(",");
        sb.append("\"winner\":").append(escapeJson(pm.getWinner() != null ? pm.getWinner() : "")).append(",");
        if (pm.isPlayed() && pm.getMatchResult() != null) {
            MatchResult mr = pm.getMatchResult();
            sb.append("\"homeGoals\":").append(mr.getFinalHomeGoals()).append(",");
            sb.append("\"awayGoals\":").append(mr.getFinalAwayGoals()).append(",");
            sb.append("\"homeGoalsAt90\":").append(mr.getHomeGoalsAt(90)).append(",");
            sb.append("\"awayGoalsAt90\":").append(mr.getAwayGoalsAt(90)).append(",");
            sb.append("\"wentToExtraTime\":").append(mr.wentToExtraTime()).append(",");
            sb.append("\"wentToPenalties\":").append(mr.wentToPenalties()).append(",");
            sb.append("\"homePenalties\":").append(mr.getHomePenalties() != null ? mr.getHomePenalties() : 0).append(",");
            sb.append("\"awayPenalties\":").append(mr.getAwayPenalties() != null ? mr.getAwayPenalties() : 0).append(",");

            sb.append("\"events\":[");
            List<GoalEvent> gevts = mr.getEvents();
            for (int j = 0; j < gevts.size(); j++) {
                GoalEvent ge = gevts.get(j);
                if (j > 0) sb.append(",");
                sb.append("{");
                sb.append("\"minute\":").append(ge.getMinute()).append(",");
                sb.append("\"homeTeamScored\":").append(ge.isHomeTeamScored()).append(",");
                sb.append("\"scorer\":").append(escapeJson(ge.getScorer()));
                sb.append("}");
            }
            sb.append("],");

            sb.append("\"penaltyEvents\":[");
            List<PenaltyEvent> peList = mr.getPenaltyEvents();
            for (int k = 0; k < peList.size(); k++) {
                PenaltyEvent pe = peList.get(k);
                if (k > 0) sb.append(",");
                sb.append("{");
                sb.append("\"round\":").append(pe.getRoundNumber()).append(",");
                sb.append("\"isHome\":").append(pe.isHomeTeam()).append(",");
                sb.append("\"kicker\":").append(escapeJson(pe.getKickerName())).append(",");
                sb.append("\"scored\":").append(pe.isScored()).append(",");
                sb.append("\"homeScore\":").append(pe.getHomeScoreAfter()).append(",");
                sb.append("\"awayScore\":").append(pe.getAwayScoreAfter());
                sb.append("}");
            }
            sb.append("]");
        } else {
            sb.append("\"homeGoals\":0,\"awayGoals\":0,\"homeGoalsAt90\":0,\"awayGoalsAt90\":0,\"wentToExtraTime\":false,\"wentToPenalties\":false,\"homePenalties\":0,\"awayPenalties\":0,\"events\":[],\"penaltyEvents\":[]");
        }
        sb.append("}");
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    private synchronized void resetGame() {
        resetGame("ChiquiTeam");
    }

    private synchronized void resetGame(String teamName) {
        String name = (teamName != null && !teamName.trim().isEmpty()) ? teamName.trim() : "ChiquiTeam";
        userTeam = new Team(name);
        List<Player> gks = DataLoader.createGoalkeeperPool();
        List<Player> fps = DataLoader.createFieldPlayerPool();

        allPlayersMasterList = new ArrayList<>(gks);
        allPlayersMasterList.addAll(fps);

        draftEngine = new DraftEngine(gks, fps, random);
        clubPool = DataLoader.createClubPool();
        facedClubs.clear();
        currentDraftRound = 1;
        draftFinished = false;
        rerollsRemaining = 3;
        currentCupRoundIndex = 0;
        cupFinished = false;
        userWonCup = false;

        
        currentChoices = draftEngine.nextGoalkeeperChoices();
    }

    
    private MatchResult simulateMatchWithRealPlayers(double homeRating, double awayRating, Club rivalClub) {
        MatchResult result = new MatchResult();
        List<Player> rivalPlayers = getPlayersForClub(rivalClub.getName());
        List<Player> userAttackers = getUserOffensivePlayers();

        
        simulateMinutesWithPlayers(result, 1, MatchSimulator.REGULATION_MINUTES, homeRating, awayRating, userAttackers, rivalPlayers, rivalClub.getName());

        boolean tiedAt90 = result.getHomeGoalsAt(MatchSimulator.REGULATION_MINUTES) == result.getAwayGoalsAt(MatchSimulator.REGULATION_MINUTES);
        if (tiedAt90) {
            result.markExtraTime();
            
            simulateMinutesWithPlayers(result, MatchSimulator.REGULATION_MINUTES + 1, MatchSimulator.EXTRA_TIME_MINUTES, homeRating, awayRating, userAttackers, rivalPlayers, rivalClub.getName());
        }

        boolean tiedAt120 = result.getFinalHomeGoals() == result.getFinalAwayGoals();
        if (tiedAt120) {
            boolean homeIsBetter = homeRating >= awayRating;
            boolean homeWon = simulatePenaltiesInternal(result, homeIsBetter, rivalClub);
            result.setHomeWon(homeWon);
        } else {
            result.setHomeWon(result.getFinalHomeGoals() > result.getFinalAwayGoals());
        }

        return result;
    }

    private void simulateMinutesWithPlayers(MatchResult result, int fromMinute, int toMinute, double homeRating, double awayRating,
                                            List<Player> userAttackers, List<Player> rivalPlayers, String rivalClubName) {
        double pHomeGivenGoal = MatchSimulator.calculateGoalProbability(homeRating, awayRating);

        for (int m = fromMinute; m <= toMinute; m++) {
            if (random.nextDouble() < MatchSimulator.GOAL_PROBABILITY_PER_MINUTE) {
                boolean homeScores = random.nextDouble() < pHomeGivenGoal;
                String scorer;
                if (homeScores) {
                    scorer = !userAttackers.isEmpty() ? userAttackers.get(random.nextInt(userAttackers.size())).getName() : "Tu Equipo";
                } else {
                    scorer = !rivalPlayers.isEmpty() ? rivalPlayers.get(random.nextInt(rivalPlayers.size())).getName() : rivalClubName;
                }
                result.addGoal(new GoalEvent(m, homeScores, scorer));
            }
        }
    }

    private boolean simulatePenaltiesInternal(MatchResult result, boolean homeIsBetterTeam, Club rivalClub) {
        double homeAccuracy = homeIsBetterTeam ? MatchSimulator.BEST_TEAM_PENALTY_ACCURACY : MatchSimulator.WORST_TEAM_PENALTY_ACCURACY;
        double awayAccuracy = homeIsBetterTeam ? MatchSimulator.WORST_TEAM_PENALTY_ACCURACY : MatchSimulator.BEST_TEAM_PENALTY_ACCURACY;

        List<Player> homePlayers = new ArrayList<>();
        for (TeamSlot s : userTeam.getSlots()) {
            if (!s.isEmpty()) {
                homePlayers.add(s.getPlayer());
            }
        }
        List<String> homeKickers = getSortedPenaltyKickers(homePlayers);
        if (homeKickers.isEmpty()) homeKickers.add("Tu Equipo");

        List<Player> awayPlayers = getAllPlayersForClub(rivalClub.getName());
        List<String> awayKickers = getSortedPenaltyKickers(awayPlayers);
        if (awayKickers.isEmpty()) awayKickers.add(rivalClub.getName());

        int homeScored = 0;
        int awayScored = 0;

        for (int r = 1; r <= 5; r++) {
            String hName = homeKickers.get((r - 1) % homeKickers.size());
            boolean hGoal = random.nextDouble() < homeAccuracy;
            if (hGoal) homeScored++;
            result.addPenaltyEvent(new PenaltyEvent(r, true, hName, hGoal, homeScored, awayScored));

            int homeRemaining = 5 - r;
            int awayRemaining = 5 - (r - 1);
            if (homeScored > awayScored + awayRemaining || awayScored > homeScored + homeRemaining) {
                break;
            }

            String aName = awayKickers.get((r - 1) % awayKickers.size());
            boolean aGoal = random.nextDouble() < awayAccuracy;
            if (aGoal) awayScored++;
            result.addPenaltyEvent(new PenaltyEvent(r, false, aName, aGoal, homeScored, awayScored));

            awayRemaining = 5 - r;
            if (homeScored > awayScored + awayRemaining || awayScored > homeScored + homeRemaining) {
                break;
            }
        }

        int round = 6;
        while (homeScored == awayScored) {
            String hName = homeKickers.get((round - 1) % homeKickers.size());
            boolean hGoal = random.nextDouble() < homeAccuracy;
            if (hGoal) homeScored++;
            result.addPenaltyEvent(new PenaltyEvent(round, true, hName, hGoal, homeScored, awayScored));

            String aName = awayKickers.get((round - 1) % awayKickers.size());
            boolean aGoal = random.nextDouble() < awayAccuracy;
            if (aGoal) awayScored++;
            result.addPenaltyEvent(new PenaltyEvent(round, false, aName, aGoal, homeScored, awayScored));

            round++;
        }

        result.setPenaltyResult(homeScored, awayScored);
        return homeScored > awayScored;
    }

    private int getPenaltyKickerPriority(Player p) {
        if (p == null) return 100;
        Position pos = p.getNativePosition();
        PositionCategory cat = pos.getCategory();
        switch (cat) {
            case DELANTERO:
                if (pos == Position.DC) return 1;
                return 2; 
            case MEDIOCAMPO:
                if (pos == Position.MCO) return 3;
                return 4; 
            case DEFENSA:
                if (pos == Position.LI || pos == Position.LD) return 5;
                return 6; 
            case ARQUERO:
                return 10; 
            default:
                return 7;
        }
    }

    private List<String> getSortedPenaltyKickers(List<Player> players) {
        List<Player> sorted = new ArrayList<>(players);
        sorted.sort((p1, p2) -> {
            int pComp = Integer.compare(getPenaltyKickerPriority(p1), getPenaltyKickerPriority(p2));
            if (pComp != 0) return pComp;
            return Double.compare(p2.getBaseMedia(), p1.getBaseMedia());
        });
        List<String> names = new ArrayList<>();
        for (Player p : sorted) {
            names.add(p.getName());
        }
        return names;
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

    private List<Player> getPlayersForClub(String clubName) {
        List<Player> list = new ArrayList<>();
        for (Player p : allPlayersMasterList) {
            if (p.getClub().equalsIgnoreCase(clubName) && p.getNativePosition() != Position.ARQ) {
                list.add(p);
            }
        }
        return list;
    }

    private List<Player> getUserOffensivePlayers() {
        List<Player> list = new ArrayList<>();
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
        return list;
    }

    private String calculateProjectedFit(Player p) {
        if (userTeam == null) return "optima";
        List<TeamSlot> slots = userTeam.getSlots();
        boolean hasExact = slots.stream()
                .anyMatch(s -> s.isEmpty() && TeamSlot.isExactPosition(s.getRequiredPosition(), p.getNativePosition()));
        if (hasExact) return "optima";

        boolean hasSameCat = slots.stream()
                .anyMatch(s -> s.isEmpty() && s.getRequiredPosition().getCategory() == p.getNativePosition().getCategory());
        if (hasSameCat) return "penalidad-cat";

        return "penalidad-diff";
    }

    private Club drawOpponent(CupRound round, List<Club> alreadyFaced) {
        List<Club> available = new ArrayList<>(clubPool);
        available.removeAll(alreadyFaced);

        if (available.isEmpty()) {
            throw new IllegalStateException("No quedan clubes disponibles para sortear en " + round);
        }

        List<Club> availBuenos = new ArrayList<>();
        List<Club> availIntermedios = new ArrayList<>();
        List<Club> availMalos = new ArrayList<>();

        for (Club c : available) {
            if (c.getTier() == ClubTier.BUENO) {
                availBuenos.add(c);
            } else if (c.getTier() == ClubTier.INTERMEDIO) {
                availIntermedios.add(c);
            } else {
                availMalos.add(c);
            }
        }

        double pBuenos = round.getProbBuenos();
        double pInter = round.getProbIntermedios();
        double rollTier = random.nextDouble();

        ClubTier targetTier;
        if (rollTier < pBuenos) {
            targetTier = ClubTier.BUENO;
        } else if (rollTier < pBuenos + pInter) {
            targetTier = ClubTier.INTERMEDIO;
        } else {
            targetTier = ClubTier.MALO;
        }

        List<Club> candidates;
        if (targetTier == ClubTier.BUENO && !availBuenos.isEmpty()) {
            candidates = availBuenos;
        } else if (targetTier == ClubTier.INTERMEDIO && !availIntermedios.isEmpty()) {
            candidates = availIntermedios;
        } else if (targetTier == ClubTier.MALO && !availMalos.isEmpty()) {
            candidates = availMalos;
        } else {
            candidates = available;
        }

        double totalWeight = 0.0;
        for (Club c : candidates) {
            totalWeight += c.getWeight();
        }

        double rollClub = random.nextDouble() * totalWeight;
        double cumulative = 0.0;
        for (Club c : candidates) {
            cumulative += c.getWeight();
            if (rollClub <= cumulative) {
                return c;
            }
        }
        return candidates.get(candidates.size() - 1);
    }

    private int parseChoiceIndex(String body) {
        try {
            String cleaned = body.replaceAll("[^0-9]", "");
            return Integer.parseInt(cleaned);
        } catch (Exception e) {
            return -1;
        }
    }

    private String buildGameStateJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"userTeamName\":").append(escapeJson(userTeam != null ? userTeam.getName() : "ChiquiTeam")).append(",");
        sb.append("\"currentDraftRound\":").append(currentDraftRound).append(",");
        sb.append("\"draftFinished\":").append(draftFinished).append(",");
        sb.append("\"rerollsRemaining\":").append(rerollsRemaining).append(",");
        sb.append("\"effectiveTeamRating\":").append((int) Math.round(userTeam.getEffectiveRating())).append(",");

        
        sb.append("\"choices\":[");
        for (int i = 0; i < currentChoices.size(); i++) {
            Player p = currentChoices.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"index\":").append(i).append(",");
            sb.append("\"name\":").append(escapeJson(p.getName())).append(",");
            sb.append("\"club\":").append(escapeJson(p.getClub())).append(",");
            sb.append("\"position\":\"").append(p.getNativePosition().name()).append("\",");
            sb.append("\"category\":\"").append(p.getNativePosition().getCategory().name()).append("\",");
            sb.append("\"baseMedia\":").append((int) Math.round(p.getBaseMedia())).append(",");
            sb.append("\"effectiveBaseMedia\":").append((int) Math.round(p.getEffectiveBaseMedia())).append(",");
            sb.append("\"bonusMedia\":").append((int) Math.round(p.getBonusMedia())).append(",");
            sb.append("\"rarity\":\"").append(p.getRarity().getCode()).append("\",");
            sb.append("\"projectedFit\":\"").append(calculateProjectedFit(p)).append("\"");
            sb.append("}");
        }
        sb.append("],");

        
        sb.append("\"slots\":[");
        List<TeamSlot> slots = userTeam.getSlots();
        for (int i = 0; i < slots.size(); i++) {
            TeamSlot slot = slots.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"slotIndex\":").append(i).append(",");
            sb.append("\"requiredPosition\":\"").append(slot.getRequiredPosition().name()).append("\",");
            sb.append("\"requiredCategory\":\"").append(slot.getRequiredPosition().getCategory().name()).append("\",");
            sb.append("\"isEmpty\":").append(slot.isEmpty());
            if (!slot.isEmpty()) {
                Player p = slot.getPlayer();
                sb.append(",");
                sb.append("\"player\":{");
                sb.append("\"name\":").append(escapeJson(p.getName())).append(",");
                sb.append("\"club\":").append(escapeJson(p.getClub())).append(",");
                sb.append("\"nativePosition\":\"").append(p.getNativePosition().name()).append("\",");
                sb.append("\"baseMedia\":").append((int) Math.round(p.getBaseMedia())).append(",");
                sb.append("\"effectiveBaseMedia\":").append((int) Math.round(p.getEffectiveBaseMedia())).append(",");
                sb.append("\"bonusMedia\":").append((int) Math.round(p.getBonusMedia())).append(",");
                sb.append("\"rarity\":\"").append(p.getRarity().getCode()).append("\"");
                sb.append("},");
                sb.append("\"effectiveMedia\":").append((int) Math.round(slot.getEffectiveMedia())).append(",");
                double penalty = p.getEffectiveBaseMedia() - slot.getEffectiveMedia();
                sb.append("\"penalty\":").append((int) Math.round(penalty));
            }
            sb.append("}");
        }
        sb.append("],");

        
        sb.append("\"currentCupRoundIndex\":").append(currentCupRoundIndex).append(",");
        sb.append("\"currentCupRoundName\":\"").append(CupRound.values()[currentCupRoundIndex].getDisplayName()).append("\",");
        sb.append("\"cupFinished\":").append(cupFinished).append(",");
        sb.append("\"userWonCup\":").append(userWonCup);
        sb.append("}");
        return sb.toString();
    }

    private String buildMatchResultJson(CupRound round, Club opponent, MatchResult match, boolean userWon, boolean isFinalRound) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"roundName\":\"").append(round.getDisplayName()).append("\",");
        sb.append("\"roundEnum\":\"").append(round.name()).append("\",");
        sb.append("\"opponent\":{");
        sb.append("\"name\":").append(escapeJson(opponent.getName())).append(",");
        sb.append("\"baseMedia\":").append((int) Math.round(opponent.getBaseMedia()));
        sb.append("},");
        sb.append("\"userWon\":").append(userWon).append(",");
        sb.append("\"isFinalRound\":").append(isFinalRound).append(",");
        sb.append("\"homeGoals\":").append(match.getFinalHomeGoals()).append(",");
        sb.append("\"awayGoals\":").append(match.getFinalAwayGoals()).append(",");
        sb.append("\"wentToExtraTime\":").append(match.wentToExtraTime()).append(",");
        sb.append("\"homeGoalsAt90\":").append(match.getHomeGoalsAt(90)).append(",");
        sb.append("\"awayGoalsAt90\":").append(match.getAwayGoalsAt(90)).append(",");
        sb.append("\"wentToPenalties\":").append(match.wentToPenalties()).append(",");
        if (match.wentToPenalties()) {
            sb.append("\"homePenalties\":").append(match.getHomePenalties()).append(",");
            sb.append("\"awayPenalties\":").append(match.getAwayPenalties()).append(",");
            sb.append("\"penaltyKicks\":[");
            List<PenaltyEvent> pList = match.getPenaltyEvents();
            for (int i = 0; i < pList.size(); i++) {
                PenaltyEvent pe = pList.get(i);
                if (i > 0) sb.append(",");
                sb.append("{");
                sb.append("\"round\":").append(pe.getRoundNumber()).append(",");
                sb.append("\"isHome\":").append(pe.isHomeTeam()).append(",");
                sb.append("\"kicker\":").append(escapeJson(pe.getKickerName())).append(",");
                sb.append("\"scored\":").append(pe.isScored()).append(",");
                sb.append("\"homeScore\":").append(pe.getHomeScoreAfter()).append(",");
                sb.append("\"awayScore\":").append(pe.getAwayScoreAfter());
                sb.append("}");
            }
            sb.append("],");
        }
        sb.append("\"events\":[");
        List<GoalEvent> events = match.getEvents();
        for (int i = 0; i < events.size(); i++) {
            GoalEvent e = events.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"minute\":").append(e.getMinute()).append(",");
            sb.append("\"homeTeamScored\":").append(e.isHomeTeamScored()).append(",");
            sb.append("\"scorer\":").append(escapeJson(e.getScorer()));
            sb.append("}");
        }
        sb.append("],");
        sb.append("\"nextCupRoundName\":\"").append(CupRound.values()[currentCupRoundIndex].getDisplayName()).append("\",");
        sb.append("\"nextCupRoundIndex\":").append(currentCupRoundIndex).append(",");
        sb.append("\"cupFinished\":").append(cupFinished).append(",");
        sb.append("\"userWonCup\":").append(userWonCup);
        sb.append("}");
        return sb.toString();
    }

    private static String escapeJson(String s) {
        if (s == null) return "\"\"";
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "") + "\"";
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        sendResponse(exchange, statusCode, json, "application/json; charset=UTF-8");
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String content, String contentType) throws IOException {
        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    
    private String parseTeamName(HttpExchange exchange) {
        try {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.contains("name=")) {
                    for (String param : query.split("&")) {
                        String[] pair = param.split("=");
                        if (pair.length > 1 && "name".equalsIgnoreCase(pair[0])) {
                            String decoded = java.net.URLDecoder.decode(pair[1], StandardCharsets.UTF_8).trim();
                            if (!decoded.isEmpty()) return decoded;
                        }
                    }
                }
            } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                if (body != null && !body.trim().isEmpty()) {
                    if (body.contains("\"name\"")) {
                        int start = body.indexOf("\"name\"");
                        int colon = body.indexOf(":", start);
                        int quote1 = body.indexOf("\"", colon);
                        int quote2 = body.indexOf("\"", quote1 + 1);
                        if (quote1 != -1 && quote2 != -1) {
                            String parsed = body.substring(quote1 + 1, quote2).trim();
                            if (!parsed.isEmpty()) return parsed;
                        }
                    }
                }
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.contains("name=")) {
                    for (String param : query.split("&")) {
                        String[] pair = param.split("=");
                        if (pair.length > 1 && "name".equalsIgnoreCase(pair[0])) {
                            String decoded = java.net.URLDecoder.decode(pair[1], StandardCharsets.UTF_8).trim();
                            if (!decoded.isEmpty()) return decoded;
                        }
                    }
                }
            }
        } catch (Exception ignored) {}
        return "ChiquiTeam";
    }

    private static class StaticFileHandler implements HttpHandler {
        private final File baseDir;

        public StaticFileHandler(File baseDir) {
            this.baseDir = baseDir;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path == null || path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            File target = new File(baseDir, path.substring(1));
            if (!target.getCanonicalPath().startsWith(baseDir.getCanonicalPath()) || !target.exists() || target.isDirectory()) {
                sendResponse(exchange, 404, "404 Not Found", "text/plain");
                return;
            }

            String mime = getMimeType(target.getName());
            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.sendResponseHeaders(200, target.length());
            try (FileInputStream fis = new FileInputStream(target); OutputStream os = exchange.getResponseBody()) {
                fis.transferTo(os);
            }
        }

        private String getMimeType(String filename) {
            if (filename.endsWith(".html")) return "text/html; charset=UTF-8";
            if (filename.endsWith(".css")) return "text/css; charset=UTF-8";
            if (filename.endsWith(".js")) return "application/javascript; charset=UTF-8";
            if (filename.endsWith(".svg")) return "image/svg+xml";
            if (filename.endsWith(".png")) return "image/png";
            if (filename.endsWith(".json")) return "application/json; charset=UTF-8";
            return "text/plain; charset=UTF-8";
        }
    }
}