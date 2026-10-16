// SIS 2026 Engagement Portal Entry Point
import { store } from './state.js';
import { NavbarComponent } from './components/navbar.js';
import { LeaderboardComponent } from './components/leaderboard.js';
import { TerminalComponent } from './components/terminal.js';
import { OperatorComponent } from './components/operator.js';

class Application {
  constructor() {
    this.views = {
      leaderboard: document.getElementById('viewLeaderboard'),
      terminal: document.getElementById('viewTerminal'),
      operator: document.getElementById('viewOperator')
    };

    this.init();
  }

  init() {
    // Mount Components
    new NavbarComponent('navbarContainer');
    new LeaderboardComponent('viewLeaderboard');
    new TerminalComponent('viewTerminal');
    new OperatorComponent('viewOperator');

    // Subscribe to view changes
    store.subscribe((s) => {
      this.switchView(s.getActiveView());
    });

    // Set initial view from store (which resolves URL query/hash)
    this.switchView(store.getActiveView());

    // Setup keyboard shortcuts: 1, 2, 3 to switch views
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === '1') store.setActiveView('leaderboard');
      if (e.key === '2') store.setActiveView('terminal');
      if (e.key === '3') store.setActiveView('operator');
    });

    console.log(
      '%c SIS 2026 // STAND IN, STAND TOGETHER %c BCA SYSTEM INFRASTRUCTURE ',
      'background: #FFFFFF; color: #000000; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'background: #18181B; color: #E4E4E7; font-weight: normal; padding: 4px 8px; border-radius: 4px;'
    );
  }

  switchView(activeKey) {
    Object.keys(this.views).forEach(key => {
      const el = this.views[key];
      if (!el) return;
      if (key === activeKey) {
        el.classList.add('active');
        el.classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        el.classList.remove('active');
        el.classList.remove('fade-in');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Application();
});
