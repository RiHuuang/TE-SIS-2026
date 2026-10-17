// SIS 2026 Visual Identity & Brandkit Showcase Component
import { icons } from '../icons.js';
import { sound } from '../audio.js';

export class BrandkitComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <section class="section-brandkit fade-in">
        <!-- Header -->
        <div class="section-header">
          <div class="eyebrow-pill">
            <span class="eyebrow-dot"></span>
            <span>VISUAL SYSTEM // BRAND ARCHITECTURE</span>
          </div>
          <h1 class="section-title">SIS IDENTITY DECK</h1>
          <p class="section-subtitle">Official brand guidelines, monolithic design system, and luxury monochrome tokens.</p>
        </div>

        <!-- Hero Identity Banner Card -->
        <div class="brand-hero-card doppelrand-shell">
          <div class="brand-hero-core doppelrand-core">
            <div class="brand-hero-content">
              <div class="brand-big-monogram">
                <span class="huge-brand-title">SIS</span>
              </div>
              <div class="brand-essence-column">
                <span class="brand-tagline-statement">STAND IN, STAND TOGETHER</span>
                <span class="brand-mandate">SYSTEM INFRASTRUCTURE BCA // ALWAYS ON</span>
                <p class="brand-desc">
                  An architectural identity system engineered for resilience, monolithic stability, and continuous operational readiness.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 3x3 Brandkit Presentation Board -->
        <div class="brand-board-wrapper doppelrand-shell">
          <div class="brand-board-core doppelrand-core">
            <div class="board-header">
              <div class="board-meta">
                <span class="board-label">PRIMARY ARTIFACT // 3×3 IDENTITY SYSTEM</span>
                <span class="board-status font-mono">SPEC: BRANDKIT-V2 // AWWWARDS SPEC</span>
              </div>
              <a href="./brandkit-board.jpg" target="_blank" class="btn-text-link" id="btnOpenFullBrandkit">
                <span>VIEW HIGH-RES IMAGE</span>
                <div class="btn-icon-capsule">${icons.arrowUpRight}</div>
              </a>
            </div>

            <div class="brand-image-frame">
              <img 
                src="./brandkit-board.jpg" 
                alt="SIS Stand In, Stand together - 3x3 Brandkit Presentation Board" 
                class="brand-board-img"
                loading="lazy"
              />
              <div class="image-corner-brackets">
                <span class="bracket top-left"></span>
                <span class="bracket top-right"></span>
                <span class="bracket bottom-left"></span>
                <span class="bracket bottom-right"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Material Tokens Bento Grid -->
        <div class="tokens-bento-grid">
          <div class="token-card doppelrand-shell">
            <div class="token-core doppelrand-core">
              <div class="token-swatch bg-obsidian"></div>
              <div class="token-meta">
                <span class="token-name">OBSIDIAN // 01</span>
                <span class="token-hex font-mono">#080808</span>
                <span class="token-role">Deep Foundation Void</span>
              </div>
            </div>
          </div>

          <div class="token-card doppelrand-shell">
            <div class="token-core doppelrand-core">
              <div class="token-swatch bg-graphite"></div>
              <div class="token-meta">
                <span class="token-name">BRUSHED GRAPHITE // 02</span>
                <span class="token-hex font-mono">#18181B</span>
                <span class="token-role">Machined Hardware Bezel</span>
              </div>
            </div>
          </div>

          <div class="token-card doppelrand-shell">
            <div class="token-core doppelrand-core">
              <div class="token-swatch bg-titanium"></div>
              <div class="token-meta">
                <span class="token-name">TITANIUM MESH // 03</span>
                <span class="token-hex font-mono">#71717A</span>
                <span class="token-role">Telemetry &amp; Line Geometry</span>
              </div>
            </div>
          </div>

          <div class="token-card doppelrand-shell">
            <div class="token-core doppelrand-core">
              <div class="token-swatch bg-alabaster"></div>
              <div class="token-meta">
                <span class="token-name">PURE ALABASTER // 04</span>
                <span class="token-hex font-mono">#F4F4F6</span>
                <span class="token-role">High-Contrast Typographic Core</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    const openLink = this.container.querySelector('#btnOpenFullBrandkit');
    if (openLink) {
      openLink.addEventListener('click', () => {
        sound.playTick();
      });
    }
  }
}
