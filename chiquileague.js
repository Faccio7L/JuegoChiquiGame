

let leagueState = null;
let simulationSpeedMultiplier = 1; 
let isSimulating = false;
let isPicking = false;


document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadLeagueState();
});

function getTeamName() {
    if (leagueState && leagueState.userTeamName) return leagueState.userTeamName;
    const urlParams = new URLSearchParams(window.location.search);
    const p = urlParams.get('name');
    if (p && p.trim()) return p.trim();
    return localStorage.getItem('userTeamName') || 'ChiquiTeam';
}

function isUserTeam(team) {
    if (!team) return false;
    const t = team.trim().toLowerCase();
    const myName = getTeamName().trim().toLowerCase();
    return t === myName || t === 'tu equipo' || t === 'chiquiteam';
}

function setupEventListeners() {
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (confirm('¿Reiniciar la ChiquiLeague?')) {
                startNewLeague();
            }
        });
    }

    const rerollBtn = document.getElementById('btn-reroll-draft');
    if (rerollBtn) {
        rerollBtn.addEventListener('click', rerollDraftChoices);
    }



    const playFechaBtn = document.getElementById('btn-play-fecha');
    if (playFechaBtn) {
        playFechaBtn.addEventListener('click', playNextMatchdayRealTime);
    }

    const playPlayoffBtn = document.getElementById('btn-play-playoff');
    if (playPlayoffBtn) {
        playPlayoffBtn.addEventListener('click', playNextPlayoffRealTime);
    }

    
    const shareBtn = document.getElementById('btn-share-run');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareRunSummary);
    }

    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', startNewLeague);
    }

    
    setupSpeedToggle('btn-speed-toggle');
    setupSpeedToggle('btn-speed-toggle-playoff');
}

function isTournamentOver() {
    if (!leagueState || !leagueState.league) return false;
    const lg = leagueState.league;
    return lg.userWonLeague || lg.userEliminated || (lg.regularSeasonFinished && !lg.userQualifiedForPlayoffs);
}

function setupSpeedToggle(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (isTournamentOver()) return;

        if (simulationSpeedMultiplier === 1) {
            simulationSpeedMultiplier = 2;
            btn.textContent = '2x Rápido';
            btn.classList.add('active');
        } else {
            simulationSpeedMultiplier = 1;
            btn.textContent = '1x Normal';
            btn.classList.remove('active');
        }

        
        const b1 = document.getElementById('btn-speed-toggle');
        const b2 = document.getElementById('btn-speed-toggle-playoff');
        if (b1) {
            b1.textContent = btn.textContent;
            if (simulationSpeedMultiplier === 2) b1.classList.add('active'); else b1.classList.remove('active');
        }
        if (b2) {
            b2.textContent = btn.textContent;
            if (simulationSpeedMultiplier === 2) b2.classList.add('active'); else b2.classList.remove('active');
        }
    });
}

function updateSpeedButtonsVisibility() {
    const isOver = isTournamentOver();
    const c1 = document.getElementById('speed-toggle-league-container');
    const c2 = document.getElementById('speed-toggle-playoff-container');

    if (c1) {
        if (isOver) c1.classList.add('d-none');
        else c1.classList.remove('d-none');
    }
    if (c2) {
        if (isOver) c2.classList.add('d-none');
        else c2.classList.remove('d-none');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadLeagueState() {
    try {
        const teamName = getTeamName();
        localStorage.setItem('userTeamName', teamName);

        const res = await fetch('/api/league/state');
        if (res.ok) {
            leagueState = await res.json();
            
            if (leagueState.userTeamName && leagueState.userTeamName !== teamName) {
                await startNewLeague();
                return;
            }
            renderFullState();
        } else {
            await startNewLeague();
        }
    } catch (err) {
        console.error('Error al cargar estado de la liga:', err);
        await startNewLeague();
    }
}

async function startNewLeague() {
    if (isSimulating) return;
    try {
        const teamName = getTeamName();
        localStorage.setItem('userTeamName', teamName);

        const res = await fetch('/api/league/new?name=' + encodeURIComponent(teamName), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: teamName })
        });
        if (res.ok) {
            leagueState = await res.json();
            isPicking = false;

            const gameOverPanel = document.getElementById('game-over-panel');
            if (gameOverPanel) gameOverPanel.classList.add('d-none');
            const recapContent = document.getElementById('run-recap-content');
            if (recapContent) recapContent.innerHTML = '';
            const toast = document.getElementById('share-toast');
            if (toast) toast.classList.add('d-none');

            const liveBoard = document.getElementById('match-live-board');
            if (liveBoard) liveBoard.classList.add('d-none');
            const playoffLiveBoard = document.getElementById('playoff-live-board');
            if (playoffLiveBoard) playoffLiveBoard.classList.add('d-none');

            const penaltiesDisplay = document.getElementById('playoff-penalties-display');
            if (penaltiesDisplay) penaltiesDisplay.classList.add('d-none');
            const penHomeDots = document.getElementById('playoff-pen-home-dots');
            if (penHomeDots) penHomeDots.innerHTML = '';
            const penAwayDots = document.getElementById('playoff-pen-away-dots');
            if (penAwayDots) penAwayDots.innerHTML = '';
            const penScoreText = document.getElementById('playoff-penalties-score-text');
            if (penScoreText) penScoreText.textContent = '0 - 0';
            const penStatusLine = document.getElementById('playoff-pen-status-line');
            if (penStatusLine) penStatusLine.textContent = 'Preparando la serie...';

            const resultBanner = document.getElementById('match-result-banner');
            if (resultBanner) {
                resultBanner.classList.add('d-none');
                resultBanner.className = 'alert alert-dark border-secondary text-center py-2 mb-0 d-none';
            }
            const resultText = document.getElementById('match-result-text');
            if (resultText) resultText.textContent = '';

            const playoffResultBanner = document.getElementById('playoff-result-banner');
            if (playoffResultBanner) {
                playoffResultBanner.classList.add('d-none');
                playoffResultBanner.className = 'alert alert-dark border-secondary text-center py-2 mb-0 d-none';
            }
            const playoffResultText = document.getElementById('playoff-result-text');
            if (playoffResultText) playoffResultText.textContent = '';

            const userStatusCard = document.getElementById('playoff-user-status-card');
            if (userStatusCard) userStatusCard.classList.add('d-none');

            const eventsLog = document.getElementById('events-log');
            if (eventsLog) eventsLog.innerHTML = '';
            const playoffEventsLog = document.getElementById('playoff-events-log');
            if (playoffEventsLog) playoffEventsLog.innerHTML = '';

            const fechaMatches = document.getElementById('fecha-matches-container');
            if (fechaMatches) fechaMatches.innerHTML = '';
            const bracketContainer = document.getElementById('playoff-bracket-container');
            if (bracketContainer) bracketContainer.innerHTML = '';

            const liveHomeScore = document.getElementById('live-home-score');
            if (liveHomeScore) liveHomeScore.textContent = '0';
            const liveAwayScore = document.getElementById('live-away-score');
            if (liveAwayScore) liveAwayScore.textContent = '0';
            const liveMatchTime = document.getElementById('live-match-time');
            if (liveMatchTime) liveMatchTime.textContent = "0'";

            const playoffHomeScore = document.getElementById('playoff-live-home-score');
            if (playoffHomeScore) playoffHomeScore.textContent = '0';
            const playoffAwayScore = document.getElementById('playoff-live-away-score');
            if (playoffAwayScore) playoffAwayScore.textContent = '0';
            const playoffMatchTime = document.getElementById('playoff-live-match-time');
            if (playoffMatchTime) playoffMatchTime.textContent = "0'";

            const playFechaBtn = document.getElementById('btn-play-fecha');
            if (playFechaBtn) playFechaBtn.disabled = false;
            const playPlayoffBtn = document.getElementById('btn-play-playoff');
            if (playPlayoffBtn) playPlayoffBtn.disabled = false;

            simulationSpeedMultiplier = 1;
            const speedBtn1 = document.getElementById('btn-speed-toggle');
            if (speedBtn1) {
                speedBtn1.textContent = '1x Normal';
                speedBtn1.classList.remove('active');
            }
            const speedBtn2 = document.getElementById('btn-speed-toggle-playoff');
            if (speedBtn2) {
                speedBtn2.textContent = '1x Normal';
                speedBtn2.classList.remove('active');
            }

            const bracketNavBtn = document.getElementById('nav-bracket-btn');
            if (bracketNavBtn) {
                const tab = new bootstrap.Tab(bracketNavBtn);
                tab.show();
            }

            renderFullState();
        }
    } catch (err) {
        console.error('Error al reiniciar la liga:', err);
    }
}

