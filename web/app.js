// Estado global
let gameState = null;
let isSimulatingMatch = false;
let simulationSpeedMultiplier = 1; // 1x o 2x
let cupRunHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    startNewGame();
});

function setupEventListeners() {
    document.getElementById('btn-restart').addEventListener('click', () => {
        if (confirm('¿Reiniciar la partida?')) {
            startNewGame();
        }
    });

    document.getElementById('btn-play-match').addEventListener('click', () => {
        if (!isSimulatingMatch) {
            playNextMatch();
        }
    });

    const speedBtn = document.getElementById('btn-speed-toggle');
    speedBtn.addEventListener('click', () => {
        if (simulationSpeedMultiplier === 1) {
            simulationSpeedMultiplier = 2;
            speedBtn.textContent = '2x Rápido';
            speedBtn.classList.add('active');
        } else {
            simulationSpeedMultiplier = 1;
            speedBtn.textContent = '1x Normal';
            speedBtn.classList.remove('active');
        }
    });

    document.getElementById('btn-next-round').addEventListener('click', () => {
        document.getElementById('match-live-board').classList.add('hidden');
        document.getElementById('post-match-actions').classList.add('hidden');
        const playBtn = document.getElementById('btn-play-match');
        playBtn.classList.remove('hidden');
        playBtn.disabled = false;
        prepareNextCupMatchView();
    });

    // Botones de Fin de Partida
    document.getElementById('btn-play-again').addEventListener('click', () => {
        startNewGame();
    });

    document.getElementById('btn-share-run').addEventListener('click', () => {
        shareRunSummary();
    });

    const rerollBtn = document.getElementById('btn-reroll-draft');
    if (rerollBtn) {
        rerollBtn.addEventListener('click', () => {
            rerollDraftChoices();
        });
    }
}

async function startNewGame() {
    try {
        cupRunHistory = [];
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name') || localStorage.getItem('userTeamName') || 'ChiquiTeam';
        localStorage.setItem('userTeamName', nameParam);

        const res = await fetch('/api/game/new?name=' + encodeURIComponent(nameParam), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nameParam })
        });
        gameState = await res.json();

        // Reset visual de paneles
        document.getElementById('game-over-panel').classList.add('hidden');
        document.getElementById('match-live-board').classList.add('hidden');
        document.getElementById('post-match-actions').classList.add('hidden');
        const playBtn = document.getElementById('btn-play-match');
        playBtn.classList.remove('hidden');
        playBtn.disabled = false;

        renderFullState();
    } catch (err) {
        console.error('Error iniciando juego:', err);
    }
}

function renderFullState() {
    if (!gameState) return;

    // Header info
    document.getElementById('header-rating').textContent = Math.round(gameState.effectiveTeamRating);

    const headerPhase = document.getElementById('header-phase');
    if (!gameState.draftFinished) {
        headerPhase.textContent = `Draft ${gameState.currentDraftRound}/11`;
        document.getElementById('draft-section').classList.remove('hidden');
        document.getElementById('cup-section').classList.add('hidden');
        renderDraft();
    } else {
        headerPhase.textContent = `Copa - ${gameState.currentCupRoundName}`;
        document.getElementById('draft-section').classList.add('hidden');
        document.getElementById('cup-section').classList.remove('hidden');
        renderCupSetup();
    }

    renderPitch(gameState.slots);
}

