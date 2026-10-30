// SIS 2026 "Crack The Code" Cryptographic Terminal Component
import { store } from '../state.js';
import { sound } from '../audio.js';
import { icons } from '../icons.js';
import { warpEngine } from './warp.js';

export class TerminalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.TARGET_PHRASE = 'SYSTEM INFRASTRUCTURE BCA ALWAYS ON';
    this.isAuthenticating = false;
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => {
      this.updateTeamSelector();
    });
  }

  normalizeCode(input) {
    if (!input) return '';
    return input
      .trim()
      .toUpperCase()
      .replace(/\/+$/, '') // strip trailing slashes if present
      .replace(/\s+/g, ' ') // collapse multi-spaces
      .trim();
  }

  render() {
    if (!this.container) return;

    const teams = store.getTeams();
    const currentBonus = store.getNextCipherBonus();

    this.container.innerHTML = `
      <section class="section-terminal fade-in">
        <!-- Terminal Header -->
        <div class="section-header">
          <div class="eyebrow-pill">
            <span class="eyebrow-dot"></span>
            <span>CRACK THE CODE // SECURITY OVERRIDE</span>
          </div>
          <h1 class="section-title">CIPHER TERMINAL</h1>
          <p class="section-subtitle">Input secret mission code to execute override and claim <strong id="terminalSubtitleBounty">+${currentBonus} PTS</strong> (decays by -5 per success, min 50 PTS).</p>
        </div>

        <!-- Doppelrand Terminal Enclosure -->
        <div class="terminal-shell doppelrand-shell">
          <div class="terminal-core doppelrand-core">
            <!-- Terminal Chrome Bar -->
            <div class="terminal-chrome">
              <div class="chrome-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="chrome-title">
                <span>SYS://OVERRIDE-CONSOLE/V2.4</span>
              </div>
              <div class="chrome-status">
                <span class="status-indicator"></span>
                <span>ONLINE • BCA ALWAYS ON</span>
              </div>
            </div>

            <!-- Terminal Body -->
            <div class="terminal-body">
              <!-- Operative Squad Selector -->
              <div class="form-group">
                <label class="input-label" for="selectOperativeTeam">SELECT OPERATIVE SQUAD</label>
                <div class="select-wrapper">
                  <select id="selectOperativeTeam" class="custom-select">
                    ${teams.map(t => `
                      <option value="${t.id}">
                        ${t.name} — ${t.score.toLocaleString()} PTS ${t.codeCracked ? '(OVERRIDDEN)' : ''}
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <!-- Passphrase Input (Masked as Password) -->
              <div class="form-group">
                <div class="label-row">
                  <label class="input-label" for="inputCipherPhrase">DECRYPTION PASSPHRASE</label>
                  <span class="cipher-secure-badge font-mono">
                    ${icons.lock}
                    <span>MASKED INPUT</span>
                  </span>
                </div>
                
                <div class="input-shell password-shell">
                  <span class="input-prompt">&gt;</span>
                  <input 
                    type="password" 
                    id="inputCipherPhrase" 
                    class="cipher-input font-mono" 
                    placeholder="ENTER SECRET CODE SEQUENCE..." 
                    autocomplete="off" 
                    spellcheck="false"
                  />
                  <button type="button" class="btn-toggle-mask" id="btnToggleMask" title="Show password" aria-label="Toggle password visibility">
                    <span id="maskIcon" class="mask-icon-wrap">${icons.eye}</span>
                  </button>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="terminal-action-row">
                <button class="btn-primary-pill btn-decrypt" id="btnExecuteDecrypt">
                  <span class="btn-text" id="decryptBtnText">DECRYPT &amp; OVERRIDE</span>
                  <div class="btn-icon-capsule">
                    ${icons.arrowRight}
                  </div>
                </button>

                <div class="terminal-message" id="terminalFeedbackMsg"></div>
              </div>

              <!-- Live Cryptographic Telemetry Box -->
              <div class="telemetry-terminal-box">
                <div class="telemetry-row">
                  <span class="telemetry-label">SECURITY PROTOCOL:</span>
                  <span class="telemetry-val">SHA-256 ZERO-KNOWLEDGE MESH</span>
                </div>
                <div class="telemetry-row">
                  <span class="telemetry-label">CURRENT BOUNTY:</span>
                  <span class="telemetry-val font-mono" id="terminalBountyVal">+${currentBonus} BONUS PTS</span>
                </div>
                <div class="telemetry-row">
                  <span class="telemetry-label">DECAY PROTOCOL:</span>
                  <span class="telemetry-val font-mono">-5 PTS PER SUCCESS (MIN 50 PTS)</span>
                </div>
                <div class="telemetry-row">
                  <span class="telemetry-label">SYSTEM AVAILABILITY:</span>
                  <span class="telemetry-val font-mono">99.999% HIGH AVAILABILITY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Event Bindings
    const inputEl = this.container.querySelector('#inputCipherPhrase');
    const selectEl = this.container.querySelector('#selectOperativeTeam');
    const decryptBtn = this.container.querySelector('#btnExecuteDecrypt');
    const toggleMaskBtn = this.container.querySelector('#btnToggleMask');
    const maskIcon = this.container.querySelector('#maskIcon');

    if (inputEl) {
      inputEl.addEventListener('input', () => {
        sound.playKeypress();
        this.clearFeedback();
      });

      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleDecryption();
        }
      });
    }

    if (toggleMaskBtn && inputEl) {
      toggleMaskBtn.addEventListener('click', () => {
        const isPassword = inputEl.type === 'password';
        inputEl.type = isPassword ? 'text' : 'password';
        if (maskIcon) {
          maskIcon.innerHTML = isPassword ? icons.eyeOff : icons.eye;
        }
        toggleMaskBtn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
        inputEl.focus();
      });
    }

    if (decryptBtn) {
      decryptBtn.addEventListener('click', () => {
        this.handleDecryption();
      });
    }
  }

  updateTeamSelector() {
    const selectEl = document.getElementById('selectOperativeTeam');
    if (selectEl) {
      const currentVal = selectEl.value;
      const teams = store.getTeams();

      selectEl.innerHTML = teams.map(t => `
        <option value="${t.id}" ${t.id === currentVal ? 'selected' : ''}>
          ${t.name} — ${t.score.toLocaleString()} PTS ${t.codeCracked ? `(OVERRIDDEN +${t.crackedBonus || 100} PTS)` : ''}
        </option>
      `).join('');
    }

    const currentBonus = store.getNextCipherBonus();
    const bountyValEl = document.getElementById('terminalBountyVal');
    if (bountyValEl) bountyValEl.textContent = `+${currentBonus} BONUS PTS`;

    const subBountyEl = document.getElementById('terminalSubtitleBounty');
    if (subBountyEl) subBountyEl.textContent = `+${currentBonus} PTS`;
  }

  setFeedback(text, type = 'info') {
    const msgEl = document.getElementById('terminalFeedbackMsg');
    if (!msgEl) return;
    msgEl.className = `terminal-message msg-${type}`;
    msgEl.innerHTML = text;
  }

  clearFeedback() {
    const msgEl = document.getElementById('terminalFeedbackMsg');
    if (!msgEl) return;
    msgEl.innerHTML = '';
  }

  handleDecryption() {
    if (this.isAuthenticating) return;
    sound.ensureContext();

    const selectEl = document.getElementById('selectOperativeTeam');
    const inputEl = document.getElementById('inputCipherPhrase');
    const btnTextEl = document.getElementById('decryptBtnText');

    if (!selectEl || !inputEl) return;

    const teamId = selectEl.value;
    const team = store.getTeamById(teamId);
    const entered = this.normalizeCode(inputEl.value);

    if (!team) {
      this.setFeedback('Please select a valid operative squad.', 'error');
      return;
    }

    if (!entered) {
      this.setFeedback('Console empty. Please enter cipher passphrase.', 'warning');
      inputEl.focus();
      return;
    }

    if (team.codeCracked) {
      this.setFeedback(`${team.name} has already cracked this cipher. Select another squad.`, 'warning');
      return;
    }

    // Begin authentication animation sequence
    this.isAuthenticating = true;
    sound.playTick();
    if (btnTextEl) btnTextEl.textContent = '[AUTHENTICATING MESH...]';

    // Simulate cryptographic verification delay (700ms)
    setTimeout(() => {
      this.isAuthenticating = false;
      if (btnTextEl) btnTextEl.textContent = 'DECRYPT & OVERRIDE';

      const isMatch = (entered === this.TARGET_PHRASE);

      if (isMatch) {
        // SUCCESS! Award dynamic decaying bonus (100, 95, 90... min 50)
        const awardedBonus = store.crackCode(team.id);
        store.triggerRemoteWarp(team.id, awardedBonus);
        
        const nextBonus = store.getNextCipherBonus();
        this.setFeedback('SUCCESS', 'success');
        inputEl.value = '';

        // Trigger the spectacular motion graphics warp celebration with awarded bonus
        warpEngine.trigger(team, () => {
          store.setActiveView('leaderboard');
        }, awardedBonus);
      } else {
        // Failed attempt
        sound.playTick();
        this.setFeedback(`ACCESS DENIED: Passcode hash mismatch. Verify sequence and retry.`, 'error');
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 500);
      }
    }, 700);
  }
}