function renderFullState() {
    if (!leagueState) return;

    renderHeader();
    renderPitch(leagueState.slots);

    const draftSection = document.getElementById('draft-section');
    const leagueSection = document.getElementById('league-section');
    const playoffSection = document.getElementById('playoff-section');

    if (!leagueState.draftFinished) {
        if (draftSection) draftSection.classList.remove('d-none');
        if (leagueSection) leagueSection.classList.add('d-none');
        if (playoffSection) playoffSection.classList.add('d-none');
        renderDraft();
    } else if (!leagueState.league.playoffPhase) {
        if (draftSection) draftSection.classList.add('d-none');
        if (leagueSection) leagueSection.classList.remove('d-none');
        if (playoffSection) playoffSection.classList.add('d-none');
        renderLeagueRegular();
    } else {
        if (draftSection) draftSection.classList.add('d-none');
        if (leagueSection) leagueSection.classList.add('d-none');
        if (playoffSection) playoffSection.classList.remove('d-none');
        renderPlayoffs();
    }

    renderStandingsTables();
    renderGameOverRecap();
    updateSpeedButtonsVisibility();
}

function renderHeader() {
    const ratingEl = document.getElementById('header-rating');
    const titleEl = document.getElementById('pitch-team-title');

    if (ratingEl) {
        ratingEl.textContent = `${Math.round(leagueState.effectiveTeamRating)}`;
    }

    if (titleEl) {
        titleEl.textContent = `ONCE TITULAR (${getTeamName()}) - 4-3-3`;
    }
}

function renderPitch(slots) {
    if (!slots) return;

    slots.forEach(slot => {
        const slotEl = document.getElementById(`slot-${slot.slotIndex}`);
        if (!slotEl) return;

        slotEl.className = 'tactical-slot';

        if (slot.isEmpty) {
            slotEl.innerHTML = `
                <span class="pos-tag">${slot.requiredPosition}</span>
                <div class="slot-body empty">Vacío</div>
            `;
        } else {
            const penalty = Number(slot.penalty);
            if (penalty === 0.0) {
                slotEl.classList.add('optima');
            } else if (penalty === 3.0) {
                slotEl.classList.add('penalidad-cat');
            } else if (penalty >= 12.0) {
                slotEl.classList.add('penalidad-diff');
            }

            let rarityPill = '';
            if (slot.player && slot.player.rarity === 'diamante') {
                slotEl.classList.add('slot-diamante');
                rarityPill = '<span class="player-rarity-pill diamante">+5</span>';
            } else if (slot.player && slot.player.rarity === 'oro') {
                slotEl.classList.add('slot-oro');
                rarityPill = '<span class="player-rarity-pill oro">+3</span>';
            } else if (slot.player && slot.player.rarity === 'leyenda') {
                slotEl.classList.add('slot-leyenda');
                rarityPill = '<span class="player-rarity-pill leyenda">👑</span>';
            }

            const clubName = (slot.player && slot.player.club) ? slot.player.club : '';

            slotEl.innerHTML = `
                <span class="pos-tag">${slot.requiredPosition}</span>
                <div class="slot-body">
                    <span class="player-title" title="${slot.player.name}">${slot.player.name}</span>
                    <span class="player-club" title="${clubName}">${clubName}</span>
                    <span class="player-media">${Math.round(slot.effectiveMedia)}${rarityPill}</span>
                </div>
            `;
        }
    });
}