// Cancha Táctica (Regla de negocio: recuadro verde si es óptima, amarillo si -3, rojo si -12)
function renderPitch(slots) {
    if (!slots) return;

    slots.forEach(slot => {
        const slotEl = document.getElementById(`slot-${slot.slotIndex}`);
        if (!slotEl) return;

        // Reset de clases
        slotEl.className = 'tactical-slot';

        if (slot.isEmpty) {
            slotEl.innerHTML = `
                <span class="pos-tag">${slot.requiredPosition}</span>
                <div class="slot-body empty">Vacío</div>
            `;
        } else {
            const penalty = Number(slot.penalty);

            // Asignación de clase para el recuadro de color
            if (penalty === 0.0) {
                slotEl.classList.add('optima');          // Verde
            } else if (penalty === 3.0) {
                slotEl.classList.add('penalidad-cat');   // Amarillo
            } else if (penalty >= 12.0) {
                slotEl.classList.add('penalidad-diff');  // Rojo
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

// Renderizado de las 4 opciones de Draft con recuadro en la posición anticipando el encaje
function renderDraft() {
    const roundTitle = document.getElementById('draft-round-title');
    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    if (gameState.currentDraftRound === 1) {
        roundTitle.textContent = 'Ronda 1/11: Arquero';
    } else {
        roundTitle.textContent = `Ronda ${gameState.currentDraftRound}/11: Jugadores de Campo`;
    }

    const rerollBtn = document.getElementById('btn-reroll-draft');
    const rerollBadge = document.getElementById('reroll-badge');
    const remaining = gameState.rerollsRemaining !== undefined ? gameState.rerollsRemaining : 3;

    if (rerollBadge) {
        rerollBadge.textContent = `${remaining}`;
    }
    if (rerollBtn) {
        rerollBtn.disabled = (remaining <= 0);
        rerollBtn.title = remaining > 0
            ? `Sortear 4 opciones nuevas (${remaining} disponible${remaining === 1 ? '' : 's'})`
            : 'No te quedan más sorteos disponibles';
    }

    gameState.choices.forEach((player, idx) => {
        // Clase de recuadro según dónde encajaría hoy: optima (verde), penalidad-cat (amarillo), penalidad-diff (rojo)
        const fitClass = player.projectedFit || 'optima';
        const card = document.createElement('article');
        card.className = 'choice-card';

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

        if (rarityCardClass) {
            card.classList.add(rarityCardClass);
        }

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
                <p class="choice-club">${player.club || ''}</p>
                <p class="choice-cat">Cat: ${player.category}</p>
            </div>
            <button class="btn-select" data-index="${idx}">SELECCIONAR</button>
        `;

        card.addEventListener('click', () => pickPlayer(idx));
        container.appendChild(card);
    });
}

async function pickPlayer(index) {
    try {
        const res = await fetch('/api/draft/choose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ choiceIndex: index })
        });
        gameState = await res.json();
        renderFullState();
    } catch (err) {
        console.error('Error eligiendo jugador:', err);
    }
}

async function rerollDraftChoices() {
    if (!gameState || gameState.draftFinished) return;
    if (gameState.rerollsRemaining <= 0) return;

    const rerollBtn = document.getElementById('btn-reroll-draft');
    if (rerollBtn) rerollBtn.disabled = true;

    try {
        const res = await fetch('/api/draft/reroll', { method: 'POST' });
        if (res.ok) {
            gameState = await res.json();
            renderFullState();
        } else {
            const err = await res.json();
            alert(err.error || 'No se pudo volver a sortear');
        }
    } catch (err) {
        console.error('Error al volver a sortear:', err);
    } finally {
        if (gameState && gameState.rerollsRemaining > 0 && rerollBtn) {
            rerollBtn.disabled = false;
        }
    }
}

// Configuración de la Copa
function renderCupSetup() {
    const userTeamName = gameState.userTeamName || localStorage.getItem('userTeamName') || 'ChiquiTeam';
    document.getElementById('cup-stage-title').textContent = `COPA - ${gameState.currentCupRoundName.toUpperCase()}`;
    document.getElementById('cup-user-rating').textContent = Math.round(gameState.effectiveTeamRating);
    const fixtureUserEl = document.querySelector('.fixture-name');
    if (fixtureUserEl) fixtureUserEl.textContent = userTeamName.toUpperCase();
    const penTeamHome = document.querySelector('.pen-team-name');
    if (penTeamHome) penTeamHome.textContent = userTeamName.toUpperCase();
    document.getElementById('rival-name').textContent = 'Sorteo al iniciar';
    document.getElementById('rival-rating').textContent = '--';
}

function prepareNextCupMatchView() {
    renderFullState();
    document.getElementById('events-log').innerHTML = '';
    document.getElementById('match-result-banner').className = 'result-banner hidden';
}

// Simulación de Partido
async function playNextMatch() {
    isSimulatingMatch = true;
    const playBtn = document.getElementById('btn-play-match');
    playBtn.disabled = true;
    playBtn.classList.add('hidden');

    const liveBoard = document.getElementById('match-live-board');
    liveBoard.classList.remove('hidden');

    const homeScoreEl = document.getElementById('live-home-score');
    const awayScoreEl = document.getElementById('live-away-score');
    const timeBadge = document.getElementById('live-match-time');
    const awayNameEl = document.getElementById('live-away-name');
    const eventsLog = document.getElementById('events-log');
    const penaltiesDisplay = document.getElementById('penalties-display');
    const resultBanner = document.getElementById('match-result-banner');
    const postMatchActions = document.getElementById('post-match-actions');
    const gameOverPanel = document.getElementById('game-over-panel');

    homeScoreEl.textContent = '0';
    awayScoreEl.textContent = '0';
    eventsLog.innerHTML = '';
    penaltiesDisplay.classList.add('hidden');
    resultBanner.className = 'result-banner hidden';
    postMatchActions.classList.add('hidden');
    gameOverPanel.classList.add('hidden');

    try {
        const res = await fetch('/api/cup/next-match', { method: 'POST' });
        const matchData = await res.json();

        // Actualizar la ronda actual y siguiente en el estado global
        if (matchData.nextCupRoundName) {
            gameState.currentCupRoundName = matchData.nextCupRoundName;
            gameState.currentCupRoundIndex = matchData.nextCupRoundIndex;
        }

        // Registrar partido en el historial de la partida
        cupRunHistory.push({
            roundName: matchData.roundName,
            opponentName: matchData.opponent.name,
            homeGoals: matchData.homeGoals,
            awayGoals: matchData.awayGoals,
            wentToExtraTime: matchData.wentToExtraTime,
            homeGoalsAt90: matchData.homeGoalsAt90,
            awayGoalsAt90: matchData.awayGoalsAt90,
            wentToPenalties: matchData.wentToPenalties,
            homePenalties: matchData.homePenalties,
            awayPenalties: matchData.awayPenalties,
            userWon: matchData.userWon
        });

        // Reflejar la ronda del partido actual en los títulos durante el juego
        document.getElementById('header-phase').textContent = matchData.roundName;
        document.getElementById('cup-stage-title').textContent = `COPA - ${matchData.roundName.toUpperCase()}`;

        // Datos del rival sorteado
        document.getElementById('rival-name').textContent = matchData.opponent.name;
        document.getElementById('rival-rating').textContent = Math.round(matchData.opponent.baseMedia);
        awayNameEl.textContent = matchData.opponent.name;

        const totalMinutes = matchData.wentToExtraTime ? 120 : 90;
        let currentHomeScore = 0;
        let currentAwayScore = 0;

        const eventsByMinute = {};
        matchData.events.forEach(e => {
            eventsByMinute[e.minute] = e;
        });

        // Simulación pausada con multiplicador x2
        const getTickDelay = () => Math.round(140 / simulationSpeedMultiplier);

        for (let m = 1; m <= totalMinutes; m++) {
            timeBadge.textContent = `${m}'`;

            if (eventsByMinute[m]) {
                const ev = eventsByMinute[m];
                const item = document.createElement('div');
                const scorerInfo = ev.scorer ? ` (${ev.scorer})` : '';

                if (ev.homeTeamScored) {
                    currentHomeScore++;
                    homeScoreEl.textContent = currentHomeScore;
                    item.className = 'ticker-item goal-home';
                    item.innerHTML = `<strong>Minuto ${m}': ¡GOL TUYO!${scorerInfo}</strong>`;
                } else {
                    currentAwayScore++;
                    awayScoreEl.textContent = currentAwayScore;
                    item.className = 'ticker-item goal-away';
                    item.innerHTML = `<strong>Minuto ${m}': Gol de ${matchData.opponent.name}${scorerInfo}</strong>`;
                }
                eventsLog.prepend(item);
            }

            if (m === 90 && matchData.wentToExtraTime) {
                const alargueItem = document.createElement('div');
                alargueItem.className = 'ticker-item info';
                alargueItem.innerHTML = `<strong>Minuto 90': Empate ${matchData.homeGoalsAt90}-${matchData.awayGoalsAt90}. Tiempo extra.</strong>`;
                eventsLog.prepend(alargueItem);
                await sleep(getTickDelay() * 6);
            }

            await sleep(getTickDelay());
        }

        // Definición por Penales si correspondió
        if (matchData.wentToPenalties) {
            await sleep(getTickDelay() * 6);
            penaltiesDisplay.classList.remove('hidden');

            const penScoreText = document.getElementById('penalties-score-text');
            const penAwayName = document.getElementById('pen-away-name');
            const penHomeDots = document.getElementById('pen-home-dots');
            const penAwayDots = document.getElementById('pen-away-dots');
            const penStatusLine = document.getElementById('pen-status-line');

            if (penAwayName) penAwayName.textContent = matchData.opponent.name;
            if (penScoreText) penScoreText.textContent = '0 - 0';
            if (penHomeDots) penHomeDots.innerHTML = '';
            if (penAwayDots) penAwayDots.innerHTML = '';
            if (penStatusLine) penStatusLine.textContent = "Empate en los 120'. ¡Comienza la tanda de penales!";

            const tandaAlert = document.createElement('div');
            tandaAlert.className = 'ticker-item info';
            tandaAlert.innerHTML = `<strong>🚨 ¡DEFINICIÓN POR PENALES! Empate en los 120'</strong>`;
            eventsLog.prepend(tandaAlert);

            const kicks = matchData.penaltyKicks || [];

            // Inicializar 5 puntos vacíos para cada equipo
            const maxRounds = kicks.length ? Math.max(...kicks.map(k => k.round)) : 5;
            const regularRounds = Math.max(5, maxRounds);
            for (let i = 0; i < 5; i++) {
                const dotH = document.createElement('span');
                dotH.className = 'pen-dot';
                dotH.id = `pen-dot-h-${i + 1}`;
                if (penHomeDots) penHomeDots.appendChild(dotH);

                const dotA = document.createElement('span');
                dotA.className = 'pen-dot';
                dotA.id = `pen-dot-a-${i + 1}`;
                if (penAwayDots) penAwayDots.appendChild(dotA);
            }

            await sleep(getTickDelay() * 6);

            for (let i = 0; i < kicks.length; i++) {
                const k = kicks[i];
                const teamName = k.isHome ? (gameState.userTeamName || 'ChiquiTeam') : matchData.opponent.name;

                if (penStatusLine) penStatusLine.textContent = `${teamName}: patea ${k.kicker}...`;
                await sleep(getTickDelay() * 5);

                // Crear punto para muerte súbita si supera 5
                if (k.round > 5) {
                    const container = k.isHome ? penHomeDots : penAwayDots;
                    const existing = document.getElementById(`pen-dot-${k.isHome ? 'h' : 'a'}-${k.round}`);
                    if (!existing && container) {
                        const newDot = document.createElement('span');
                        newDot.className = 'pen-dot';
                        newDot.id = `pen-dot-${k.isHome ? 'h' : 'a'}-${k.round}`;
                        container.appendChild(newDot);
                    }
                }

                const dot = document.getElementById(`pen-dot-${k.isHome ? 'h' : 'a'}-${k.round}`);
                const logItem = document.createElement('div');

                if (k.scored) {
                    if (dot) dot.classList.add('scored');
                    if (penStatusLine) penStatusLine.textContent = `¡GOL! ${k.kicker} convirtió (${k.homeScore}-${k.awayScore})`;
                    logItem.className = k.isHome ? 'ticker-item goal-home' : 'ticker-item goal-away';
                    logItem.innerHTML = `<strong>⚽ Penal de ${k.kicker} (${teamName}): ¡GOL! (${k.homeScore}-${k.awayScore})</strong>`;
                } else {
                    if (dot) dot.classList.add('missed');
                    if (penStatusLine) penStatusLine.textContent = `¡FALLÓ! ${k.kicker} no pudo convertir (${k.homeScore}-${k.awayScore})`;
                    logItem.className = 'ticker-item info';
                    logItem.innerHTML = `<strong>❌ Penal de ${k.kicker} (${teamName}): ¡FALLADO! (${k.homeScore}-${k.awayScore})</strong>`;
                }

                if (penScoreText) penScoreText.textContent = `${k.homeScore} - ${k.awayScore}`;
                eventsLog.prepend(logItem);

                await sleep(getTickDelay() * 4);
            }

            const winnerName = matchData.userWon ? (gameState.userTeamName || 'ChiquiTeam') : matchData.opponent.name;
            if (penStatusLine) penStatusLine.textContent = `¡Tanda finalizada! Ganó ${winnerName} (${matchData.homePenalties} - ${matchData.awayPenalties})`;

            const finItem = document.createElement('div');
            finItem.className = 'ticker-item info';
            finItem.innerHTML = `<strong>🏁 ¡Ganó ${winnerName} por penales (${matchData.homePenalties}-${matchData.awayPenalties})!</strong>`;
            eventsLog.prepend(finItem);

            await sleep(getTickDelay() * 6);
        }

        await sleep(getTickDelay() * 4);
        resultBanner.classList.remove('hidden');

        // Portadas con estilo de crónica futbolera tradicional
        if (matchData.userWon) {
            if (matchData.isFinalRound) {
                resultBanner.className = 'result-banner champion';
                resultBanner.innerHTML = `
                    <div class="banner-headline">¡VUELTA OLÍMPICA!</div>
                    <div class="banner-sub">CAMPEÓN DE LA COPA ARGENTINA</div>
                    <div class="banner-note">Tu equipo conquistó el título nacional tras derrotar en la Final a ${matchData.opponent.name}.</div>
                `;
                renderGameOverRecap(true, matchData.roundName);
            } else {
                resultBanner.className = 'result-banner win';
                resultBanner.innerHTML = `
                    <div class="banner-headline">¡CLASIFICADO!</div>
                    <div class="banner-sub">PASO A LA SIGUIENTE INSTANCIA</div>
                    <div class="banner-note">Victoria ante ${matchData.opponent.name} en ${matchData.roundName}.</div>
                `;
                postMatchActions.classList.remove('hidden');
            }
        } else {
            resultBanner.className = 'result-banner loss';
            resultBanner.innerHTML = `
                <div class="banner-headline">FIN DEL SUEÑO COPERO</div>
                <div class="banner-sub">ELIMINADO EN ${matchData.roundName.toUpperCase()}</div>
                <div class="banner-note">Caída ante ${matchData.opponent.name}. El torneo concluye aquí.</div>
            `;
            renderGameOverRecap(false, matchData.roundName);
        }

    } catch (err) {
        console.error('Error simulando partido:', err);
    } finally {
        isSimulatingMatch = false;
    }
}

// Renderiza el resumen completo de la partida al terminar
function renderGameOverRecap(isChampion, finalRoundName) {
    const recapBox = document.getElementById('run-recap-content');
    const gameOverPanel = document.getElementById('game-over-panel');

    const statusTitle = isChampion
        ? '★ CAMPAÑA HISTÓRICA: CAMPEÓN DEL TORNEO ★'
        : `★ CERTAMEN FINALIZADO EN ${finalRoundName.toUpperCase()} ★`;

    let rowsHtml = cupRunHistory.map(m => {
        const icon = m.userWon ? '✅' : '❌';
        let scoreDetail = `${m.homeGoals} - ${m.awayGoals}`;
        if (m.wentToPenalties) {
            scoreDetail += ` (${m.homePenalties}-${m.awayPenalties} pen.)`;
        } else if (m.wentToExtraTime) {
            scoreDetail += ` (alargue)`;
        }
        return `
            <div class="recap-match-row">
                <span>${icon} <strong>${m.roundName}</strong> vs ${m.opponentName}</span>
                <span>${scoreDetail}</span>
            </div>
        `;
    }).join('');

    const totalScored = cupRunHistory.reduce((sum, m) => sum + m.homeGoals, 0);
    const totalConceded = cupRunHistory.reduce((sum, m) => sum + m.awayGoals, 0);
    const diff = totalScored - totalConceded;
    const diffSign = diff > 0 ? `+${diff}` : `${diff}`;

    recapBox.innerHTML = `
        <div class="recap-header">${statusTitle}</div>
        <div class="recap-matches">${rowsHtml}</div>
        <div class="recap-stats">
            <span>⚽ Goles convertidos: <strong>${totalScored}</strong></span>
            <span>🛡️ Goles recibidos: <strong>${totalConceded}</strong></span>
            <span>Dif: <strong>${diffSign}</strong></span>
        </div>
        <div class="recap-socials">
            <span>Redes:</span>
            <a href="https://www.instagram.com/santifaccio/" target="_blank" rel="noopener noreferrer" class="social-link ig">📸 @santifaccio</a>
            <span class="sep">&bull;</span>
            <a href="https://x.com/santifaccioo" target="_blank" rel="noopener noreferrer" class="social-link x">✖️ @santifaccioo</a>
        </div>
    `;

    gameOverPanel.classList.remove('hidden');
}

// Copiar al portapapeles o compartir
function shareRunSummary() {
    if (!cupRunHistory.length) return;

    const lastMatch = cupRunHistory[cupRunHistory.length - 1];
    const isChampion = lastMatch.userWon;
    const title = isChampion
        ? '★ ¡CAMPEÓN DE LA CHIQUI CUP! ★'
        : `★ Mi campaña en la ChiquiCup con ${gameState.userTeamName || 'ChiquiTeam'}: Llegué a ${lastMatch.roundName} ★`;

    let matchesText = cupRunHistory.map(m => {
        const icon = m.userWon ? '✅' : '❌';
        let score = `${m.homeGoals}-${m.awayGoals}`;
        if (m.wentToPenalties) score += ` (${m.homePenalties}-${m.awayPenalties} pen.)`;
        return `${icon} ${m.roundName}: ${score} vs ${m.opponentName}`;
    }).join('\n');

    const totalScored = cupRunHistory.reduce((sum, m) => sum + m.homeGoals, 0);
    const totalConceded = cupRunHistory.reduce((sum, m) => sum + m.awayGoals, 0);

    const shareContent = `${title}\nEquipo: ${gameState.userTeamName || 'ChiquiTeam'}\nMedia del Once Titular: ${Math.round(gameState.effectiveTeamRating)}\n\nCamino en la Copa:\n${matchesText}\n\n⚽ Goles a favor: ${totalScored} | 🛡️ Goles recibidos: ${totalConceded}\n\n🏆 Jugá en ChiquiCup\n📸 IG: https://www.instagram.com/santifaccio/\n✖️ X: https://x.com/santifaccioo`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareContent);
    }

    if (navigator.share) {
        try {
            navigator.share({
                title: 'Mi partida en ChiquiCup',
                text: shareContent
            });
        } catch (e) {}
    }

    const toast = document.getElementById('share-toast');
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
