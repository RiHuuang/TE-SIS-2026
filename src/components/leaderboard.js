// SIS 2026 Squad Standings & Leaderboard Component
import { store } from '../state.js';
import { icons } from '../icons.js';
import { sound } from '../audio.js';
import { warpEngine } from './warp.js';

export class LeaderboardComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => {
      this.render();
      this.highlightLastAction();
    });

    // Listen for remote warp triggers broadcast from other windows
    if (typeof window !== 'undefined') {
      window.addEventListener('sis-remote-warp', (e) => {
        const teamId = e.detail && e.detail.teamId;
        const bonus = (e.detail && e.detail.bonus) || 100;
        const team = teamId ? store.getTeamById(teamId) : store.getTeams()[0];
        if (team) {
          warpEngine.trigger(team, null, bonus);
        }
      });
    }
  }

  highlightLastAction() {
    const action = store.getLastAction();
    if (!action || !action.teamId) return;

    // Highlight row in table or podium card
    const targetRow = this.container.querySelector(`.roster-row[data-team-id="${action.teamId}"]`);
    if (targetRow) {
      targetRow.classList.add('score-bump-highlight');
      setTimeout(() => targetRow.classList.remove('score-bump-highlight'), 1200);
    }

    const podiumSlot = this.container.querySelector(`.podium-card[data-team-id="${action.teamId}"]`);
    if (podiumSlot) {
      podiumSlot.classList.add('score-bump-highlight');
      setTimeout(() => podiumSlot.classList.remove('score-bump-highlight'), 1200);
    }
  }

  render() {
    if (!this.container) return;

    const teams = store.getTeams();
    const top3 = teams.slice(0, 3);

    // Arrange podium order: [Rank 2, Rank 1, Rank 3] for visual balance
    const podiumItems = [
      { rank: 2, team: top3[1], badge: '02', tier: 'silver', label: 'RUNNER UP' },
      { rank: 1, team: top3[0], badge: '01', tier: 'gold', label: 'CHAMPION' },
      { rank: 3, team: top3[2], badge: '03', tier: 'bronze', label: 'THIRD' }
    ];

    this.container.innerHTML = `
      <section class="section-leaderboard fade-in">
        <!-- Eyebrow & Hero Header -->
        <div class="section-header">
          <div class="eyebrow-pill">
            <span class="eyebrow-dot"></span>
            <span>LIVE TELEMETRY // MISSION SQUADS</span>
          </div>
          <h1 class="section-title">SQUAD STANDINGS</h1>
          <p class="section-subtitle">Real-time operational scores, resilience telemetry, and winning leaderboard.</p>
        </div>

        <!-- Top 3 Podium Shelf -->
        <div class="podium-shelf-wrapper doppelrand-shell">
          <div class="podium-shelf-core doppelrand-core">
            <div class="podium-grid">
              ${podiumItems.map(item => this.renderPodiumSlot(item)).join('')}
            </div>
          </div>
        </div>

        <!-- Full Roster Table (All 15 Teams) -->
        <div class="roster-wrapper doppelrand-shell">
          <div class="roster-core doppelrand-core">
            <div class="roster-header-bar">
              <span class="col-rank">RANK</span>
              <span class="col-squad">SQUAD IDENTITY</span>
              <span class="col-status">INFRASTRUCTURE STATUS</span>
              <span class="col-points">SCORE (PTS)</span>
            </div>

            <div class="roster-list">
              ${teams.map((team, idx) => this.renderRosterRow(team, idx + 1)).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Jump Footer & Multi-Window Navigation -->
        <div class="leaderboard-cta-bar">
          <button class="btn-primary-pill" id="btnGoToTerminal">
            <span>CHALLENGE THE CIPHER</span>
            <div class="btn-icon-capsule">${icons.arrowUpRight}</div>
          </button>
          <button class="btn-secondary-pill" id="btnGoToOperator">
            <span>OPERATOR CONTROLS</span>
            <div class="btn-icon-capsule">${icons.operator}</div>
          </button>
          <button class="btn-secondary-pill" id="btnPopoutOperatorLeaderboard" title="Open Operator Input Deck in second window">
            <span>OPEN INPUT PAGE IN NEW CHROME</span>
            <div class="btn-icon-capsule">${icons.arrowUpRight}</div>
          </button>
        </div>
      </section>
    `;

    // Event listeners
    const btnTerm = this.container.querySelector('#btnGoToTerminal');
    if (btnTerm) {
      btnTerm.addEventListener('click', () => {
        sound.playTick();
        store.setActiveView('terminal');
      });
    }

    const btnOp = this.container.querySelector('#btnGoToOperator');
    if (btnOp) {
      btnOp.addEventListener('click', () => {
        sound.playTick();
        store.setActiveView('operator');
      });
    }

    const btnPop = this.container.querySelector('#btnPopoutOperatorLeaderboard');
    if (btnPop) {
      btnPop.addEventListener('click', () => {
        sound.playTick();
        window.open('/operator.html', '_blank', 'width=1400,height=900');
      });
    }
  }

  renderPodiumSlot(item) {
    if (!item.team) {
      return `
        <div class="podium-card vacant tier-${item.tier}">
          <div class="podium-pedestal-rank font-mono">#${item.badge}</div>
          <div class="podium-vacant-text font-mono">AWAITING SQUAD</div>
        </div>
      `;
    }

    const t = item.team;
    const isChamp = item.rank === 1;

    return `
      <div class="podium-card tier-${item.tier} ${isChamp ? 'champion-slot' : ''}" data-team-id="${t.id}">
        <div class="podium-card-glow"></div>
        <div class="podium-badge-shelf">
          <span class="tier-pill font-mono">${item.label}</span>
          ${isChamp ? `<span class="crown-icon-wrap">${icons.crown}</span>` : ''}
        </div>

        <div class="podium-rank-num font-mono">#${item.badge}</div>

        <div class="podium-squad-name" title="${t.name}">
          ${t.name}
        </div>

        <div class="podium-status-row">
          ${t.codeCracked ? `
            <span class="status-pill cracked">
              <span class="dot green"></span> CIPHER OVERRIDDEN (+${t.crackedBonus || 100} PTS)
            </span>
          ` : `
            <span class="status-pill active">
              <span class="dot active"></span> ALWAYS ON
            </span>
          `}
        </div>

        <div class="podium-score-box">
          <span class="score-number font-mono">${t.score.toLocaleString()}</span>
          <span class="score-unit font-mono">PTS</span>
        </div>
      </div>
    `;
  }

  renderRosterRow(team, rank) {
    const isTop3 = rank <= 3;
    const rankStr = rank < 10 ? `0${rank}` : `${rank}`;

    return `
      <div class="roster-row ${isTop3 ? 'top-tier' : ''}" data-team-id="${team.id}">
        <div class="col-rank">
          <span class="rank-badge font-mono">${rankStr}</span>
        </div>

        <div class="col-squad">
          <div class="squad-title-group">
            <span class="squad-color-marker"></span>
            <span class="squad-name">${team.name}</span>
          </div>
        </div>

        <div class="col-status">
          ${team.codeCracked ? `
            <span class="status-pill cracked">
              <span class="status-dot green"></span>
              <span>CIPHER CRACKED (+${team.crackedBonus || 100} PTS)</span>
            </span>
          ` : `
            <span class="status-pill normal">
              <span class="status-dot"></span>
              <span>ONLINE • ALWAYS ON</span>
            </span>
          `}
        </div>

        <div class="col-points">
          <span class="points-val font-mono">${team.score.toLocaleString()}</span>
          <span class="points-label font-mono">PTS</span>
        </div>
      </div>
    `;
  }
}