function renderDraft() {
    const roundTitle = document.getElementById('draft-round-title');
    const container = document.getElementById('choices-container');
    if (!container) return;
    container.innerHTML = '';

    if (roundTitle) {
        if (leagueState.currentDraftRound === 1) {
            roundTitle.textContent = 'Ronda 1/11: Arquero';
        } else {
            roundTitle.textContent = `Ronda ${leagueState.currentDraftRound}/11: Jugadores de Campo`;
        }
    }

    const rerollBtn = document.getElementById('btn-reroll-draft');
    const rerollBadge = document.getElementById('reroll-badge');
    const remaining = leagueState.rerollsRemaining !== undefined ? leagueState.rerollsRemaining : 3;

    if (rerollBadge) rerollBadge.textContent = `${remaining}`;
    if (rerollBtn) {
        rerollBtn.disabled = (remaining <= 0);
        rerollBtn.title = remaining > 0 ? `Sortear 4 opciones nuevas (${remaining} restantes)` : 'Sin re-sorteos';
    }



    leagueState.choices.forEach((player, idx) => {
        const fitClass = player.projectedFit || 'optima';
        const card = document.createElement('article');
        card.className = 'choice-card';
        card.style.cursor = 'pointer';

        let rarityCardClass = '';
        let rarityBadgeHtml = '';
        const displayMedia = player.effectiveBaseMedia !== undefined ? player.effectiveBaseMedia : player.baseMedia;

        if (player.rarity === 'diamante') {
            rarityCardClass = 'card-diamante';
            rarityBadgeHtml = '<span class="badge-rarity badge-diamante">💎 +5 DIAMANTE</span>';
        } else if (player.rarity === 'oro') {
            rarityCardClass = 'card-oro';
            rarityBadgeHtml = '<span class="badge-rarity badge-oro">★ +3 ORO</span>';
        } else if (player.rarity === 'leyenda') {
            rarityCardClass = 'card-leyenda';
            rarityBadgeHtml = '<span class="badge-rarity badge-leyenda">👑 ÍDOLO</span>';
        }

        if (rarityCardClass) card.classList.add(rarityCardClass);

        card.innerHTML = `
            <div>
                <div class="choice-top">
                    <div class="choice-media-wrapper">
                        <span class="choice-media">${Math.round(displayMedia)}</span>
                        ${rarityBadgeHtml}
                    </div>
                    <span class="choice-pos ${fitClass}" title="Encaje en tu once">${player.position}</span>
                </div>
                <h3 class="choice-name">${player.name}</h3>
                <span class="choice-club">${player.club}</span>
            </div>
            <button class="btn btn-warning btn-sm font-chakra fw-bold mt-2 w-100 py-1" type="button">
                ELEGIR CARTA
            </button>
        `;

        card.addEventListener('click', () => pickPlayer(idx));
        container.appendChild(card);
    });
}

async function pickPlayer(index) {
    if (isSimulating || isPicking) return;
    isPicking = true;
    try {
        const res = await fetch('/api/league/choose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ choiceIndex: index })
        });
        if (res.ok) {
            leagueState = await res.json();
            renderFullState();
        }
    } catch (err) {
        console.error('Error al elegir jugador:', err);
    } finally {
        isPicking = false;
    }
}


async function rerollDraftChoices() {
    if (isSimulating || isPicking) return;
    try {
        const res = await fetch('/api/league/reroll', { method: 'POST' });
        if (res.ok) {
            leagueState = await res.json();
            renderFullState();
        }
    } catch (err) {
        console.error('Error al resortear:', err);
    }
}

function renderLeagueRegular() {
    const mdTitle = document.getElementById('league-matchday-title');
    const derbyInd = document.getElementById('derby-indicator');
    const homeName = document.getElementById('match-home-name');
    const homeRating = document.getElementById('match-home-rating');
    const awayName = document.getElementById('match-away-name');
    const awayRating = document.getElementById('match-away-rating');

    const nextUserMatch = leagueState.league.currentUserMatch;
    const currentMdNum = leagueState.league.currentMatchdayNumber;
    const previewCard = document.getElementById('user-match-preview-card');
    const playBtn = document.getElementById('btn-play-fecha');

    if (mdTitle) mdTitle.textContent = `FECHA ${Math.min(currentMdNum, 15)} / 15`;

    if (nextUserMatch && !leagueState.league.regularSeasonFinished) {
        if (previewCard) previewCard.classList.remove('d-none');
        const isHomeUser = isUserTeam(nextUserMatch.homeTeam);
        const homeDisplayName = isHomeUser ? getTeamName() : nextUserMatch.homeTeam;
        const awayDisplayName = !isHomeUser ? getTeamName() : nextUserMatch.awayTeam;

        if (homeName) homeName.textContent = homeDisplayName;
        if (awayName) awayName.textContent = awayDisplayName;

        if (homeRating) homeRating.textContent = isHomeUser ? `${Math.round(leagueState.effectiveTeamRating)}` : getClubRating(nextUserMatch.homeTeam);
        if (awayRating) awayRating.textContent = !isHomeUser ? `${Math.round(leagueState.effectiveTeamRating)}` : getClubRating(nextUserMatch.awayTeam);

        if (playBtn) {
            playBtn.innerHTML = `<i class="bi bi-play-fill me-1"></i> JUGAR FECHA ${currentMdNum}`;
        }

        if (derbyInd) {
            if (nextUserMatch.isInterzonal) {
                derbyInd.classList.remove('d-none');
            } else {
                derbyInd.classList.add('d-none');
            }
        }
    } else {
        if (previewCard) previewCard.classList.add('d-none');
    }

    renderLastPlayedMatches();
}

function getClubRating(clubName) {
    if (isUserTeam(clubName)) {
        return leagueState ? `${Math.round(leagueState.effectiveTeamRating)}` : '75';
    }
    const stdA = (leagueState.league.standingsA || []).find(s => s.teamName === clubName);
    if (stdA) return `${Math.round(stdA.baseMedia)}`;
    const stdB = (leagueState.league.standingsB || []).find(s => s.teamName === clubName);
    if (stdB) return `${Math.round(stdB.baseMedia)}`;
    return '70';
}

function renderStandingsTables() {
    if (!leagueState || !leagueState.league) return;

    renderStandingsBody('standings-a-body', leagueState.league.standingsA || []);
    renderStandingsBody('playoff-standings-a-body', leagueState.league.standingsA || []);

    renderStandingsBody('standings-b-body', leagueState.league.standingsB || []);
    renderStandingsBody('playoff-standings-b-body', leagueState.league.standingsB || []);
}

