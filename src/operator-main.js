// SIS 2026 Dedicated Operator Deck Console Entry Point
import { store } from './state.js';
import { NavbarComponent } from './components/navbar.js';
import { OperatorComponent } from './components/operator.js';

class OperatorDeckApp {
  constructor() {
    this.init();
  }

  init() {
    // Mount Navbar with operator options
    new NavbarComponent('navbarContainer', { isDedicatedOperator: true });

    // Mount Operator Component
    new OperatorComponent('viewOperator');

    // Ensure store is set to operator view for this window
    store.setActiveView('operator');

    console.log(
      '%c SIS 2026 // OPERATOR DECK ONLINE %c MULTI-WINDOW REAL-TIME SYNC READY ',
      'background: #FFFFFF; color: #000000; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'background: #18181B; color: #34D399; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new OperatorDeckApp();
});
