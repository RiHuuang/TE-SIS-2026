// SIS 2026 Operator Control Deck Component
import { store } from '../state.js';
import { sound } from '../audio.js';
import { icons } from '../icons.js';
import { warpEngine } from './warp.js';

export class OperatorComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.searchFilter = '';
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => {
      this.updateSquadScoresOnly();
    });
  }

  // Update squad cards without destroying search input focus
  updateSquadScoresOnly() {
    const listContainer = this.container.querySelector('#squadAdjustList');
    const matrixCount = this.container.querySelector('#matrixCountLabel');
    const logsFeed = this.container.querySelector('#auditLogFeed');

    if (!listContainer) {
      this.render();
      return;
    }

    const teams = store.getTeams();
    const filteredTeams = this.filterTeams(teams);

    if (matrixCount) {
      matrixCount.textContent = `${teams.length} SQUADS REGISTERED ${this.searchFilter ? `(${filteredTeams.length} MATCHING)` : ''}`;
    }

    listContainer.innerHTML = filteredTeams.length > 0 
      ? filteredTeams.map((team, idx) => this.renderSquadAdjustCard(team, idx + 1)).join('')
      : `<div class="squad-empty-state">No squads match "${this.escapeHtml(this.searchFilter)}".</div>`;

    if (logsFeed) {
      const logs = store.getLogs();
      logsFeed.innerHTML = logs.slice(0, 8).map(log => `
        <div class="audit-entry">
          <span class="log-time font-mono">${log.time}</span>
          <span class="log-text">${log.text}</span>
        </div>
      `).join('');
    }

    this.bindCardEvents();
  }

  filterTeams(teams) {
    if (!this.searchFilter.trim()) return teams;
    const q = this.searchFilter.trim().toLowerCase();
    return teams.filter(t => t.name.toLowerCase().includes(q));
  }

  escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  render() {
    if (!this.container) return;

    const teams = store.getTeams();
    const filteredTeams = this.filterTeams(teams);
    const logs = store.getLogs();

    this.container.innerHTML = `
      <section class="section-operator fade-in">
        <!-- Header -->
        <div class="section-header">
          <div class="eyebrow-pill">
            <span class="eyebrow-dot active"></span>
            <span>STAGE COMMAND // OPERATOR CONSOLE</span>
          </div>
          <h1 class="section-title">OPERATOR DECK</h1>
          <p class="section-subtitle">Real-time squad scoring, dual-screen synchronization, and live event stage controls.</p>
        </div>

        <!-- Top Tools Row: Add Squad + Event Master Tools -->
        <div class="operator-grid-top">
          <!-- Add Team Card -->
          <div class="operator-tool-card doppelrand-shell">
            <div class="operator-card-core doppelrand-core">
              <div class="tool-card-header">
                <span class="tool-title">COMMISSION NEW SQUAD</span>
                <span class="tool-badge">LIVE SYNC ACTIVE</span>
              </div>
              <form id="formAddNewSquad" class="add-squad-form">
                <div class="input-shell">
                  <input 
                    type="text" 
                    id="inputNewSquadName" 
                    class="cipher-input" 
                    placeholder="ENTER SQUAD NAME (E.G. HARIMAU // 16)" 
                    autocomplete="off"
                    required
                  />
                  <button type="submit" class="btn-primary-pill btn-sm">
                    <span>ADD SQUAD</span>
                    <div class="btn-icon-capsule">${icons.plus}</div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Master Control Card -->
          <div class="operator-tool-card doppelrand-shell">
            <div class="operator-card-core doppelrand-core">
              <div class="tool-card-header">
                <span class="tool-title">EVENT STAGE ACTIONS</span>
                <span class="tool-badge">DUAL-SCREEN CONTROLS</span>
              </div>
              <div class="master-action-buttons">
                <!-- Open Audience Standings in New Window -->
                <button class="btn-primary-pill btn-sm" id="btnOpenAudienceWindow" title="Open audience leaderboard in new Chrome window">
                  <span>OPEN AUDIENCE SCREEN</span>
                  <div class="btn-icon-capsule">${icons.arrowUpRight}</div>
                </button>

                <!-- Trigger remote warp on audience screen -->
                <button class="btn-secondary-pill btn-sm" id="btnTriggerAudienceWarp" title="Broadcast warp victory blast to audience screen">
                  <span>TRIGGER WARP (AUDIENCE)</span>
                  <div class="btn-icon-capsule">${icons.sparkle}</div>
                </button>

                <button class="btn-secondary-pill btn-sm" id="btnResetAllScores" title="Reset all squads to 0 PTS">
                  <span>RESET SCORES TO 0</span>
                  <div class="btn-icon-capsule">${icons.refresh}</div>
                </button>

                <button class="btn-danger-pill btn-sm" id="btnFactoryReset" title="Restore default 15 animal squads with 0 PTS">
                  <span>RESTORE 15 DEFAULTS</span>
                  <div class="btn-icon-capsule">${icons.trash}</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Squad Scoring Matrix Grid -->
        <div class="scoring-matrix-wrapper doppelrand-shell">
          <div class="scoring-matrix-core doppelrand-core">
            <div class="matrix-header">
              <div class="matrix-title-group">
                <h3 class="matrix-title">ACTIVE SQUADS &amp; POINT STEPPERS</h3>
                <span class="matrix-count" id="matrixCountLabel">${teams.length} SQUADS REGISTERED</span>
              </div>

              <!-- Quick Squad Filter Search -->
              <div class="matrix-filter-box">
                <div class="filter-input-shell">
                  <span class="filter-icon-prefix">${icons.search}</span>
                  <input 
                    type="text" 
                    id="inputSquadFilter" 
                    class="matrix-filter-input font-mono" 
                    placeholder="Quick filter squads..." 
                    value="${this.escapeHtml(this.searchFilter)}"
                    autocomplete="off"
                    spellcheck="false"
                  />
                </div>
              </div>
            </div>

            <div class="squad-adjust-list" id="squadAdjustList">
              ${filteredTeams.length > 0 
                ? filteredTeams.map((team, idx) => this.renderSquadAdjustCard(team, idx + 1)).join('')
                : `<div class="squad-empty-state">No squads match "${this.escapeHtml(this.searchFilter)}".</div>`
              }
            </div>
          </div>
        </div>

        <!-- Telemetry Audit Feed -->
        <div class="audit-wrapper doppelrand-shell">
          <div class="audit-core doppelrand-core">
            <div class="audit-header">
              <span class="audit-title">REAL-TIME OPERATOR AUDIT LOG</span>
              <span class="audit-status">MULTI-WINDOW SYNC READY</span>
            </div>
            <div class="audit-log-feed" id="auditLogFeed">
              ${logs.slice(0, 8).map(log => `
                <div class="audit-entry">
                  <span class="log-time font-mono">${log.time}</span>
                  <span class="log-text">${log.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;

    this.bindEvents();
  }

  renderSquadAdjustCard(team, rank) {
    const rankStr = rank < 10 ? `0${rank}` : `${rank}`;

    return `
      <div class="squad-adjust-card" data-team-id="${team.id}">
        <div class="squad-card-meta">
          <span class="squad-rank-tag font-mono">#${rankStr}</span>
          <div class="squad-name-block">
            <span class="squad-name-text">${team.name}</span>
            <span class="squad-status-label ${team.codeCracked ? 'cracked' : ''}">
              ${team.codeCracked ? `CIPHER CRACKED (+${team.crackedBonus || 100} PTS)` : 'ONLINE • READY'}
            </span>
          </div>
          <div class="squad-score-display">
            <span class="score-large font-mono">${team.score.toLocaleString()}</span>
            <span class="score-sub font-mono">PTS</span>
          </div>
        </div>

        <div class="squad-action-deck">
          <!-- 7 Quick Point Addition Steppers: +1, +2, +5, +10, +20, +50, +100 -->
          <div class="stepper-group positive">
            <button class="btn-step btn-step-add btn-step-1" data-id="${team.id}" data-delta="1" title="Add 1 Point">+1</button>
            <button class="btn-step btn-step-add btn-step-2" data-id="${team.id}" data-delta="2" title="Add 2 Points">+2</button>
            <button class="btn-step btn-step-add btn-step-5" data-id="${team.id}" data-delta="5" title="Add 5 Points">+5</button>
            <button class="btn-step btn-step-add btn-step-10" data-id="${team.id}" data-delta="10" title="Add 10 Points">+10</button>
            <button class="btn-step btn-step-add btn-step-20" data-id="${team.id}" data-delta="20" title="Add 20 Points">+20</button>
            <button class="btn-step btn-step-add btn-step-50" data-id="${team.id}" data-delta="50" title="Add 50 Points">+50</button>
            <button class="btn-step btn-step-add btn-step-100 font-bold" data-id="${team.id}" data-delta="100" title="Add 100 Points">+100</button>
          </div>

          <!-- Custom Input & Delete -->
          <div class="custom-score-group">
            <input 
              type="number" 
              class="input-custom-score font-mono" 
              placeholder="PTS" 
              data-id="${team.id}"
              title="Set exact points"
            />
            <button class="btn-step-set" data-id="${team.id}" title="Set exact score">SET</button>
            <button class="btn-delete-squad" data-id="${team.id}" title="Remove squad">
              ${icons.trash}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Add squad form
    const formAdd = this.container.querySelector('#formAddNewSquad');
    if (formAdd) {
      formAdd.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = this.container.querySelector('#inputNewSquadName');
        if (input && input.value.trim()) {
          sound.playSuccessChime();
          store.addTeam(input.value.trim());
          input.value = '';
        }
      });
    }

    // Open Audience Screen in new window
    const btnOpenAudience = this.container.querySelector('#btnOpenAudienceWindow');
    if (btnOpenAudience) {
      btnOpenAudience.addEventListener('click', () => {
        sound.playTick();
        window.open('/?view=leaderboard', '_blank', 'width=1400,height=900');
      });
    }

    // Trigger Audience Warp
    const btnTriggerWarp = this.container.querySelector('#btnTriggerAudienceWarp');
    if (btnTriggerWarp) {
      btnTriggerWarp.addEventListener('click', () => {
        const teams = store.getTeams();
        const topTeam = teams[0];
        if (topTeam) {
          sound.playSuccessChime();
          store.triggerRemoteWarp(topTeam.id);
          warpEngine.trigger(topTeam);
        }
      });
    }

    // Reset scores
    const btnResetScores = this.container.querySelector('#btnResetAllScores');
    if (btnResetScores) {
      btnResetScores.addEventListener('click', () => {
        if (window.confirm('Reset ALL squad scores to 0 PTS? This updates immediately on all connected screens.')) {
          sound.playTick();
          store.resetScores();
        }
      });
    }

    // Factory restore
    const btnRestore = this.container.querySelector('#btnFactoryReset');
    if (btnRestore) {
      btnRestore.addEventListener('click', () => {
        if (window.confirm('Restore default 15 animal squads (all with 0 PTS)?')) {
          sound.playTick();
          store.resetToDefaults();
        }
      });
    }

    // Search filter input
    const filterInput = this.container.querySelector('#inputSquadFilter');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        this.searchFilter = e.target.value;
        this.updateSquadScoresOnly();
      });
    }

    this.bindCardEvents();
  }

  bindCardEvents() {
    // Quick Stepper Buttons (+1, +2, +5, +10, +20, +50, +100)
    const stepBtns = this.container.querySelectorAll('.btn-step');
    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const delta = parseInt(btn.getAttribute('data-delta'), 10);
        if (id && !isNaN(delta)) {
          sound.playTick();
          store.adjustScore(id, delta);
        }
      });
    });

    // Custom Score Set
    const setBtns = this.container.querySelectorAll('.btn-step-set');
    setBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const input = this.container.querySelector(`.input-custom-score[data-id="${id}"]`);
        if (id && input && input.value.trim() !== '') {
          const val = parseInt(input.value.trim(), 10);
          if (!isNaN(val)) {
            sound.playTick();
            store.setScore(id, val);
            input.value = '';
          }
        }
      });
    });

    // Delete squad
    const delBtns = this.container.querySelectorAll('.btn-delete-squad');
    delBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const team = store.getTeamById(id);
        if (team && window.confirm(`Remove squad "${team.name}" from event?`)) {
          sound.playTick();
          store.removeTeam(id);
        }
      });
    });
  }
}