function renderStandingsBody(targetElementId, standingsList) {
    const tbody = document.getElementById(targetElementId);
    if (!tbody) return;
    tbody.innerHTML = '';

    standingsList.forEach(s => {
        const tr = document.createElement('tr');
        const userMatch = s.isUserTeam || isUserTeam(s.teamName);
        let rowClass = '';
        if (userMatch) rowClass = 'row-user';
        else if (s.pos <= 8) rowClass = 'row-playoff';

        if (rowClass) tr.className = rowClass;

        const displayName = userMatch ? getTeamName() : s.teamName;
        const difPrefix = s.goalDifference > 0 ? '+' : '';
        tr.innerHTML = `
            <td class="text-center font-bold">${s.pos}</td>
            <td class="text-truncate" style="max-width: 150px;">
                ${userMatch ? '<span class="text-warning fw-bold">★ ' + displayName + '</span>' : displayName}
                <span class="badge text-bg-dark border border-secondary font-mono text-secondary ms-1" style="font-size: 0.68rem;" title="Media del equipo">${Math.round(s.baseMedia)}</span>
            </td>
            <td class="text-center text-secondary">${s.played}</td>
            <td class="text-center">${s.won}</td>
            <td class="text-center text-secondary">${s.drawn}</td>
            <td class="text-center text-secondary">${s.lost}</td>
            <td class="text-center text-secondary">${s.goalsFor}</td>
            <td class="text-center text-secondary">${s.goalsAgainst}</td>
            <td class="text-center ${s.goalDifference > 0 ? 'text-success' : (s.goalDifference < 0 ? 'text-danger' : 'text-secondary')}">${difPrefix}${s.goalDifference}</td>
            <td class="text-center fw-bold fs-6 text-warning">${s.points}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderLastPlayedMatches() {
    const container = document.getElementById('fecha-matches-container');
    if (!container) return;
    container.innerHTML = '';

    const matches = leagueState.league.lastPlayedMatches || [];
    if (matches.length === 0) {
        container.innerHTML = '<div class="col-12 text-secondary font-mono small">Los partidos de la fecha se mostrarán aquí una vez jugada.</div>';
        return;
    }

    matches.forEach(m => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6';

        const isUser = m.isUserMatch || isUserTeam(m.homeTeam) || isUserTeam(m.awayTeam);
        const cardClass = isUser ? 'match-card-sm is-user' : 'match-card-sm';

        const homeName = isUserTeam(m.homeTeam) ? getTeamName() : m.homeTeam;
        const awayName = isUserTeam(m.awayTeam) ? getTeamName() : m.awayTeam;

        let eventsHtml = '';
        if (m.events && m.events.length > 0) {
            eventsHtml = '<div class="font-mono text-secondary mt-1" style="font-size: 0.72rem;">' +
                m.events.map(e => `${e.minute}' ⚽ ${e.scorer}`).join(' &bull; ') +
                '</div>';
        }

        col.innerHTML = `
            <div class="${cardClass}">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="font-chakra ${isUser && isUserTeam(m.homeTeam) ? 'text-warning fw-bold' : 'text-light'} text-truncate" style="max-width: 42%;">
                        ${homeName}
                    </span>
                    <span class="badge ${isUser ? 'text-bg-warning text-dark' : 'text-bg-dark border border-secondary'} font-mono fw-bold fs-6 px-2 py-1">
                        ${m.homeGoals} - ${m.awayGoals}
                    </span>
                    <span class="font-chakra ${isUser && isUserTeam(m.awayTeam) ? 'text-warning fw-bold' : 'text-light'} text-truncate text-end" style="max-width: 42%;">
                        ${awayName}
                    </span>
                </div>
                ${m.isInterzonal ? '<div class="text-center mt-1"><span class="badge badge-derby">INTERZONAL</span></div>' : ''}
                ${eventsHtml}
            </div>
        `;
        container.appendChild(col);
    });
}

async function playNextMatchdayRealTime() {
    if (isSimulating) return;
    isSimulating = true;

    const playBtn = document.getElementById('btn-play-fecha');
    const previewCard = document.getElementById('user-match-preview-card');
    const liveBoard = document.getElementById('match-live-board');
    const homeScoreEl = document.getElementById('live-home-score');
    const awayScoreEl = document.getElementById('live-away-score');
    const matchTimeEl = document.getElementById('live-match-time');
    const homeNameEl = document.getElementById('live-home-name');
    const awayNameEl = document.getElementById('live-away-name');
    const eventsLog = document.getElementById('events-log');
    const resultBanner = document.getElementById('match-result-banner');
    const resultText = document.getElementById('match-result-text');

    if (playBtn) playBtn.disabled = true;
    if (previewCard) previewCard.classList.add('d-none');

    try {
        const res = await fetch('/api/league/play-matchday', { method: 'POST' });
        if (!res.ok) {
            isSimulating = false;
            if (playBtn) playBtn.disabled = false;
            if (previewCard) previewCard.classList.remove('d-none');
            return;
        }

        const newState = await res.json();
        const lastMatches = newState.league.lastPlayedMatches || [];
        const userMatch = lastMatches.find(m => m.isUserMatch || isUserTeam(m.homeTeam) || isUserTeam(m.awayTeam));

        if (!userMatch) {
            leagueState = newState;
            renderFullState();
            isSimulating = false;
            if (playBtn) playBtn.disabled = false;
            return;
        }

        const homeDisplayName = isUserTeam(userMatch.homeTeam) ? getTeamName() : userMatch.homeTeam;
        const awayDisplayName = isUserTeam(userMatch.awayTeam) ? getTeamName() : userMatch.awayTeam;

        if (liveBoard) liveBoard.classList.remove('d-none');
        if (homeNameEl) homeNameEl.textContent = homeDisplayName;
        if (awayNameEl) awayNameEl.textContent = awayDisplayName;
        if (homeScoreEl) homeScoreEl.textContent = '0';
        if (awayScoreEl) awayScoreEl.textContent = '0';
        if (matchTimeEl) matchTimeEl.textContent = "0'";
        if (eventsLog) eventsLog.innerHTML = '<div class="ticker-item info font-mono small text-secondary">Comienza el partido.</div>';
        if (resultBanner) resultBanner.classList.add('d-none');

        const eventsByMinute = {};
        (userMatch.events || []).forEach(e => {
            eventsByMinute[e.minute] = e;
        });

        let currentHome = 0;
        let currentAway = 0;
        const getTickDelay = () => Math.round(90 / simulationSpeedMultiplier);

        for (let m = 1; m <= 90; m++) {
            if (matchTimeEl) matchTimeEl.textContent = `${m}'`;

            if (eventsByMinute[m]) {
                const ev = eventsByMinute[m];
                const item = document.createElement('div');
                const isHome = ev.homeTeamScored;
                if (isHome) {
                    currentHome++;
                    if (homeScoreEl) homeScoreEl.textContent = `${currentHome}`;
                } else {
                    currentAway++;
                    if (awayScoreEl) awayScoreEl.textContent = `${currentAway}`;
                }

                const teamScored = isHome ? homeDisplayName : awayDisplayName;
                const isUserGoal = isUserTeam(isHome ? userMatch.homeTeam : userMatch.awayTeam);
                item.className = isUserGoal ? 'ticker-item goal-home font-mono small text-warning fw-bold' : 'ticker-item goal-away font-mono small text-light';
                item.innerHTML = `⚽ Minuto ${m}': ¡GOL DE ${teamScored}! (${ev.scorer})`;
                if (eventsLog) eventsLog.prepend(item);
                await sleep(getTickDelay() * 3);
            }

            await sleep(getTickDelay());
        }

        if (resultBanner && resultText) {
            resultBanner.classList.remove('d-none');
            const userIsHome = isUserTeam(userMatch.homeTeam);
            const userGoals = userIsHome ? userMatch.homeGoals : userMatch.awayGoals;
            const rivalGoals = userIsHome ? userMatch.awayGoals : userMatch.homeGoals;

            if (userGoals > rivalGoals) {
                resultBanner.className = 'alert alert-success border-success text-center py-2 mb-0';
                resultText.textContent = `Victoria ${userMatch.homeGoals} - ${userMatch.awayGoals}`;
            } else if (userGoals === rivalGoals) {
                resultBanner.className = 'alert alert-warning border-warning text-center py-2 mb-0';
                resultText.textContent = `Empate ${userMatch.homeGoals} - ${userMatch.awayGoals}`;
            } else {
                resultBanner.className = 'alert alert-danger border-danger text-center py-2 mb-0';
                resultText.textContent = `Derrota ${userMatch.homeGoals} - ${userMatch.awayGoals}`;
            }
        }

        leagueState = newState;
        renderStandingsTables();
        renderLastPlayedMatches();

        if (leagueState.league.regularSeasonFinished) {
            if (previewCard) previewCard.classList.add('d-none');
            await sleep(1500);
            renderFullState();

            if (!leagueState.league.userQualifiedForPlayoffs) {
                const standingsTabBtn = document.getElementById('nav-standings-btn');
                if (standingsTabBtn) {
                    const tab = new bootstrap.Tab(standingsTabBtn);
                    tab.show();
                }
            }
        } else {
            renderLeagueRegular();
            if (previewCard) previewCard.classList.remove('d-none');
        }

    } catch (err) {
        console.error('Error al simular fecha en tiempo real:', err);
    } finally {
        isSimulating = false;
        if (playBtn) playBtn.disabled = false;
        if (leagueState && leagueState.league && !leagueState.league.regularSeasonFinished) {
            if (previewCard) previewCard.classList.remove('d-none');
        }
        updateSpeedButtonsVisibility();
    }
}

