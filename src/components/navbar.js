// Floating Island Detached Navigation Bar
import { store } from '../state.js';
import { sound } from '../audio.js';
import { icons } from '../icons.js';

export class NavbarComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options; // e.g. { isDedicatedOperator: true }
    this.clockInterval = null;
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => {
      this.updateActiveTab();
      this.updateSoundBtn();
    });
    this.startClock();
  }

  startClock() {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const clockEl = document.getElementById('navLiveClock');
    if (!clockEl) return;
    const now = new Date();
    // UTC+7 (Jakarta / WIB)
    const options = { timeZone: 'Asia/Jakarta', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeStr = now.toLocaleTimeString('en-GB', options);
    clockEl.textContent = `${timeStr} WIB`;
  }

  render() {
    if (!this.container) return;

    const isDedicatedOp = this.options.isDedicatedOperator;

    this.container.innerHTML = `
      <header class="island-nav-wrapper">
        <div class="island-nav-shell">
          <!-- Brand Anchor -->
          <div class="nav-brand-group" id="navBrandBtn" title="SIS 2026 Engagement Portal">
            <div class="brand-monogram">
              <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
                <path d="M9 11C9 8.24 11.24 6 14 6H18C20.76 6 23 8.24 23 11C23 13.76 20.76 16 18 16H14C11.24 16 9 18.24 9 21C9 23.76 11.24 26 14 26H18C20.76 26 23 23.76 23 21" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="16" y1="26" x2="16" y2="30" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-title">SIS 2026</span>
              <span class="brand-tagline">STAND IN, STAND TOGETHER</span>
            </div>
          </div>

          <!-- View Tabs Switcher (3 views) -->
          <nav class="nav-tabs">
            <button class="nav-tab-btn active" data-view="leaderboard" id="tabNavLeaderboard">
              <span class="tab-index">01</span>
              <span class="tab-label">STANDINGS</span>
            </button>
            <button class="nav-tab-btn" data-view="terminal" id="tabNavTerminal">
              <span class="tab-index">02</span>
              <span class="tab-label">CIPHER TERMINAL</span>
            </button>
            <button class="nav-tab-btn" data-view="operator" id="tabNavOperator">
              <span class="tab-index">03</span>
              <span class="tab-label">OPERATOR DECK</span>
            </button>
          </nav>

          <!-- Status & Utility Capsule -->
          <div class="nav-telemetry">
            <!-- Multi-Window Dual-Screen Launcher -->
            <button class="btn-multiwindow-launch" id="btnLaunchDualScreen" title="${isDedicatedOp ? 'Open Audience Standings Display in New Window' : 'Open Operator Input Deck in New Window'}">
              <span class="icon-dual-screen">
                ${isDedicatedOp ? `${icons.display}<span>AUDIENCE</span>` : `${icons.operator}<span>OPERATOR</span>`}
              </span>
              <span class="popout-arrow">${icons.arrowUpRight}</span>
            </button>

            <div class="telemetry-pill">
              <span class="telemetry-indicator live" title="Live Sync Active Across Tabs"></span>
              <span class="telemetry-clock" id="navLiveClock">00:00:00 WIB</span>
            </div>

            <!-- Sound Toggle -->
            <button class="btn-sound-toggle" id="btnSoundToggle" title="Toggle Synthesizer Audio">
              <span class="icon-wrap" id="soundIconWrap">${store.isSoundEnabled() ? icons.volumeOn : icons.volumeMute}</span>
            </button>
          </div>
        </div>
      </header>
    `;

    // Event Bindings
    const brandBtn = this.container.querySelector('#navBrandBtn');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => {
        sound.playTick();
        if (isDedicatedOp) {
          window.location.href = '/?view=leaderboard';
        } else {
          store.setActiveView('leaderboard');
        }
      });
    }

    const tabBtns = this.container.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playTick();
        const view = btn.getAttribute('data-view');
        if (view) {
          if (isDedicatedOp && view !== 'operator') {
            window.location.href = `/?view=${view}`;
          } else {
            store.setActiveView(view);
          }
        }
      });
    });

    const dualScreenBtn = this.container.querySelector('#btnLaunchDualScreen');
    if (dualScreenBtn) {
      dualScreenBtn.addEventListener('click', () => {
        sound.playTick();
        if (isDedicatedOp) {
          window.open('/?view=leaderboard', '_blank', 'width=1400,height=900');
        } else {
          window.open('/operator.html', '_blank', 'width=1400,height=900');
        }
      });
    }

    const soundBtn = this.container.querySelector('#btnSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const nextState = !store.isSoundEnabled();
        store.setSoundEnabled(nextState);
        if (nextState) sound.playTick();
      });
    }

    this.updateActiveTab();
    this.updateSoundBtn();
  }

  updateActiveTab() {
    const currentView = store.getActiveView();
    const tabBtns = this.container.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-view') === currentView) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateSoundBtn() {
    const iconWrap = document.getElementById('soundIconWrap');
    if (!iconWrap) return;
    iconWrap.innerHTML = store.isSoundEnabled() ? icons.volumeOn : icons.volumeMute;
    const btn = document.getElementById('btnSoundToggle');
    if (btn) {
      btn.classList.toggle('muted', !store.isSoundEnabled());
    }
  }
}
