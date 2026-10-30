// SIS 2026 Hyper-Warp Motion Graphics Victory Sequence
import confetti from 'canvas-confetti';
import { sound } from '../audio.js';
import { store } from '../state.js';

export class WarpCelebrationEngine {
  constructor() {
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.stars = [];
    this.starCount = 450;
    this.speed = 1;
    this.maxSpeed = 48;
    this.warpPhase = 'idle'; // idle | accelerating | cruising | decel
    this.isActive = false;
    this.onCompleteCallback = null;

    this.createDom();
  }

  createDom() {
    const existing = document.getElementById('warpOverlay');
    if (existing) existing.remove();

    this.overlay = document.createElement('div');
    this.overlay.id = 'warpOverlay';
    this.overlay.className = 'warp-overlay hidden';
    this.overlay.innerHTML = `
      <canvas id="warpCanvas"></canvas>
      <div class="warp-hud">
        <div class="warp-telemetry-badge">
          <span class="telemetry-dot pulse"></span>
          <span>HYPER-WARP RESILIENCE VECTOR // 99.999%</span>
        </div>
        
        <div class="warp-hero-title">
          <h1 class="warp-main-text"><span class="warp-highlight">SUCCESS</span></h1>
        </div>

        <div class="warp-squad-badge" id="warpSquadBadge">
          <span class="badge-label">SQUAD CLEARED</span>
          <span class="badge-squad-name" id="warpSquadName">CORE ENGINE</span>
        </div>

        <div class="warp-odometer-container">
          <div class="odometer-label">OVERRIDE REWARD ALLOCATED</div>
          <div class="odometer-value" id="warpOdometer">+0 PTS</div>
        </div>

        <div class="warp-actions">
          <button class="btn-warp-close" id="btnWarpClose">
            <span>RETURN TO STANDINGS</span>
            <div class="btn-icon-capsule">→</div>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.canvas = this.overlay.querySelector('#warpCanvas');
    this.ctx = this.canvas.getContext('2d');

    const btnClose = this.overlay.querySelector('#btnWarpClose');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        sound.playTick();
        this.stop();
        if (this.onCompleteCallback) this.onCompleteCallback();
      });
    }

    window.addEventListener('resize', () => {
      if (this.isActive) this.resize();
    });
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * this.width * 2,
        y: (Math.random() - 0.5) * this.height * 2,
        z: Math.random() * this.width,
        prevZ: 0,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.8 ? '#E4E4E7' : '#FFFFFF'
      });
    }
  }

  trigger(team, onComplete, bonus = 100) {
    this.isActive = true;
    this.onCompleteCallback = onComplete;
    this.resize();
    this.initStars();
    this.speed = 1;
    this.warpPhase = 'accelerating';

    const squadNameEl = document.getElementById('warpSquadName');
    if (squadNameEl) squadNameEl.textContent = team ? team.name : 'AUTHENTICATED SQUAD';

    const odometerEl = document.getElementById('warpOdometer');
    if (odometerEl) odometerEl.textContent = '+0 PTS';

    this.overlay.classList.remove('hidden');
    this.overlay.classList.add('active');

    // Trigger procedural audio warp sonic blast
    sound.playWarpBlast();

    // Start canvas animation loop
    const startTime = performance.now();
    this.renderLoop(startTime);

    // Roll odometer
    this.animateOdometer(bonus, 2200);

    // Stage 1 Confetti burst at peak warp (1.2s)
    setTimeout(() => {
      this.fireMonochromeConfetti();
    }, 1200);

    // Stage 2 Confetti burst (2.4s)
    setTimeout(() => {
      this.fireMonochromeConfetti();
    }, 2400);
  }

  animateOdometer(target, duration) {
    const el = document.getElementById('warpOdometer');
    if (!el) return;
    const startVal = 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * ease);
      el.textContent = `+${current.toLocaleString()} PTS`;

      if (progress < 1 && this.isActive) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `+${target.toLocaleString()} PTS`;
        sound.playSuccessChime();
      }
    };

    requestAnimationFrame(update);
  }

  fireMonochromeConfetti() {
    try {
      const count = 90;
      const defaults = {
        origin: { y: 0.65 },
        colors: ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A', '#E4E4E7']
      };

      confetti({
        ...defaults,
        particleCount: count,
        spread: 100,
        startVelocity: 55,
        shapes: ['square', 'circle'],
        scalar: 1.2
      });

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.5),
        angle: 60,
        spread: 75,
        origin: { x: 0.1, y: 0.7 }
      });

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.5),
        angle: 120,
        spread: 75,
        origin: { x: 0.9, y: 0.7 }
      });
    } catch (e) {}
  }

  renderLoop(timestamp) {
    if (!this.isActive) return;

    if (this.speed < this.maxSpeed) {
      this.speed += 0.7;
    }

    // Motion graphics trail effect with translucent clear
    this.ctx.fillStyle = 'rgba(8, 8, 8, 0.28)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Center hyper-drive tunnel rings
    this.drawTunnelRings(timestamp);

    // 3D Starfield warp streaks
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.prevZ = s.z;
      s.z -= this.speed;

      if (s.z <= 0) {
        s.z = this.width;
        s.prevZ = s.z;
        s.x = (Math.random() - 0.5) * this.width * 2;
        s.y = (Math.random() - 0.5) * this.height * 2;
      }

      const k = 280 / s.z;
      const px = s.x * k + this.centerX;
      const py = s.y * k + this.centerY;

      const prevK = 280 / s.prevZ;
      const prevX = s.x * prevK + this.centerX;
      const prevY = s.y * prevK + this.centerY;

      if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
        this.ctx.beginPath();
        this.ctx.moveTo(prevX, prevY);
        this.ctx.lineTo(px, py);

        // Alpha increases as stars speed past
        const alpha = Math.min(1, (1 - s.z / this.width) * (this.speed / 15));
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        this.ctx.lineWidth = Math.min(4, s.size * (1 - s.z / this.width) * (this.speed / 8));
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
      }
    }

    this.animId = requestAnimationFrame((t) => this.renderLoop(t));
  }

  drawTunnelRings(timestamp) {
    const ringCount = 5;
    const timeSec = timestamp * 0.001;

    for (let r = 1; r <= ringCount; r++) {
      const radius = ((timestamp * 0.25 * r) % (this.width * 0.5));
      const alpha = Math.max(0, 1 - radius / (this.width * 0.45)) * 0.18;

      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([8, 12]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Central target reticle
    const reticleRadius = 45;
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(timeSec * 0.8);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(-reticleRadius, -reticleRadius, reticleRadius * 2, reticleRadius * 2);
    this.ctx.restore();
  }

  stop() {
    this.isActive = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.overlay) {
      this.overlay.classList.remove('active');
      this.overlay.classList.add('hidden');
    }
  }
}

export const warpEngine = new WarpCelebrationEngine();