function renderPlayoffs() {
    const stageTitle = document.getElementById('playoff-stage-title');
    const userStatusCard = document.getElementById('playoff-user-status-card');
    const nextMatchBox = document.getElementById('playoff-next-match-box');
    const homeName = document.getElementById('playoff-home-name');
    const homeRatingEl = document.getElementById('playoff-home-rating');
    const awayName = document.getElementById('playoff-away-name');
    const awayRatingEl = document.getElementById('playoff-away-rating');
    const bracketContainer = document.getElementById('playoff-bracket-container');

    const roundName = leagueState.league.currentPlayoffRoundName || (leagueState.league.userWonLeague ? 'Finalizado' : 'Playoffs');
    if (stageTitle) stageTitle.textContent = `PLAYOFFS: ${roundName.toUpperCase()}`;

    
    if (userStatusCard) {
        if (leagueState.league.regularSeasonFinished && !leagueState.league.userQualifiedForPlayoffs) {
            userStatusCard.classList.remove('d-none');
            userStatusCard.className = 'alert alert-secondary text-center py-2 mb-3 font-mono small';
            userStatusCard.textContent = 'Finalizaste fuera de los 8 clasificados a playoffs.';
        } else {
            userStatusCard.classList.add('d-none');
        }
    }

    const playoffMatches = leagueState.league.playoffMatches || [];
    const userMatch = playoffMatches.find(m => (m.isUserMatch || isUserTeam(m.homeTeam) || isUserTeam(m.awayTeam)) && !m.played);

    if (userMatch && !leagueState.league.userEliminated && nextMatchBox) {
        nextMatchBox.classList.remove('d-none');
        const hName = isUserTeam(userMatch.homeTeam) ? getTeamName() : userMatch.homeTeam;
        const aName = isUserTeam(userMatch.awayTeam) ? getTeamName() : userMatch.awayTeam;

        if (homeName) homeName.textContent = hName;
        if (awayName) awayName.textContent = aName;

        if (homeRatingEl) homeRatingEl.textContent = getClubRating(userMatch.homeTeam);
        if (awayRatingEl) awayRatingEl.textContent = getClubRating(userMatch.awayTeam);
    } else if (nextMatchBox) {
        nextMatchBox.classList.add('d-none');
    }

    if (bracketContainer) {
        bracketContainer.innerHTML = '';
        playoffMatches.forEach(m => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6';

            const isUser = m.isUserMatch || isUserTeam(m.homeTeam) || isUserTeam(m.awayTeam);
            const nodeClass = isUser ? 'bracket-node is-user' : 'bracket-node';

            const hDisplay = isUserTeam(m.homeTeam) ? getTeamName() : m.homeTeam;
            const aDisplay = isUserTeam(m.awayTeam) ? getTeamName() : m.awayTeam;

            let resultLine = '<span class="text-secondary font-mono small">Por jugar</span>';
            if (m.played) {
                let extraInfo = '';
                if (m.wentToPenalties) {
                    extraInfo = ` <span class="badge text-bg-warning text-dark font-mono">(${m.homePenalties}-${m.awayPenalties} pen)</span>`;
                } else if (m.wentToExtraTime) {
                    extraInfo = ' <span class="badge text-bg-secondary font-mono">T.E.</span>';
                }
                resultLine = `<span class="badge text-bg-dark border border-secondary font-mono fw-bold fs-6">${m.homeGoals} - ${m.awayGoals}</span>${extraInfo}`;
            }

            const winDisplay = isUserTeam(m.winner) ? getTeamName() : m.winner;

            col.innerHTML = `
                <div class="${nodeClass}">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="badge text-bg-dark text-secondary font-mono" style="font-size: 0.65rem;">${m.roundName}</span>
                        ${m.winner ? '<span class="badge bg-success font-mono" style="font-size: 0.65rem;">Pasa: ' + winDisplay + '</span>' : ''}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="font-chakra ${m.winner === m.homeTeam ? 'text-success fw-bold' : (isUser && isUserTeam(m.homeTeam) ? 'text-warning fw-bold' : 'text-light')} text-truncate" style="max-width: 44%;">
                            ${hDisplay} <span class="badge text-bg-dark border border-secondary font-mono text-secondary ms-1" style="font-size: 0.65rem;">${getClubRating(m.homeTeam)}</span>
                        </span>
                        ${resultLine}
                        <span class="font-chakra ${m.winner === m.awayTeam ? 'text-success fw-bold' : (isUser && isUserTeam(m.awayTeam) ? 'text-warning fw-bold' : 'text-light')} text-truncate text-end" style="max-width: 44%;">
                            <span class="badge text-bg-dark border border-secondary font-mono text-secondary me-1" style="font-size: 0.65rem;">${getClubRating(m.awayTeam)}</span> ${aDisplay}
                        </span>
                    </div>
                </div>
            `;
            bracketContainer.appendChild(col);
        });
    }
}

