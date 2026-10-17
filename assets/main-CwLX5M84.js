import{s as n,w as m,i as c,a as l,N as v,O as h}from"./operator-DAajKazQ.js";class E{constructor(e){this.container=document.getElementById(e),this.init()}init(){this.render(),n.subscribe(()=>{this.render(),this.highlightLastAction()}),typeof window<"u"&&window.addEventListener("sis-remote-warp",e=>{const s=e.detail&&e.detail.teamId,t=e.detail&&e.detail.bonus||100,i=s?n.getTeamById(s):n.getTeams()[0];i&&m.trigger(i,null,t)})}highlightLastAction(){const e=n.getLastAction();if(!e||!e.teamId)return;const s=this.container.querySelector(`.roster-row[data-team-id="${e.teamId}"]`);s&&(s.classList.add("score-bump-highlight"),setTimeout(()=>s.classList.remove("score-bump-highlight"),1200));const t=this.container.querySelector(`.podium-card[data-team-id="${e.teamId}"]`);t&&(t.classList.add("score-bump-highlight"),setTimeout(()=>t.classList.remove("score-bump-highlight"),1200))}render(){if(!this.container)return;const e=n.getTeams(),s=e.slice(0,3),t=[{rank:2,team:s[1],badge:"02",tier:"silver",label:"RUNNER UP"},{rank:1,team:s[0],badge:"01",tier:"gold",label:"CHAMPION"},{rank:3,team:s[2],badge:"03",tier:"bronze",label:"THIRD"}];this.container.innerHTML=`
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
              ${t.map(a=>this.renderPodiumSlot(a)).join("")}
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
              ${e.map((a,d)=>this.renderRosterRow(a,d+1)).join("")}
            </div>
          </div>
        </div>

        <!-- Quick Jump Footer & Multi-Window Navigation -->
        <div class="leaderboard-cta-bar">
          <button class="btn-primary-pill" id="btnGoToTerminal">
            <span>CHALLENGE THE CIPHER</span>
            <div class="btn-icon-capsule">${c.arrowUpRight}</div>
          </button>
          <button class="btn-secondary-pill" id="btnGoToOperator">
            <span>OPERATOR CONTROLS</span>
            <div class="btn-icon-capsule">${c.operator}</div>
          </button>
          <button class="btn-secondary-pill" id="btnPopoutOperatorLeaderboard" title="Open Operator Input Deck in second window">
            <span>OPEN INPUT PAGE IN NEW CHROME</span>
            <div class="btn-icon-capsule">${c.arrowUpRight}</div>
          </button>
        </div>
      </section>
    `;const i=this.container.querySelector("#btnGoToTerminal");i&&i.addEventListener("click",()=>{l.playTick(),n.setActiveView("terminal")});const o=this.container.querySelector("#btnGoToOperator");o&&o.addEventListener("click",()=>{l.playTick(),n.setActiveView("operator")});const r=this.container.querySelector("#btnPopoutOperatorLeaderboard");r&&r.addEventListener("click",()=>{l.playTick(),window.open("./operator.html","_blank","width=1400,height=900")})}renderPodiumSlot(e){if(!e.team)return`
        <div class="podium-card vacant tier-${e.tier}">
          <div class="podium-pedestal-rank font-mono">#${e.badge}</div>
          <div class="podium-vacant-text font-mono">AWAITING SQUAD</div>
        </div>
      `;const s=e.team,t=e.rank===1;return`
      <div class="podium-card tier-${e.tier} ${t?"champion-slot":""}" data-team-id="${s.id}">
        <div class="podium-card-glow"></div>
        <div class="podium-badge-shelf">
          <span class="tier-pill font-mono">${e.label}</span>
          ${t?`<span class="crown-icon-wrap">${c.crown}</span>`:""}
        </div>

        <div class="podium-rank-num font-mono">#${e.badge}</div>

        <div class="podium-squad-name" title="${s.name}">
          ${s.name}
        </div>

        <div class="podium-status-row">
          ${s.codeCracked?`
            <span class="status-pill cracked">
              <span class="dot green"></span> CIPHER OVERRIDDEN (+${s.crackedBonus||100} PTS)
            </span>
          `:`
            <span class="status-pill active">
              <span class="dot active"></span> ALWAYS ON
            </span>
          `}
        </div>

        <div class="podium-score-box">
          <span class="score-number font-mono">${s.score.toLocaleString()}</span>
          <span class="score-unit font-mono">PTS</span>
        </div>
      </div>
    `}renderRosterRow(e,s){const t=s<=3,i=s<10?`0${s}`:`${s}`;return`
      <div class="roster-row ${t?"top-tier":""}" data-team-id="${e.id}">
        <div class="col-rank">
          <span class="rank-badge font-mono">${i}</span>
        </div>

        <div class="col-squad">
          <div class="squad-title-group">
            <span class="squad-color-marker"></span>
            <span class="squad-name">${e.name}</span>
          </div>
        </div>

        <div class="col-status">
          ${e.codeCracked?`
            <span class="status-pill cracked">
              <span class="status-dot green"></span>
              <span>CIPHER CRACKED (+${e.crackedBonus||100} PTS)</span>
            </span>
          `:`
            <span class="status-pill normal">
              <span class="status-dot"></span>
              <span>ONLINE • ALWAYS ON</span>
            </span>
          `}
        </div>

        <div class="col-points">
          <span class="points-val font-mono">${e.score.toLocaleString()}</span>
          <span class="points-label font-mono">PTS</span>
        </div>
      </div>
    `}}class T{constructor(e){this.container=document.getElementById(e),this.TARGET_PHRASE="SYSTEM INFRASTRUCTURE BCA ALWAYS ON",this.isAuthenticating=!1,this.init()}init(){this.render(),n.subscribe(()=>{this.updateTeamSelector()})}normalizeCode(e){return e?e.trim().toUpperCase().replace(/\/+$/,"").replace(/\s+/g," ").trim():""}render(){if(!this.container)return;const e=n.getTeams(),s=n.getNextCipherBonus();this.container.innerHTML=`
      <section class="section-terminal fade-in">
        <!-- Terminal Header -->
        <div class="section-header">
          <div class="eyebrow-pill">
            <span class="eyebrow-dot"></span>
            <span>CRACK THE CODE // SECURITY OVERRIDE</span>
          </div>
          <h1 class="section-title">CIPHER TERMINAL</h1>
          <p class="section-subtitle">Input secret mission code to execute override and claim <strong id="terminalSubtitleBounty">+${s} PTS</strong> (decays by -5 per success, min 50 PTS).</p>
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
                    ${e.map(a=>`
                      <option value="${a.id}">
                        ${a.name} — ${a.score.toLocaleString()} PTS ${a.codeCracked?"(OVERRIDDEN)":""}
                      </option>
                    `).join("")}
                  </select>
                </div>
              </div>

              <!-- Passphrase Input (Masked as Password) -->
              <div class="form-group">
                <div class="label-row">
                  <label class="input-label" for="inputCipherPhrase">DECRYPTION PASSPHRASE</label>
                  <span class="cipher-secure-badge font-mono">
                    ${c.lock}
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
                    <span id="maskIcon" class="mask-icon-wrap">${c.eye}</span>
                  </button>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="terminal-action-row">
                <button class="btn-primary-pill btn-decrypt" id="btnExecuteDecrypt">
                  <span class="btn-text" id="decryptBtnText">DECRYPT &amp; OVERRIDE</span>
                  <div class="btn-icon-capsule">
                    ${c.arrowRight}
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
                  <span class="telemetry-val font-mono" id="terminalBountyVal">+${s} BONUS PTS</span>
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
    `;const t=this.container.querySelector("#inputCipherPhrase");this.container.querySelector("#selectOperativeTeam");const i=this.container.querySelector("#btnExecuteDecrypt"),o=this.container.querySelector("#btnToggleMask"),r=this.container.querySelector("#maskIcon");t&&(t.addEventListener("input",()=>{l.playKeypress(),this.clearFeedback()}),t.addEventListener("keydown",a=>{a.key==="Enter"&&this.handleDecryption()})),o&&t&&o.addEventListener("click",()=>{const a=t.type==="password";t.type=a?"text":"password",r&&(r.innerHTML=a?c.eyeOff:c.eye),o.setAttribute("title",a?"Hide password":"Show password"),t.focus()}),i&&i.addEventListener("click",()=>{this.handleDecryption()})}updateTeamSelector(){const e=document.getElementById("selectOperativeTeam");if(e){const o=e.value,r=n.getTeams();e.innerHTML=r.map(a=>`
        <option value="${a.id}" ${a.id===o?"selected":""}>
          ${a.name} — ${a.score.toLocaleString()} PTS ${a.codeCracked?`(OVERRIDDEN +${a.crackedBonus||100} PTS)`:""}
        </option>
      `).join("")}const s=n.getNextCipherBonus(),t=document.getElementById("terminalBountyVal");t&&(t.textContent=`+${s} BONUS PTS`);const i=document.getElementById("terminalSubtitleBounty");i&&(i.textContent=`+${s} PTS`)}setFeedback(e,s="info"){const t=document.getElementById("terminalFeedbackMsg");t&&(t.className=`terminal-message msg-${s}`,t.innerHTML=e)}clearFeedback(){const e=document.getElementById("terminalFeedbackMsg");e&&(e.innerHTML="")}handleDecryption(){if(this.isAuthenticating)return;l.ensureContext();const e=document.getElementById("selectOperativeTeam"),s=document.getElementById("inputCipherPhrase"),t=document.getElementById("decryptBtnText");if(!e||!s)return;const i=e.value,o=n.getTeamById(i),r=this.normalizeCode(s.value);if(!o){this.setFeedback("Please select a valid operative squad.","error");return}if(!r){this.setFeedback("Console empty. Please enter cipher passphrase.","warning"),s.focus();return}if(o.codeCracked){this.setFeedback(`${o.name} has already cracked this cipher. Select another squad.`,"warning");return}this.isAuthenticating=!0,l.playTick(),t&&(t.textContent="[AUTHENTICATING MESH...]"),setTimeout(()=>{if(this.isAuthenticating=!1,t&&(t.textContent="DECRYPT & OVERRIDE"),r===this.TARGET_PHRASE){const d=n.crackCode(o.id);n.triggerRemoteWarp(o.id,d);const u=n.getNextCipherBonus();this.setFeedback(`AUTHENTICATION CONFIRMED. OVERRIDE KEY ACCEPTED (+${d} PTS). NEXT SQUAD BOUNTY: +${u} PTS.`,"success"),s.value="",m.trigger(o,()=>{n.setActiveView("leaderboard")},d)}else l.playTick(),this.setFeedback("ACCESS DENIED: Passcode hash mismatch. Verify sequence and retry.","error"),s.classList.add("shake"),setTimeout(()=>s.classList.remove("shake"),500)},700)}}class b{constructor(){this.views={leaderboard:document.getElementById("viewLeaderboard"),terminal:document.getElementById("viewTerminal"),operator:document.getElementById("viewOperator")},this.init()}init(){new v("navbarContainer"),new E("viewLeaderboard"),new T("viewTerminal"),new h("viewOperator"),n.subscribe(e=>{this.switchView(e.getActiveView())}),this.switchView(n.getActiveView()),window.addEventListener("keydown",e=>{["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName)||(e.key==="1"&&n.setActiveView("leaderboard"),e.key==="2"&&n.setActiveView("terminal"),e.key==="3"&&n.setActiveView("operator"))}),console.log("%c SIS 2026 // STAND IN, STAND TOGETHER %c BCA SYSTEM INFRASTRUCTURE ","background: #FFFFFF; color: #000000; font-weight: bold; padding: 4px 8px; border-radius: 4px;","background: #18181B; color: #E4E4E7; font-weight: normal; padding: 4px 8px; border-radius: 4px;")}switchView(e){Object.keys(this.views).forEach(s=>{const t=this.views[s];t&&(s===e?(t.classList.add("active"),t.classList.add("fade-in"),window.scrollTo({top:0,behavior:"smooth"})):(t.classList.remove("active"),t.classList.remove("fade-in")))})}}document.addEventListener("DOMContentLoaded",()=>{new b});
