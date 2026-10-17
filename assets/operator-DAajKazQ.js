(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();const $="sis_2026_teams_v3",_="sis_2026_teams_backup_safe",H="sis_2026_logs_v3",te="sis_2026_sound_v3",ae="sis_2026_active_view_v3",se=[{id:"team-ayam",name:"AYAM // 01",score:0,codeCracked:!1,color:"#FFFFFF"},{id:"team-bebek",name:"BEBEK // 02",score:0,codeCracked:!1,color:"#F4F4F5"},{id:"team-burunghantu",name:"BURUNG HANTU // 03",score:0,codeCracked:!1,color:"#E4E4E7"},{id:"team-gajah",name:"GAJAH // 04",score:0,codeCracked:!1,color:"#D4D4D8"},{id:"team-gorilla",name:"GORILLA // 05",score:0,codeCracked:!1,color:"#A1A1AA"},{id:"team-harimau",name:"HARIMAU // 06",score:0,codeCracked:!1,color:"#9CA3AF"},{id:"team-kambing",name:"KAMBING // 07",score:0,codeCracked:!1,color:"#71717A"},{id:"team-katak",name:"KATAK // 08",score:0,codeCracked:!1,color:"#52525B"},{id:"team-kucing",name:"KUCING // 09",score:0,codeCracked:!1,color:"#3F3F46"},{id:"team-kuda",name:"KUDA // 10",score:0,codeCracked:!1,color:"#E4E4E7"},{id:"team-lumbalumba",name:"LUMBA-LUMBA // 11",score:0,codeCracked:!1,color:"#D4D4D8"},{id:"team-merak",name:"MERAK // 12",score:0,codeCracked:!1,color:"#A1A1AA"},{id:"team-monyet",name:"MONYET // 13",score:0,codeCracked:!1,color:"#71717A"},{id:"team-sapi",name:"SAPI // 14",score:0,codeCracked:!1,color:"#52525B"},{id:"team-serigala",name:"SERIGALA // 15",score:0,codeCracked:!1,color:"#FFFFFF"}];class ke{constructor(){this.listeners=new Set,this.lastAction=null,this.channel=typeof BroadcastChannel<"u"?new BroadcastChannel("sis_cross_window_sync"):null,this.teams=this.loadTeams(),this.logs=this.loadLogs(),this.activeView=this.resolveInitialView(),this.soundEnabled=(typeof localStorage<"u"?localStorage.getItem(te):null)!=="false",this.initSync()}resolveInitialView(){if(typeof window<"u"){const a=new URLSearchParams(window.location.search).get("view");if(a&&["leaderboard","terminal","operator"].includes(a.toLowerCase()))return a.toLowerCase();const n=window.location.hash.replace("#","").toLowerCase();if(n&&["leaderboard","terminal","operator"].includes(n))return n;const i=sessionStorage.getItem(ae);if(i&&["leaderboard","terminal","operator"].includes(i))return i}return"leaderboard"}initSync(){this.channel&&(this.channel.onmessage=e=>{e.data&&(e.data.type==="STATE_UPDATE"?(this.teams=e.data.teams||this.loadTeams(),this.logs=e.data.logs||this.loadLogs(),this.lastAction=e.data.lastAction||null,this.notifyLocally()):e.data.type==="TRIGGER_WARP"&&typeof window<"u"&&window.dispatchEvent(new CustomEvent("sis-remote-warp",{detail:{teamId:e.data.teamId}})))}),typeof window<"u"&&(window.addEventListener("storage",e=>{if(e.key===$&&e.newValue)try{this.teams=JSON.parse(e.newValue),this.notifyLocally()}catch{}if(e.key===H&&e.newValue)try{this.logs=JSON.parse(e.newValue),this.notifyLocally()}catch{}}),window.addEventListener("hashchange",()=>{const e=window.location.hash.replace("#","").toLowerCase();["leaderboard","terminal","operator"].includes(e)&&this.setActiveView(e)}))}broadcast(e){if(this.channel)try{this.channel.postMessage(e)}catch(a){console.warn("Sync broadcast warning:",a)}}loadTeams(){try{const e=typeof localStorage<"u"?localStorage.getItem($)||localStorage.getItem(_):null;if(e){const a=JSON.parse(e);if(Array.isArray(a)&&a.length>0){const n={AYAM:"AYAM // 01",BEBEK:"BEBEK // 02","BURUNG HANTU":"BURUNG HANTU // 03",GAJAH:"GAJAH // 04",GORILLA:"GORILLA // 05",HARIMAU:"HARIMAU // 06",KAMBING:"KAMBING // 07",KATAK:"KATAK // 08",KUCING:"KUCING // 09",KUDA:"KUDA // 10","LUMBA-LUMBA":"LUMBA-LUMBA // 11",MERAK:"MERAK // 12",MONYET:"MONYET // 13",SAPI:"SAPI // 14",SERIGALA:"SERIGALA // 15"};let i=!1;return a.forEach(r=>{n[r.name]&&(r.name=n[r.name],i=!0)}),typeof localStorage<"u"&&(localStorage.setItem($,JSON.stringify(a)),localStorage.setItem(_,JSON.stringify(a))),a}}}catch(e){console.warn("Failed to parse teams from storage, checking secondary backup.",e);try{const a=typeof localStorage<"u"?localStorage.getItem(_):null;if(a)return JSON.parse(a)}catch{}}return JSON.parse(JSON.stringify(se))}saveTeams(e=null){try{if(typeof localStorage<"u"){const a=JSON.stringify(this.teams);localStorage.setItem($,a),localStorage.setItem(_,a)}this.lastAction=e,this.broadcast({type:"STATE_UPDATE",teams:this.teams,logs:this.logs,lastAction:this.lastAction})}catch(a){console.error("Error saving teams to storage",a)}}exportDatabase(){const e={app:"SIS 2026 Engagement Portal",version:"1.0",exportedAt:new Date().toISOString(),teams:this.teams,logs:this.logs},a=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(a),i=document.createElement("a");i.href=n;const r=new Date().toISOString().slice(0,10);i.download=`sis-2026-database-backup-${r}.json`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n),this.addLog("Database backup exported to JSON")}importDatabase(e){try{const a=JSON.parse(e);if(!a||!Array.isArray(a.teams))throw new Error("Invalid database format. Must contain squads array.");return this.teams=a.teams,Array.isArray(a.logs)&&(this.logs=a.logs,this.saveLogs()),this.saveTeams({type:"DATABASE_IMPORT"}),this.addLog(`Database restored from backup (${this.teams.length} squads loaded)`),this.notify({type:"DATABASE_IMPORT"}),!0}catch(a){return console.error("Import failed:",a),!1}}loadLogs(){try{const e=typeof localStorage<"u"?localStorage.getItem(H):null;if(e)return JSON.parse(e)}catch{}return[{id:Date.now(),text:"SIS Core Engine online. High-availability telemetry active.",time:new Date().toLocaleTimeString()}]}saveLogs(){try{typeof localStorage<"u"&&localStorage.setItem(H,JSON.stringify(this.logs.slice(0,30)))}catch{}}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notifyLocally(){for(const e of this.listeners)e(this)}notify(e=null){this.lastAction=e,this.notifyLocally()}getLastAction(){return this.lastAction}getTeams(){return[...this.teams].sort((e,a)=>a.score!==e.score?a.score-e.score:e.name.localeCompare(a.name))}getTeamById(e){return this.teams.find(a=>a.id===e)}addTeam(e){if(!e||!e.trim())return;const a=e.trim().toUpperCase(),n="team-"+Date.now(),i={id:n,name:a,score:0,codeCracked:!1,color:"#E4E4E7"};return this.teams.push(i),this.addLog(`Commissioned new squad: ${a}`),this.saveTeams({type:"ADD_TEAM",teamId:n}),this.notify({type:"ADD_TEAM",teamId:n}),i}removeTeam(e){const a=this.getTeamById(e);a&&(this.teams=this.teams.filter(n=>n.id!==e),this.addLog(`Decommissioned squad: ${a.name}`),this.saveTeams({type:"REMOVE_TEAM",teamId:e}),this.notify({type:"REMOVE_TEAM",teamId:e}))}adjustScore(e,a,n="Operator adjustment"){const i=this.getTeamById(e);if(!i)return;i.score=Math.max(0,i.score+a);const r=a>=0?`+${a}`:`${a}`;this.addLog(`${i.name} updated: ${r} PTS (${n})`);const o={type:"ADJUST_SCORE",teamId:e,delta:a,newScore:i.score};this.saveTeams(o),this.notify(o)}setScore(e,a){const n=this.getTeamById(e);if(!n)return;n.score=Math.max(0,Number(a)||0),this.addLog(`${n.name} score set to ${n.score} PTS`);const i={type:"SET_SCORE",teamId:e,newScore:n.score};this.saveTeams(i),this.notify(i)}getNextCipherBonus(){const e=this.teams.filter(a=>a.codeCracked).length;return Math.max(50,100-e*5)}crackCode(e,a=null){const n=this.getTeamById(e);if(!n)return!1;const i=a!==null?a:this.getNextCipherBonus(),r=this.teams.filter(E=>E.codeCracked).length+1;n.codeCracked=!0,n.crackedBonus=i,n.crackedRank=r,n.score+=i;const o=this.getNextCipherBonus();this.addLog(`[OVERRIDE #${r}] ${n.name} cracked cipher! Awarded +${i} PTS (Next bounty: +${o} PTS)`);const h={type:"CRACK_CODE",teamId:n.id,bonus:i,nextBounty:o};return this.saveTeams(h),this.notify(h),i}triggerRemoteWarp(e,a=null){const n=a||this.getNextCipherBonus();this.broadcast({type:"TRIGGER_WARP",teamId:e,bonus:n}),typeof window<"u"&&window.dispatchEvent(new CustomEvent("sis-remote-warp",{detail:{teamId:e,bonus:n}}))}resetScores(){this.teams.forEach(a=>{a.score=0,a.codeCracked=!1,delete a.crackedBonus,delete a.crackedRank}),this.addLog("All squad standings reset to 0 PTS (Cipher bounty restored to 100 PTS)");const e={type:"RESET_SCORES"};this.saveTeams(e),this.notify(e)}resetToDefaults(){this.teams=JSON.parse(JSON.stringify(se)),this.logs=[],this.addLog("System factory restored to 15 default squads"),this.saveLogs();const e={type:"FACTORY_RESET"};this.saveTeams(e),this.notify(e)}getActiveView(){return this.activeView}setActiveView(e){this.activeView=e,typeof sessionStorage<"u"&&sessionStorage.setItem(ae,e),this.notify()}isSoundEnabled(){return this.soundEnabled}setSoundEnabled(e){this.soundEnabled=!!e,typeof localStorage<"u"&&localStorage.setItem(te,String(this.soundEnabled)),this.notify()}getLogs(){return this.logs}addLog(e){const a={id:Date.now(),text:e,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})};this.logs.unshift(a),this.saveLogs()}}const y=new ke;class Me{constructor(){this.ctx=null}ensureContext(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}canPlay(){return y.isSoundEnabled()}playTick(){if(this.canPlay()&&(this.ensureContext(),!!this.ctx))try{const e=this.ctx.createOscillator(),a=this.ctx.createGain(),n=this.ctx.currentTime;e.type="sine",e.frequency.setValueAtTime(1400,n),e.frequency.exponentialRampToValueAtTime(300,n+.04),a.gain.setValueAtTime(.08,n),a.gain.exponentialRampToValueAtTime(.001,n+.04),e.connect(a),a.connect(this.ctx.destination),e.start(n),e.stop(n+.04)}catch{}}playKeypress(){if(this.canPlay()&&(this.ensureContext(),!!this.ctx))try{const e=this.ctx.currentTime,a=this.ctx.createOscillator(),n=this.ctx.createGain();a.type="triangle",a.frequency.setValueAtTime(650+Math.random()*80,e),a.frequency.exponentialRampToValueAtTime(200,e+.025),n.gain.setValueAtTime(.04,e),n.gain.exponentialRampToValueAtTime(.001,e+.025),a.connect(n),n.connect(this.ctx.destination),a.start(e),a.stop(e+.025)}catch{}}playSuccessChime(){if(this.canPlay()&&(this.ensureContext(),!!this.ctx))try{const e=[523.25,659.25,783.99,1046.5],a=this.ctx.currentTime;e.forEach((n,i)=>{const r=this.ctx.createOscillator(),o=this.ctx.createGain(),h=a+i*.08;r.type="sine",r.frequency.setValueAtTime(n,h),o.gain.setValueAtTime(0,h),o.gain.linearRampToValueAtTime(.12,h+.02),o.gain.exponentialRampToValueAtTime(.001,h+.35),r.connect(o),o.connect(this.ctx.destination),r.start(h),r.stop(h+.35)})}catch{}}playWarpBlast(){if(this.canPlay()&&(this.ensureContext(),!!this.ctx))try{const e=this.ctx.currentTime,a=this.ctx.createOscillator(),n=this.ctx.createGain();a.type="sawtooth",a.frequency.setValueAtTime(65,e),a.frequency.exponentialRampToValueAtTime(32,e+.6),a.frequency.exponentialRampToValueAtTime(140,e+1.8),n.gain.setValueAtTime(.2,e),n.gain.exponentialRampToValueAtTime(.3,e+.8),n.gain.exponentialRampToValueAtTime(.001,e+2.5),a.connect(n),n.connect(this.ctx.destination),a.start(e),a.stop(e+2.5);const i=this.ctx.sampleRate*2,r=this.ctx.createBuffer(1,i,this.ctx.sampleRate),o=r.getChannelData(0);for(let w=0;w<i;w++)o[w]=Math.random()*2-1;const h=this.ctx.createBufferSource();h.buffer=r;const E=this.ctx.createBiquadFilter();E.type="bandpass",E.Q.value=3,E.frequency.setValueAtTime(200,e),E.frequency.exponentialRampToValueAtTime(3200,e+1.2),E.frequency.exponentialRampToValueAtTime(400,e+2.2);const C=this.ctx.createGain();C.gain.setValueAtTime(0,e),C.gain.linearRampToValueAtTime(.25,e+.6),C.gain.exponentialRampToValueAtTime(.001,e+2.2),h.connect(E),E.connect(C),C.connect(this.ctx.destination),h.start(e),h.stop(e+2.2),[1046.5,1318.5,1567.98,2093].forEach((w,V)=>{const N=this.ctx.createOscillator(),q=this.ctx.createGain(),F=e+1+V*.12;N.type="sine",N.frequency.setValueAtTime(w,F),q.gain.setValueAtTime(.12,F),q.gain.exponentialRampToValueAtTime(.001,F+.7),N.connect(q),q.connect(this.ctx.destination),N.start(F),N.stop(F+.7)})}catch{}}}const k=new Me,R={crown:`
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z"/>
    </svg>
  `,operator:`
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  `,sparkle:`
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
    </svg>
  `,lock:`
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `,eye:`
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,eyeOff:`
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  `,volumeOn:`
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  `,volumeMute:`
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  `,arrowUpRight:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/>
      <polyline points="7 7 17 7 17 17"/>
    </svg>
  `,arrowRight:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  `,plus:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  `,trash:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  `,refresh:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  `,search:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  `,display:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  `,download:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  `,upload:`
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  `};class Le{constructor(e,a={}){this.container=document.getElementById(e),this.options=a,this.clockInterval=null,this.init()}init(){this.render(),y.subscribe(()=>{this.updateActiveTab(),this.updateSoundBtn()}),this.startClock()}startClock(){this.updateClock(),this.clockInterval=setInterval(()=>this.updateClock(),1e3)}updateClock(){const e=document.getElementById("navLiveClock");if(!e)return;const a=new Date,n={timeZone:"Asia/Jakarta",hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"},i=a.toLocaleTimeString("en-GB",n);e.textContent=`${i} WIB`}render(){if(!this.container)return;const e=this.options.isDedicatedOperator;this.container.innerHTML=`
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
            <button class="btn-multiwindow-launch" id="btnLaunchDualScreen" title="${e?"Open Audience Standings Display in New Window":"Open Operator Input Deck in New Window"}">
              <span class="icon-dual-screen">
                ${e?`${R.display}<span>AUDIENCE</span>`:`${R.operator}<span>OPERATOR</span>`}
              </span>
              <span class="popout-arrow">${R.arrowUpRight}</span>
            </button>

            <div class="telemetry-pill">
              <span class="telemetry-indicator live" title="Live Sync Active Across Tabs"></span>
              <span class="telemetry-clock" id="navLiveClock">00:00:00 WIB</span>
            </div>

            <!-- Sound Toggle -->
            <button class="btn-sound-toggle" id="btnSoundToggle" title="Toggle Synthesizer Audio">
              <span class="icon-wrap" id="soundIconWrap">${y.isSoundEnabled()?R.volumeOn:R.volumeMute}</span>
            </button>
          </div>
        </div>
      </header>
    `;const a=this.container.querySelector("#navBrandBtn");a&&a.addEventListener("click",()=>{k.playTick(),e?window.location.href="/?view=leaderboard":y.setActiveView("leaderboard")}),this.container.querySelectorAll(".nav-tab-btn").forEach(o=>{o.addEventListener("click",()=>{k.playTick();const h=o.getAttribute("data-view");h&&(e&&h!=="operator"?window.location.href=`./?view=${h}`:y.setActiveView(h))})});const i=this.container.querySelector("#btnLaunchDualScreen");i&&i.addEventListener("click",()=>{k.playTick(),e?window.open("./?view=leaderboard","_blank","width=1400,height=900"):window.open("./operator.html","_blank","width=1400,height=900")});const r=this.container.querySelector("#btnSoundToggle");r&&r.addEventListener("click",()=>{const o=!y.isSoundEnabled();y.setSoundEnabled(o),o&&k.playTick()}),this.updateActiveTab(),this.updateSoundBtn()}updateActiveTab(){const e=y.getActiveView();this.container.querySelectorAll(".nav-tab-btn").forEach(n=>{n.getAttribute("data-view")===e?n.classList.add("active"):n.classList.remove("active")})}updateSoundBtn(){const e=document.getElementById("soundIconWrap");if(!e)return;e.innerHTML=y.isSoundEnabled()?R.volumeOn:R.volumeMute;const a=document.getElementById("btnSoundToggle");a&&a.classList.toggle("muted",!y.isSoundEnabled())}}var z={};(function P(e,a,n,i){var r=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL),o=typeof Path2D=="function"&&typeof DOMMatrix=="function",h=(function(){if(!e.OffscreenCanvas)return!1;try{var s=new OffscreenCanvas(1,1),t=s.getContext("2d");t.fillRect(0,0,1,1);var c=s.transferToImageBitmap();t.createPattern(c,"no-repeat")}catch{return!1}return!0})();function E(){}function C(s){var t=a.exports.Promise,c=t!==void 0?t:e.Promise;return typeof c=="function"?new c(s):(s(E,E),null)}var M=(function(s,t){return{transform:function(c){if(s)return c;if(t.has(c))return t.get(c);var d=new OffscreenCanvas(c.width,c.height),u=d.getContext("2d");return u.drawImage(c,0,0),t.set(c,d),d},clear:function(){t.clear()}}})(h,new Map),w=(function(){var s=Math.floor(16.666666666666668),t,c,d={},u=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(t=function(p){var m=Math.random();return d[m]=requestAnimationFrame(function l(v){u===v||u+s-1<v?(u=v,delete d[m],p()):d[m]=requestAnimationFrame(l)}),m},c=function(p){d[p]&&cancelAnimationFrame(d[p])}):(t=function(p){return setTimeout(p,s)},c=function(p){return clearTimeout(p)}),{frame:t,cancel:c}})(),V=(function(){var s,t,c={};function d(u){function p(m,l){u.postMessage({options:m||{},callback:l})}u.init=function(l){var v=l.transferControlToOffscreen();u.postMessage({canvas:v},[v])},u.fire=function(l,v,g){if(t)return p(l,null),t;var S=Math.random().toString(36).slice(2);return t=C(function(b){function A(x){x.data.callback===S&&(delete c[S],u.removeEventListener("message",A),t=null,M.clear(),g(),b())}u.addEventListener("message",A),p(l,S),c[S]=A.bind(null,{data:{callback:S}})}),t},u.reset=function(){u.postMessage({reset:!0});for(var l in c)c[l](),delete c[l]}}return function(){if(s)return s;if(!n&&r){var u=["var CONFETTI, SIZE = {}, module = {};","("+P.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{s=new Worker(URL.createObjectURL(new Blob([u])))}catch(p){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",p),null}d(s)}return s}})(),N={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function q(s,t){return t?t(s):s}function F(s){return s!=null}function T(s,t,c){return q(s&&F(s[t])?s[t]:N[t],c)}function ne(s){return s<0?0:Math.floor(s)}function ie(s,t){return Math.floor(Math.random()*(t-s))+s}function G(s){return parseInt(s,16)}function re(s){return s.map(oe)}function oe(s){var t=String(s).replace(/[^0-9a-f]/gi,"");return t.length<6&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),{r:G(t.substring(0,2)),g:G(t.substring(2,4)),b:G(t.substring(4,6))}}function ce(s){var t=T(s,"origin",Object);return t.x=T(t,"x",Number),t.y=T(t,"y",Number),t}function le(s){s.width=document.documentElement.clientWidth,s.height=document.documentElement.clientHeight}function de(s){var t=s.getBoundingClientRect();s.width=t.width,s.height=t.height}function he(s){var t=document.createElement("canvas");return t.style.position="fixed",t.style.top="0px",t.style.left="0px",t.style.pointerEvents="none",t.style.zIndex=s,t}function ue(s,t,c,d,u,p,m,l,v){s.save(),s.translate(t,c),s.rotate(p),s.scale(d,u),s.arc(0,0,1,m,l,v),s.restore()}function pe(s){var t=s.angle*(Math.PI/180),c=s.spread*(Math.PI/180);return{x:s.x,y:s.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:s.startVelocity*.5+Math.random()*s.startVelocity,angle2D:-t+(.5*c-Math.random()*c),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:s.color,shape:s.shape,tick:0,totalTicks:s.ticks,decay:s.decay,drift:s.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:s.gravity*3,ovalScalar:.6,scalar:s.scalar,flat:s.flat}}function me(s,t){t.x+=Math.cos(t.angle2D)*t.velocity+t.drift,t.y+=Math.sin(t.angle2D)*t.velocity+t.gravity,t.velocity*=t.decay,t.flat?(t.wobble=0,t.wobbleX=t.x+10*t.scalar,t.wobbleY=t.y+10*t.scalar,t.tiltSin=0,t.tiltCos=0,t.random=1):(t.wobble+=t.wobbleSpeed,t.wobbleX=t.x+10*t.scalar*Math.cos(t.wobble),t.wobbleY=t.y+10*t.scalar*Math.sin(t.wobble),t.tiltAngle+=.1,t.tiltSin=Math.sin(t.tiltAngle),t.tiltCos=Math.cos(t.tiltAngle),t.random=Math.random()+2);var c=t.tick++/t.totalTicks,d=t.x+t.random*t.tiltCos,u=t.y+t.random*t.tiltSin,p=t.wobbleX+t.random*t.tiltCos,m=t.wobbleY+t.random*t.tiltSin;if(s.fillStyle="rgba("+t.color.r+", "+t.color.g+", "+t.color.b+", "+(1-c)+")",s.beginPath(),o&&t.shape.type==="path"&&typeof t.shape.path=="string"&&Array.isArray(t.shape.matrix))s.fill(fe(t.shape.path,t.shape.matrix,t.x,t.y,Math.abs(p-d)*.1,Math.abs(m-u)*.1,Math.PI/10*t.wobble));else if(t.shape.type==="bitmap"){var l=Math.PI/10*t.wobble,v=Math.abs(p-d)*.1,g=Math.abs(m-u)*.1,S=t.shape.bitmap.width*t.scalar,b=t.shape.bitmap.height*t.scalar,A=new DOMMatrix([Math.cos(l)*v,Math.sin(l)*v,-Math.sin(l)*g,Math.cos(l)*g,t.x,t.y]);A.multiplySelf(new DOMMatrix(t.shape.matrix));var x=s.createPattern(M.transform(t.shape.bitmap),"no-repeat");x.setTransform(A),s.globalAlpha=1-c,s.fillStyle=x,s.fillRect(t.x-S/2,t.y-b/2,S,b),s.globalAlpha=1}else if(t.shape==="circle")s.ellipse?s.ellipse(t.x,t.y,Math.abs(p-d)*t.ovalScalar,Math.abs(m-u)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI):ue(s,t.x,t.y,Math.abs(p-d)*t.ovalScalar,Math.abs(m-u)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI);else if(t.shape==="star")for(var f=Math.PI/2*3,I=4*t.scalar,L=8*t.scalar,O=t.x,D=t.y,U=5,B=Math.PI/U;U--;)O=t.x+Math.cos(f)*L,D=t.y+Math.sin(f)*L,s.lineTo(O,D),f+=B,O=t.x+Math.cos(f)*I,D=t.y+Math.sin(f)*I,s.lineTo(O,D),f+=B;else s.moveTo(Math.floor(t.x),Math.floor(t.y)),s.lineTo(Math.floor(t.wobbleX),Math.floor(u)),s.lineTo(Math.floor(p),Math.floor(m)),s.lineTo(Math.floor(d),Math.floor(t.wobbleY));return s.closePath(),s.fill(),t.tick<t.totalTicks}function ve(s,t,c,d,u){var p=t.slice(),m=s.getContext("2d"),l,v,g=C(function(S){function b(){l=v=null,m.clearRect(0,0,d.width,d.height),M.clear(),u(),S()}function A(){n&&!(d.width===i.width&&d.height===i.height)&&(d.width=s.width=i.width,d.height=s.height=i.height),!d.width&&!d.height&&(c(s),d.width=s.width,d.height=s.height),m.clearRect(0,0,d.width,d.height),p=p.filter(function(x){return me(m,x)}),p.length?l=w.frame(A):b()}l=w.frame(A),v=b});return{addFettis:function(S){return p=p.concat(S),g},canvas:s,promise:g,reset:function(){l&&w.cancel(l),v&&v()}}}function Y(s,t){var c=!s,d=!!T(t||{},"resize"),u=!1,p=T(t,"disableForReducedMotion",Boolean),m=r&&!!T(t||{},"useWorker"),l=m?V():null,v=c?le:de,g=s&&l?!!s.__confetti_initialized:!1,S=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,b;function A(f,I,L){for(var O=T(f,"particleCount",ne),D=T(f,"angle",Number),U=T(f,"spread",Number),B=T(f,"startVelocity",Number),be=T(f,"decay",Number),we=T(f,"gravity",Number),Se=T(f,"drift",Number),Z=T(f,"colors",re),Ae=T(f,"ticks",Number),Q=T(f,"shapes"),Te=T(f,"scalar"),Ee=!!T(f,"flat"),X=ce(f),ee=O,W=[],Ce=s.width*X.x,xe=s.height*X.y;ee--;)W.push(pe({x:Ce,y:xe,angle:D,spread:U,startVelocity:B,color:Z[ee%Z.length],shape:Q[ie(0,Q.length)],ticks:Ae,decay:be,gravity:we,drift:Se,scalar:Te,flat:Ee}));return b?b.addFettis(W):(b=ve(s,W,v,I,L),b.promise)}function x(f){var I=p||T(f,"disableForReducedMotion",Boolean),L=T(f,"zIndex",Number);if(I&&S)return C(function(B){B()});c&&b?s=b.canvas:c&&!s&&(s=he(L),document.body.appendChild(s)),d&&!g&&v(s);var O={width:s.width,height:s.height};l&&!g&&l.init(s),g=!0,l&&(s.__confetti_initialized=!0);function D(){if(l){var B={getBoundingClientRect:function(){if(!c)return s.getBoundingClientRect()}};v(B),l.postMessage({resize:{width:B.width,height:B.height}});return}O.width=O.height=null}function U(){b=null,d&&(u=!1,e.removeEventListener("resize",D)),c&&s&&(document.body.contains(s)&&document.body.removeChild(s),s=null,g=!1)}return d&&!u&&(u=!0,e.addEventListener("resize",D,!1)),l?l.fire(f,O,U):A(f,O,U)}return x.reset=function(){l&&l.reset(),b&&b.reset()},x}var j;function J(){return j||(j=Y(null,{useWorker:!0,resize:!0})),j}function fe(s,t,c,d,u,p,m){var l=new Path2D(s),v=new Path2D;v.addPath(l,new DOMMatrix(t));var g=new Path2D;return g.addPath(v,new DOMMatrix([Math.cos(m)*u,Math.sin(m)*u,-Math.sin(m)*p,Math.cos(m)*p,c,d])),g}function ge(s){if(!o)throw new Error("path confetti are not supported in this browser");var t,c;typeof s=="string"?t=s:(t=s.path,c=s.matrix);var d=new Path2D(t),u=document.createElement("canvas"),p=u.getContext("2d");if(!c){for(var m=1e3,l=m,v=m,g=0,S=0,b,A,x=0;x<m;x+=2)for(var f=0;f<m;f+=2)p.isPointInPath(d,x,f,"nonzero")&&(l=Math.min(l,x),v=Math.min(v,f),g=Math.max(g,x),S=Math.max(S,f));b=g-l,A=S-v;var I=10,L=Math.min(I/b,I/A);c=[L,0,0,L,-Math.round(b/2+l)*L,-Math.round(A/2+v)*L]}return{type:"path",path:t,matrix:c}}function ye(s){var t,c=1,d="#000000",u='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof s=="string"?t=s:(t=s.text,c="scalar"in s?s.scalar:c,u="fontFamily"in s?s.fontFamily:u,d="color"in s?s.color:d);var p=10*c,m=""+p+"px "+u,l=new OffscreenCanvas(p,p),v=l.getContext("2d");v.font=m;var g=v.measureText(t),S=Math.ceil(g.actualBoundingBoxRight+g.actualBoundingBoxLeft),b=Math.ceil(g.actualBoundingBoxAscent+g.actualBoundingBoxDescent),A=2,x=g.actualBoundingBoxLeft+A,f=g.actualBoundingBoxAscent+A;S+=A+A,b+=A+A,l=new OffscreenCanvas(S,b),v=l.getContext("2d"),v.font=m,v.fillStyle=d,v.fillText(t,x,f);var I=1/c;return{type:"bitmap",bitmap:l.transferToImageBitmap(),matrix:[I,0,0,I,-S*I/2,-b*I/2]}}a.exports=function(){return J().apply(this,arguments)},a.exports.reset=function(){J().reset()},a.exports.create=Y,a.exports.shapeFromPath=ge,a.exports.shapeFromText=ye})((function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}})(),z,!1);const K=z.exports;z.exports.create;class Re{constructor(){this.overlay=null,this.canvas=null,this.ctx=null,this.animId=null,this.stars=[],this.starCount=450,this.speed=1,this.maxSpeed=48,this.warpPhase="idle",this.isActive=!1,this.onCompleteCallback=null,this.createDom()}createDom(){const e=document.getElementById("warpOverlay");e&&e.remove(),this.overlay=document.createElement("div"),this.overlay.id="warpOverlay",this.overlay.className="warp-overlay hidden",this.overlay.innerHTML=`
      <canvas id="warpCanvas"></canvas>
      <div class="warp-hud">
        <div class="warp-telemetry-badge">
          <span class="telemetry-dot pulse"></span>
          <span>HYPER-WARP RESILIENCE VECTOR // 99.999%</span>
        </div>
        
        <div class="warp-hero-title">
          <div class="warp-sub-label">CIPHER DECRYPTED • INFRASTRUCTURE OVERRIDE</div>
          <h1 class="warp-main-text">SECURITY OVERRIDE<br/><span class="warp-highlight">ACCESS AUTHORIZED</span></h1>
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
    `,document.body.appendChild(this.overlay),this.canvas=this.overlay.querySelector("#warpCanvas"),this.ctx=this.canvas.getContext("2d");const a=this.overlay.querySelector("#btnWarpClose");a&&a.addEventListener("click",()=>{k.playTick(),this.stop(),this.onCompleteCallback&&this.onCompleteCallback()}),window.addEventListener("resize",()=>{this.isActive&&this.resize()})}resize(){this.canvas&&(this.width=window.innerWidth,this.height=window.innerHeight,this.canvas.width=this.width,this.canvas.height=this.height,this.centerX=this.width/2,this.centerY=this.height/2)}initStars(){this.stars=[];for(let e=0;e<this.starCount;e++)this.stars.push({x:(Math.random()-.5)*this.width*2,y:(Math.random()-.5)*this.height*2,z:Math.random()*this.width,prevZ:0,size:Math.random()*2+1,color:Math.random()>.8?"#E4E4E7":"#FFFFFF"})}trigger(e,a,n=100){this.isActive=!0,this.onCompleteCallback=a,this.resize(),this.initStars(),this.speed=1,this.warpPhase="accelerating";const i=document.getElementById("warpSquadName");i&&(i.textContent=e?e.name:"AUTHENTICATED SQUAD");const r=document.getElementById("warpOdometer");r&&(r.textContent="+0 PTS"),this.overlay.classList.remove("hidden"),this.overlay.classList.add("active"),k.playWarpBlast();const o=performance.now();this.renderLoop(o),this.animateOdometer(n,2200),setTimeout(()=>{this.fireMonochromeConfetti()},1200),setTimeout(()=>{this.fireMonochromeConfetti()},2400)}animateOdometer(e,a){const n=document.getElementById("warpOdometer");if(!n)return;const i=0,r=performance.now(),o=h=>{const E=h-r,C=Math.min(1,E/a),M=1-Math.pow(1-C,3),w=Math.floor(i+(e-i)*M);n.textContent=`+${w.toLocaleString()} PTS`,C<1&&this.isActive?requestAnimationFrame(o):(n.textContent=`+${e.toLocaleString()} PTS`,k.playSuccessChime())};requestAnimationFrame(o)}fireMonochromeConfetti(){try{const a={origin:{y:.65},colors:["#FFFFFF","#D4D4D8","#A1A1AA","#71717A","#E4E4E7"]};K({...a,particleCount:90,spread:100,startVelocity:55,shapes:["square","circle"],scalar:1.2}),K({...a,particleCount:Math.floor(90*.5),angle:60,spread:75,origin:{x:.1,y:.7}}),K({...a,particleCount:Math.floor(90*.5),angle:120,spread:75,origin:{x:.9,y:.7}})}catch{}}renderLoop(e){if(this.isActive){this.speed<this.maxSpeed&&(this.speed+=.7),this.ctx.fillStyle="rgba(8, 8, 8, 0.28)",this.ctx.fillRect(0,0,this.width,this.height),this.drawTunnelRings(e);for(let a=0;a<this.stars.length;a++){const n=this.stars[a];n.prevZ=n.z,n.z-=this.speed,n.z<=0&&(n.z=this.width,n.prevZ=n.z,n.x=(Math.random()-.5)*this.width*2,n.y=(Math.random()-.5)*this.height*2);const i=280/n.z,r=n.x*i+this.centerX,o=n.y*i+this.centerY,h=280/n.prevZ,E=n.x*h+this.centerX,C=n.y*h+this.centerY;if(r>=0&&r<=this.width&&o>=0&&o<=this.height){this.ctx.beginPath(),this.ctx.moveTo(E,C),this.ctx.lineTo(r,o);const M=Math.min(1,(1-n.z/this.width)*(this.speed/15));this.ctx.strokeStyle=`rgba(255, 255, 255, ${M.toFixed(2)})`,this.ctx.lineWidth=Math.min(4,n.size*(1-n.z/this.width)*(this.speed/8)),this.ctx.lineCap="round",this.ctx.stroke()}}this.animId=requestAnimationFrame(a=>this.renderLoop(a))}}drawTunnelRings(e){const n=e*.001;for(let r=1;r<=5;r++){const o=e*.25*r%(this.width*.5),h=Math.max(0,1-o/(this.width*.45))*.18;this.ctx.beginPath(),this.ctx.arc(this.centerX,this.centerY,o,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 255, 255, ${h.toFixed(3)})`,this.ctx.lineWidth=1,this.ctx.setLineDash([8,12]),this.ctx.stroke(),this.ctx.setLineDash([])}const i=45;this.ctx.save(),this.ctx.translate(this.centerX,this.centerY),this.ctx.rotate(n*.8),this.ctx.strokeStyle="rgba(255, 255, 255, 0.45)",this.ctx.lineWidth=1.5,this.ctx.strokeRect(-i,-i,i*2,i*2),this.ctx.restore()}stop(){this.isActive=!1,this.animId&&cancelAnimationFrame(this.animId),this.overlay&&(this.overlay.classList.remove("active"),this.overlay.classList.add("hidden"))}}const Ie=new Re;class Oe{constructor(e){this.container=document.getElementById(e),this.searchFilter="",this.init()}init(){this.render(),y.subscribe(()=>{this.updateSquadScoresOnly()})}updateSquadScoresOnly(){const e=this.container.querySelector("#squadAdjustList"),a=this.container.querySelector("#matrixCountLabel"),n=this.container.querySelector("#auditLogFeed");if(!e){this.render();return}const i=y.getTeams(),r=this.filterTeams(i);if(a&&(a.textContent=`${i.length} SQUADS REGISTERED ${this.searchFilter?`(${r.length} MATCHING)`:""}`),e.innerHTML=r.length>0?r.map((o,h)=>this.renderSquadAdjustCard(o,h+1)).join(""):`<div class="squad-empty-state">No squads match "${this.escapeHtml(this.searchFilter)}".</div>`,n){const o=y.getLogs();n.innerHTML=o.slice(0,8).map(h=>`
        <div class="audit-entry">
          <span class="log-time font-mono">${h.time}</span>
          <span class="log-text">${h.text}</span>
        </div>
      `).join("")}this.bindCardEvents()}filterTeams(e){if(!this.searchFilter.trim())return e;const a=this.searchFilter.trim().toLowerCase();return e.filter(n=>n.name.toLowerCase().includes(a))}escapeHtml(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}render(){if(!this.container)return;const e=y.getTeams(),a=this.filterTeams(e),n=y.getLogs();this.container.innerHTML=`
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
                    <div class="btn-icon-capsule">${R.plus}</div>
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
                  <div class="btn-icon-capsule">${R.arrowUpRight}</div>
                </button>

                <!-- Trigger remote warp on audience screen -->
                <button class="btn-secondary-pill btn-sm" id="btnTriggerAudienceWarp" title="Broadcast warp victory blast to audience screen">
                  <span>TRIGGER WARP (AUDIENCE)</span>
                  <div class="btn-icon-capsule">${R.sparkle}</div>
                </button>

                <button class="btn-secondary-pill btn-sm" id="btnExportDatabase" title="Export database backup file (.json) to save all current scores safely">
                  <span>EXPORT BACKUP (.JSON)</span>
                  <div class="btn-icon-capsule">${R.download}</div>
                </button>

                <button class="btn-secondary-pill btn-sm" id="btnImportDatabase" title="Import database backup file (.json) to restore scores on any device">
                  <span>IMPORT BACKUP</span>
                  <div class="btn-icon-capsule">${R.upload}</div>
                </button>
                <input type="file" id="inputImportDbFile" accept=".json" style="display:none;" />

                <button class="btn-secondary-pill btn-sm" id="btnResetAllScores" title="Reset all squads to 0 PTS">
                  <span>RESET SCORES TO 0</span>
                  <div class="btn-icon-capsule">${R.refresh}</div>
                </button>

                <button class="btn-danger-pill btn-sm" id="btnFactoryReset" title="Restore default 15 animal squads with 0 PTS">
                  <span>RESTORE 15 DEFAULTS</span>
                  <div class="btn-icon-capsule">${R.trash}</div>
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
                <span class="matrix-count" id="matrixCountLabel">${e.length} SQUADS REGISTERED</span>
              </div>

              <!-- Quick Squad Filter Search -->
              <div class="matrix-filter-box">
                <div class="filter-input-shell">
                  <span class="filter-icon-prefix">${R.search}</span>
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
              ${a.length>0?a.map((i,r)=>this.renderSquadAdjustCard(i,r+1)).join(""):`<div class="squad-empty-state">No squads match "${this.escapeHtml(this.searchFilter)}".</div>`}
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
              ${n.slice(0,8).map(i=>`
                <div class="audit-entry">
                  <span class="log-time font-mono">${i.time}</span>
                  <span class="log-text">${i.text}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </section>
    `,this.bindEvents()}renderSquadAdjustCard(e,a){const n=a<10?`0${a}`:`${a}`;return`
      <div class="squad-adjust-card" data-team-id="${e.id}">
        <div class="squad-card-meta">
          <span class="squad-rank-tag font-mono">#${n}</span>
          <div class="squad-name-block">
            <span class="squad-name-text">${e.name}</span>
            <span class="squad-status-label ${e.codeCracked?"cracked":""}">
              ${e.codeCracked?`CIPHER CRACKED (+${e.crackedBonus||100} PTS)`:"ONLINE • READY"}
            </span>
          </div>
          <div class="squad-score-display">
            <span class="score-large font-mono">${e.score.toLocaleString()}</span>
            <span class="score-sub font-mono">PTS</span>
          </div>
        </div>

        <div class="squad-action-deck">
          <!-- 7 Quick Point Addition Steppers: +1, +2, +5, +10, +20, +50, +100 -->
          <div class="stepper-group positive">
            <button class="btn-step btn-step-add btn-step-1" data-id="${e.id}" data-delta="1" title="Add 1 Point">+1</button>
            <button class="btn-step btn-step-add btn-step-2" data-id="${e.id}" data-delta="2" title="Add 2 Points">+2</button>
            <button class="btn-step btn-step-add btn-step-5" data-id="${e.id}" data-delta="5" title="Add 5 Points">+5</button>
            <button class="btn-step btn-step-add btn-step-10" data-id="${e.id}" data-delta="10" title="Add 10 Points">+10</button>
            <button class="btn-step btn-step-add btn-step-20" data-id="${e.id}" data-delta="20" title="Add 20 Points">+20</button>
            <button class="btn-step btn-step-add btn-step-50" data-id="${e.id}" data-delta="50" title="Add 50 Points">+50</button>
            <button class="btn-step btn-step-add btn-step-100 font-bold" data-id="${e.id}" data-delta="100" title="Add 100 Points">+100</button>
          </div>

          <!-- Custom Input & Delete -->
          <div class="custom-score-group">
            <input 
              type="number" 
              class="input-custom-score font-mono" 
              placeholder="PTS" 
              data-id="${e.id}"
              title="Set exact points"
            />
            <button class="btn-step-set" data-id="${e.id}" title="Set exact score">SET</button>
            <button class="btn-delete-squad" data-id="${e.id}" title="Remove squad">
              ${R.trash}
            </button>
          </div>
        </div>
      </div>
    `}bindEvents(){const e=this.container.querySelector("#formAddNewSquad");e&&e.addEventListener("submit",M=>{M.preventDefault();const w=this.container.querySelector("#inputNewSquadName");w&&w.value.trim()&&(k.playSuccessChime(),y.addTeam(w.value.trim()),w.value="")});const a=this.container.querySelector("#btnOpenAudienceWindow");a&&a.addEventListener("click",()=>{k.playTick(),window.open("./?view=leaderboard","_blank","width=1400,height=900")});const n=this.container.querySelector("#btnExportDatabase");n&&n.addEventListener("click",()=>{k.playTick(),y.exportDatabase()});const i=this.container.querySelector("#btnImportDatabase"),r=this.container.querySelector("#inputImportDbFile");i&&r&&(i.addEventListener("click",()=>{r.click()}),r.addEventListener("change",M=>{const w=M.target.files&&M.target.files[0];if(!w)return;const V=new FileReader;V.onload=N=>{y.importDatabase(N.target.result)?(k.playSuccessChime(),alert("Database backup restored successfully! All scores have been updated.")):alert("Failed to import database file. Please verify it is a valid SIS backup JSON."),r.value=""},V.readAsText(w)}));const o=this.container.querySelector("#btnTriggerAudienceWarp");o&&o.addEventListener("click",()=>{const w=y.getTeams()[0];w&&(k.playSuccessChime(),y.triggerRemoteWarp(w.id),Ie.trigger(w))});const h=this.container.querySelector("#btnResetAllScores");h&&h.addEventListener("click",()=>{window.confirm("Reset ALL squad scores to 0 PTS? This updates immediately on all connected screens.")&&(k.playTick(),y.resetScores())});const E=this.container.querySelector("#btnFactoryReset");E&&E.addEventListener("click",()=>{window.confirm("Restore default 15 animal squads (all with 0 PTS)?")&&(k.playTick(),y.resetToDefaults())});const C=this.container.querySelector("#inputSquadFilter");C&&C.addEventListener("input",M=>{this.searchFilter=M.target.value,this.updateSquadScoresOnly()}),this.bindCardEvents()}bindCardEvents(){this.container.querySelectorAll(".btn-step").forEach(i=>{i.addEventListener("click",()=>{const r=i.getAttribute("data-id"),o=parseInt(i.getAttribute("data-delta"),10);r&&!isNaN(o)&&(k.playTick(),y.adjustScore(r,o))})}),this.container.querySelectorAll(".btn-step-set").forEach(i=>{i.addEventListener("click",()=>{const r=i.getAttribute("data-id"),o=this.container.querySelector(`.input-custom-score[data-id="${r}"]`);if(r&&o&&o.value.trim()!==""){const h=parseInt(o.value.trim(),10);isNaN(h)||(k.playTick(),y.setScore(r,h),o.value="")}})}),this.container.querySelectorAll(".btn-delete-squad").forEach(i=>{i.addEventListener("click",()=>{const r=i.getAttribute("data-id"),o=y.getTeamById(r);o&&window.confirm(`Remove squad "${o.name}" from event?`)&&(k.playTick(),y.removeTeam(r))})})}}export{Le as N,Oe as O,k as a,R as i,y as s,Ie as w};