async function playNextPlayoffRealTime() {
    if (isSimulating) return;
    isSimulating = true;

    const playBtn = document.getElementById('btn-play-playoff');
    const nextMatchBox = document.getElementById('playoff-next-match-box');
    const liveBoard = document.getElementById('playoff-live-board');
    const homeScoreEl = document.getElementById('playoff-live-home-score');
    const awayScoreEl = document.getElementById('playoff-live-away-score');
    const matchTimeEl = document.getElementById('playoff-live-match-time');
    const homeNameEl = document.getElementById('playoff-live-home-name');
    const awayNameEl = document.getElementById('playoff-live-away-name');
    const eventsLog = document.getElementById('playoff-events-log');
    const penaltiesDisplay = document.getElementById('playoff-penalties-display');
    const penHomeDots = document.getElementById('playoff-pen-home-dots');
    const penAwayDots = document.getElementById('playoff-pen-away-dots');
    const penScoreText = document.getElementById('playoff-penalties-score-text');
    const penHomeName = document.getElementById('playoff-pen-home-name');
    const penAwayName = document.getElementById('playoff-pen-away-name');
    const resultBanner = document.getElementById('playoff-result-banner');
    const resultText = document.getElementById('playoff-result-text');

    if (playBtn) playBtn.disabled = true;
    if (nextMatchBox) nextMatchBox.classList.add('d-none');

    try {
        const res = await fetch('/api/league/play-playoff', { method: 'POST' });
        if (!res.ok) {
            isSimulating = false;
            if (playBtn) playBtn.disabled = false;
            return;
        }

        const newState = await res.json();
        const lastRoundMatches = newState.league.lastPlayedPlayoffMatches || [];
        const userMatch = lastRoundMatches.find(m => m.isUserMatch || isUserTeam(m.homeTeam) || isUserTeam(m.awayTeam));

        if (!userMatch) {
            leagueState = newState;
            renderFullState();
            isSimulating = false;
            if (playBtn) playBtn.disabled = false;
            return;
        }

        const hDisplayName = isUserTeam(userMatch.homeTeam) ? getTeamName() : userMatch.homeTeam;
        const aDisplayName = isUserTeam(userMatch.awayTeam) ? getTeamName() : userMatch.awayTeam;

        if (liveBoard) liveBoard.classList.remove('d-none');
        if (homeNameEl) homeNameEl.textContent = hDisplayName;
        if (awayNameEl) awayNameEl.textContent = aDisplayName;
        if (homeScoreEl) homeScoreEl.textContent = '0';
        if (awayScoreEl) awayScoreEl.textContent = '0';
        if (matchTimeEl) matchTimeEl.textContent = "0'";
        if (eventsLog) eventsLog.innerHTML = '<div class="ticker-item info font-mono small text-secondary">Comienza el partido eliminatorio.</div>';
        if (penaltiesDisplay) penaltiesDisplay.classList.add('d-none');
        if (resultBanner) resultBanner.classList.add('d-none');

        const totalMinutes = userMatch.wentToExtraTime ? 120 : 90;
        const eventsByMinute = {};
        (userMatch.events || []).forEach(e => {
            eventsByMinute[e.minute] = e;
        });

        let currentHome = 0;
        let currentAway = 0;
        const getTickDelay = () => Math.round(90 / simulationSpeedMultiplier);

        for (let m = 1; m <= totalMinutes; m++) {
            if (matchTimeEl) matchTimeEl.textContent = `${m}'`;

            if (eventsByMinute[m]) {
                const ev = eventsByMinute[m];
                const item = document.createElement('div');
                const isHome = ev.homeTeamScored;
                if (isHome) {
                    currentHome++;
                    if (homeScoreEl) homeScoreEl.textContent = `${currentHome}`;
                } else {
                    currentAway++;
                    if (awayScoreEl) awayScoreEl.textContent = `${currentAway}`;
                }

                const teamScored = isHome ? hDisplayName : aDisplayName;
                const isUserGoal = isUserTeam(isHome ? userMatch.homeTeam : userMatch.awayTeam);
                item.className = isUserGoal ? 'ticker-item goal-home font-mono small text-warning fw-bold' : 'ticker-item goal-away font-mono small text-light';
                item.innerHTML = `⚽ Minuto ${m}': ¡GOL DE ${teamScored}! (${ev.scorer})`;
                if (eventsLog) eventsLog.prepend(item);
                await sleep(getTickDelay() * 3);
            }

            if (m === 90 && userMatch.wentToExtraTime) {
                const alargueItem = document.createElement('div');
                alargueItem.className = 'ticker-item info font-mono small text-info';
                alargueItem.innerHTML = `<strong>Minuto 90': Empate ${userMatch.homeGoalsAt90 || 0}-${userMatch.awayGoalsAt90 || 0}. ¡Alargue!</strong>`;
                if (eventsLog) eventsLog.prepend(alargueItem);
                await sleep(getTickDelay() * 4);
            }

            await sleep(getTickDelay());
        }

        
        if (userMatch.wentToPenalties && userMatch.penaltyEvents && userMatch.penaltyEvents.length > 0) {
            await sleep(getTickDelay() * 6);
            if (penaltiesDisplay) penaltiesDisplay.classList.remove('d-none');
            if (penHomeName) penHomeName.textContent = hDisplayName;
            if (penAwayName) penAwayName.textContent = aDisplayName;
            if (penHomeDots) penHomeDots.innerHTML = '';
            if (penAwayDots) penAwayDots.innerHTML = '';
            if (penScoreText) penScoreText.textContent = '0 - 0';

            const penStatusLine = document.getElementById('playoff-pen-status-line');
            if (penStatusLine) penStatusLine.textContent = "Empate en los 120'. ¡Comienza la tanda de penales!";

            const tandaAlert = document.createElement('div');
            tandaAlert.className = 'ticker-item info font-mono small text-warning';
            tandaAlert.innerHTML = `<strong>🚨 ¡DEFINICIÓN POR PENALES! Empate en los 120' (${userMatch.homeGoals}-${userMatch.awayGoals})</strong>`;
            if (eventsLog) eventsLog.prepend(tandaAlert);

            for (let i = 0; i < 5; i++) {
                const dotH = document.createElement('span');
                dotH.className = 'pen-dot';
                dotH.id = `playoff-pen-dot-h-${i + 1}`;
                if (penHomeDots) penHomeDots.appendChild(dotH);

                const dotA = document.createElement('span');
                dotA.className = 'pen-dot';
                dotA.id = `playoff-pen-dot-a-${i + 1}`;
                if (penAwayDots) penAwayDots.appendChild(dotA);
            }

            await sleep(getTickDelay() * 6);

            for (let i = 0; i < userMatch.penaltyEvents.length; i++) {
                const k = userMatch.penaltyEvents[i];
                const teamName = k.isHome ? hDisplayName : aDisplayName;

                if (penStatusLine) penStatusLine.textContent = `${teamName}: patea ${k.kicker}...`;
                await sleep(getTickDelay() * 5);

                if (k.round > 5) {
                    const container = k.isHome ? penHomeDots : penAwayDots;
                    const existing = document.getElementById(`playoff-pen-dot-${k.isHome ? 'h' : 'a'}-${k.round}`);
                    if (!existing && container) {
                        const newDot = document.createElement('span');
                        newDot.className = 'pen-dot';
                        newDot.id = `playoff-pen-dot-${k.isHome ? 'h' : 'a'}-${k.round}`;
                        container.appendChild(newDot);
                    }
                }

                const dot = document.getElementById(`playoff-pen-dot-${k.isHome ? 'h' : 'a'}-${k.round}`);
                const logItem = document.createElement('div');

                if (k.scored) {
                    if (dot) dot.classList.add('scored');
                    if (penStatusLine) penStatusLine.textContent = `¡GOL! ${k.kicker} convirtió (${k.homeScore}-${k.awayScore})`;
                    logItem.className = k.isHome ? 'ticker-item goal-home font-mono small text-warning fw-bold' : 'ticker-item goal-away font-mono small text-light';
                    logItem.innerHTML = `<strong>⚽ Penal de ${k.kicker} (${teamName}): ¡GOL! (${k.homeScore}-${k.awayScore})</strong>`;
                } else {
                    if (dot) dot.classList.add('missed');
                    if (penStatusLine) penStatusLine.textContent = `¡FALLÓ! ${k.kicker} no pudo convertir (${k.homeScore}-${k.awayScore})`;
                    logItem.className = 'ticker-item info font-mono small text-secondary';
                    logItem.innerHTML = `<strong>❌ Penal de ${k.kicker} (${teamName}): ¡FALLADO! (${k.homeScore}-${k.awayScore})</strong>`;
                }

                if (penScoreText) penScoreText.textContent = `${k.homeScore} - ${k.awayScore}`;
                if (eventsLog) eventsLog.prepend(logItem);

                await sleep(getTickDelay() * 4);
            }

            const winnerDisplayName = isUserTeam(userMatch.winner) ? getTeamName() : userMatch.winner;
            if (penStatusLine) penStatusLine.textContent = `¡Tanda finalizada! Ganó ${winnerDisplayName} (${userMatch.homePenalties} - ${userMatch.awayPenalties})`;

            const finItem = document.createElement('div');
            finItem.className = 'ticker-item info font-mono small text-warning';
            finItem.innerHTML = `<strong>🏁 ¡Ganó ${winnerDisplayName} por penales (${userMatch.homePenalties}-${userMatch.awayPenalties})!</strong>`;
            if (eventsLog) eventsLog.prepend(finItem);

            await sleep(getTickDelay() * 6);
        }

        
        if (resultBanner && resultText) {
            resultBanner.classList.remove('d-none');
            const userWon = isUserTeam(userMatch.winner);
            let methodText = '';
            if (userMatch.wentToPenalties) {
                methodText = ` (${userMatch.homePenalties}-${userMatch.awayPenalties} pen.)`;
            } else if (userMatch.wentToExtraTime) {
                methodText = ` (alargue)`;
            }

            if (userWon) {
                const isFinal = (userMatch.roundName === 'Gran Final' || newState.league.userWonLeague);
                if (isFinal) {
                    resultBanner.className = 'alert alert-warning border-warning text-center py-2 mb-0';
                    resultText.innerHTML = `🏆 ¡${getTeamName()} CAMPEÓN DE LA CHIQUILEAGUE! ${methodText}`;
                } else {
                    resultBanner.className = 'alert alert-success border-success text-center py-2 mb-0';
                    resultText.textContent = `Avanzaste a la siguiente ronda${methodText}`;
                }
            } else {
                resultBanner.className = 'alert alert-danger border-danger text-center py-2 mb-0';
                resultText.textContent = `Eliminado en ${userMatch.roundName}${methodText}`;
            }
        }

        leagueState = newState;
        await sleep(1800);
        renderFullState();

    } catch (err) {
        console.error('Error al simular playoff en tiempo real:', err);
    } finally {
        isSimulating = false;
        if (playBtn) playBtn.disabled = false;
        updateSpeedButtonsVisibility();
    }
}

function renderGameOverRecap() {
    const recapBox = document.getElementById('run-recap-content');
    const gameOverPanel = document.getElementById('game-over-panel');
    if (!recapBox || !gameOverPanel || !leagueState || !leagueState.league) return;

    const lg = leagueState.league;
    const isFinished = isTournamentOver();

    if (!isFinished) {
        gameOverPanel.classList.add('d-none');
        return;
    }

    const summary = lg.tournamentSummary || {};
    const pts = summary.points !== undefined ? summary.points : 0;
    const won = summary.won !== undefined ? summary.won : 0;
    const drawn = summary.drawn !== undefined ? summary.drawn : 0;
    const lost = summary.lost !== undefined ? summary.lost : 0;
    const gf = summary.goalsFor !== undefined ? summary.goalsFor : 0;
    const gc = summary.goalsAgainst !== undefined ? summary.goalsAgainst : 0;
    const diff = gf - gc;
    const diffSign = diff > 0 ? `+${diff}` : `${diff}`;

    const myTeam = getTeamName();

    let statusTitle = '';
    if (lg.userWonLeague) {
        statusTitle = `★ CAMPAÑA HISTÓRICA: ¡${myTeam.toUpperCase()} CAMPEÓN DE LA CHIQUILEAGUE! ★`;
    } else if (lg.userEliminated) {
        const lastPlayoffMatch = (summary.userPlayoffMatches || []).slice(-1)[0];
        const roundName = lastPlayoffMatch ? lastPlayoffMatch.roundName.toUpperCase() : 'PLAYOFFS';
        statusTitle = `★ CERTAMEN FINALIZADO EN ${roundName} ★`;
    } else {
        const userStd = (lg.standingsA || []).find(s => s.isUserTeam || isUserTeam(s.teamName));
        const pos = userStd ? userStd.pos : '-';
        statusTitle = `★ FASE REGULAR FINALIZADA: PUESTO #${pos} ★`;
    }

    const userPMatches = summary.userPlayoffMatches || [];
    let rowsHtml = '';
    if (userPMatches.length > 0) {
        rowsHtml = userPMatches.map(m => {
            const icon = isUserTeam(m.winner) ? '✅' : '❌';
            const rival = isUserTeam(m.homeTeam) ? m.awayTeam : m.homeTeam;
            let scoreDetail = `${m.homeGoals} - ${m.awayGoals}`;
            if (m.wentToPenalties) {
                scoreDetail += ` (${m.homePenalties}-${m.awayPenalties} pen.)`;
            } else if (m.wentToExtraTime) {
                scoreDetail += ` (alargue)`;
            }
            return `
                <div class="recap-match-row">
                    <span>${icon} <strong>${m.roundName}</strong> vs ${rival}</span>
                    <span>${scoreDetail}</span>
                </div>
            `;
        }).join('');
    } else {
        rowsHtml = `
            <div class="recap-match-row text-secondary">
                <span>Fase Regular: 15 fechas disputadas en Zona A</span>
                <span>${pts} pts (Puesto #${(lg.standingsA || []).find(s => s.isUserTeam || isUserTeam(s.teamName))?.pos || '-'})</span>
            </div>
        `;
    }

    recapBox.innerHTML = `
        <div class="recap-header font-chakra text-warning fw-bold fs-5 mb-2">${statusTitle}</div>
        <div class="recap-stats d-flex justify-content-around flex-wrap gap-2 my-2 py-2 border-top border-bottom border-secondary border-opacity-50 font-mono small">
            <span>⭐ Puntos: <strong>${pts} pts</strong></span>
            <span>📊 Récord: <strong>${won}G - ${drawn}E - ${lost}P</strong></span>
            <span>⚽ Goles convertidos: <strong>${gf}</strong></span>
            <span>🛡️ Goles recibidos: <strong>${gc}</strong></span>
            <span>Dif: <strong>${diffSign}</strong></span>
        </div>
        <div class="recap-matches my-2 text-start font-mono small">
            <span class="text-secondary d-block mb-1 text-uppercase" style="font-size: 0.72rem;">Camino en el Torneo:</span>
            ${rowsHtml}
        </div>
        <div class="recap-share-link bg-black bg-opacity-60 border border-info border-opacity-50 rounded p-2 my-2 text-center">
            <span class="text-secondary font-mono d-block text-uppercase" style="font-size: 0.68rem; letter-spacing: 0.5px;">Link para jugar y compartir:</span>
            <a href="https://juego-chiqui-game.vercel.app/index.html" target="_blank" class="text-info text-decoration-none font-chakra fw-bold fs-6 d-inline-block text-truncate" style="max-width: 100%;">https://juego-chiqui-game.vercel.app/index.html</a>
        </div>
        <div class="recap-socials">
            <span>Redes:</span>
            <a href="https://www.instagram.com/santifaccio/" target="_blank" rel="noopener noreferrer" class="social-link ig text-info text-decoration-none">📸 @santifaccio</a>
            <span class="sep text-secondary">&bull;</span>
            <a href="https://x.com/santifaccioo" target="_blank" rel="noopener noreferrer" class="social-link x text-info text-decoration-none">✖️ @santifaccioo</a>
        </div>
    `;

    gameOverPanel.classList.remove('d-none');
}

function shareRunSummary() {
    if (!leagueState || !leagueState.league) return;

    const lg = leagueState.league;
    const summary = lg.tournamentSummary || {};
    const pts = summary.points !== undefined ? summary.points : 0;
    const won = summary.won !== undefined ? summary.won : 0;
    const drawn = summary.drawn !== undefined ? summary.drawn : 0;
    const lost = summary.lost !== undefined ? summary.lost : 0;
    const gf = summary.goalsFor !== undefined ? summary.goalsFor : 0;
    const gc = summary.goalsAgainst !== undefined ? summary.goalsAgainst : 0;
    const diff = gf - gc;
    const diffSign = diff > 0 ? `+${diff}` : `${diff}`;

    const myTeam = getTeamName();

    let title = '';
    if (lg.userWonLeague) {
        title = `★ ¡${myTeam.toUpperCase()} CAMPEÓN DE LA CHIQUI LEAGUE! ★`;
    } else if (lg.userEliminated) {
        const lastPlayoffMatch = (summary.userPlayoffMatches || []).slice(-1)[0];
        const roundName = lastPlayoffMatch ? lastPlayoffMatch.roundName : 'Playoffs';
        title = `★ Mi campaña en ChiquiLeague con ${myTeam}: Llegué a ${roundName} ★`;
    } else {
        const userStd = (lg.standingsA || []).find(s => s.isUserTeam || isUserTeam(s.teamName));
        const pos = userStd ? userStd.pos : '-';
        title = `★ Mi campaña en ChiquiLeague con ${myTeam}: Finalicé #${pos} en Zona A ★`;
    }

    const userPMatches = summary.userPlayoffMatches || [];
    let matchesText = '';
    if (userPMatches.length > 0) {
        matchesText = userPMatches.map(m => {
            const icon = isUserTeam(m.winner) ? '✅' : '❌';
            const rival = isUserTeam(m.homeTeam) ? m.awayTeam : m.homeTeam;
            let score = `${m.homeGoals}-${m.awayGoals}`;
            if (m.wentToPenalties) score += ` (${m.homePenalties}-${m.awayPenalties} pen.)`;
            else if (m.wentToExtraTime) score += ` (alargue)`;
            return `${icon} ${m.roundName}: ${score} vs ${rival}`;
        }).join('\n');
    } else {
        matchesText = `Fase Regular completada (${pts} pts | ${won}G-${drawn}E-${lost}P)`;
    }

    const shareContent = `${title}\nEquipo: ${myTeam} (Media Once: ${Math.round(leagueState.effectiveTeamRating)})\n\nFase Regular (Zona A):\n⭐ Puntos: ${pts} | Récord: ${won}G - ${drawn}E - ${lost}P\n⚽ Goles convertidos: ${gf} | 🛡️ Goles recibidos: ${gc} (Dif: ${diffSign})\n\nDesempeño en Playoffs:\n${matchesText}\n\n🎮 Jugá vos también en: https://juego-chiqui-game.vercel.app/index.html\n📸 IG: https://www.instagram.com/santifaccio/\n✖️ X: https://x.com/santifaccioo`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareContent);
    }

    if (navigator.share) {
        try {
            navigator.share({
                title: `Mi campaña en ChiquiLeague (${myTeam})`,
                text: shareContent
            });
        } catch (e) {}
    }

    const toast = document.getElementById('share-toast');
    if (toast) {
        toast.classList.remove('d-none');
        setTimeout(() => {
            toast.classList.add('d-none');
        }, 2500);
    }
}
