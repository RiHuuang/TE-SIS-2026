// SIS 2026 Reactive State Management System with Cross-Window Multi-Screen Synchronization
const STORAGE_KEY_TEAMS = 'sis_2026_teams_v4';
const STORAGE_KEY_BACKUP = 'sis_2026_teams_backup_safe_v4';
const STORAGE_KEY_LOGS = 'sis_2026_logs_v4';
const STORAGE_KEY_SOUND = 'sis_2026_sound_v4';
const SESSION_KEY_VIEW = 'sis_2026_active_view_v4';

// 15 squads with 0 initial points
const DEFAULT_TEAMS = [
  { id: 'team-kuda', name: 'KUDA // 01', score: 0, codeCracked: false, color: '#FFFFFF' },
  { id: 'team-simpanse', name: 'SIMPANSE // 02', score: 0, codeCracked: false, color: '#F4F4F5' },
  { id: 'team-katak', name: 'KATAK // 03', score: 0, codeCracked: false, color: '#E4E4E7' },
  { id: 'team-ayam', name: 'AYAM // 04', score: 0, codeCracked: false, color: '#D4D4D8' },
  { id: 'team-harimau', name: 'HARIMAU // 05', score: 0, codeCracked: false, color: '#A1A1AA' },
  { id: 'team-serigala', name: 'SERIGALA // 06', score: 0, codeCracked: false, color: '#9CA3AF' },
  { id: 'team-bebek', name: 'BEBEK // 07', score: 0, codeCracked: false, color: '#71717A' },
  { id: 'team-kucing', name: 'KUCING // 08', score: 0, codeCracked: false, color: '#52525B' },
  { id: 'team-sapi', name: 'SAPI // 09', score: 0, codeCracked: false, color: '#3F3F46' },
  { id: 'team-burunghantu', name: 'BURUNG HANTU // 10', score: 0, codeCracked: false, color: '#E4E4E7' },
  { id: 'team-kambing', name: 'KAMBING // 11', score: 0, codeCracked: false, color: '#D4D4D8' },
  { id: 'team-gajah', name: 'GAJAH // 12', score: 0, codeCracked: false, color: '#A1A1AA' },
  { id: 'team-tokek', name: 'TOKEK // 13', score: 0, codeCracked: false, color: '#71717A' },
  { id: 'team-hamster', name: 'HAMSTER // 14', score: 0, codeCracked: false, color: '#52525B' },
  { id: 'team-ular', name: 'ULAR // 15', score: 0, codeCracked: false, color: '#FFFFFF' }
];

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.lastAction = null;
    this.channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sis_cross_window_sync') : null;
    this.teams = this.loadTeams();
    this.logs = this.loadLogs();
    this.activeView = this.resolveInitialView();
    this.soundEnabled = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SOUND) : null) !== 'false';

    this.initSync();
  }

  resolveInitialView() {
    // 1. Check URL parameters: ?view=operator or ?view=leaderboard or ?view=terminal
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get('view');
      if (urlView && ['leaderboard', 'terminal', 'operator'].includes(urlView.toLowerCase())) {
        return urlView.toLowerCase();
      }

      // 2. Check URL Hash: #operator or #leaderboard or #terminal
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash && ['leaderboard', 'terminal', 'operator'].includes(hash)) {
        return hash;
      }

      // 3. Check Session Storage (window-isolated so Chrome 1 and Chrome 2 don't collide)
      const sessionView = sessionStorage.getItem(SESSION_KEY_VIEW);
      if (sessionView && ['leaderboard', 'terminal', 'operator'].includes(sessionView)) {
        return sessionView;
      }
    }
    return 'leaderboard';
  }

  initSync() {
    // BroadcastChannel sync across tabs and windows
    if (this.channel) {
      this.channel.onmessage = (event) => {
        if (!event.data) return;
        if (event.data.type === 'STATE_UPDATE') {
          this.teams = event.data.teams || this.loadTeams();
          this.logs = event.data.logs || this.loadLogs();
          this.lastAction = event.data.lastAction || null;
          this.notifyLocally();
        } else if (event.data.type === 'TRIGGER_WARP') {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('sis-remote-warp', { detail: { teamId: event.data.teamId } }));
          }
        }
      };
    }

    // Storage event sync as cross-window backup
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_TEAMS && e.newValue) {
          try {
            this.teams = JSON.parse(e.newValue);
            this.notifyLocally();
          } catch (err) {}
        }
        if (e.key === STORAGE_KEY_LOGS && e.newValue) {
          try {
            this.logs = JSON.parse(e.newValue);
            this.notifyLocally();
          } catch (err) {}
        }
      });

      // Handle hash change
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (['leaderboard', 'terminal', 'operator'].includes(hash)) {
          this.setActiveView(hash);
        }
      });
    }
  }

  broadcast(message) {
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('Sync broadcast warning:', e);
      }
    }
  }

  loadTeams() {
    try {
      const saved = typeof localStorage !== 'undefined' 
        ? (localStorage.getItem(STORAGE_KEY_TEAMS) || localStorage.getItem(STORAGE_KEY_BACKUP))
        : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Seamless migration from previous version if available
      if (typeof localStorage !== 'undefined') {
        const oldSaved = localStorage.getItem('sis_2026_teams_v3') || localStorage.getItem('sis_2026_teams_backup_safe');
        if (oldSaved) {
          try {
            const oldTeams = JSON.parse(oldSaved);
            if (Array.isArray(oldTeams) && oldTeams.length > 0) {
              const newTeams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
              newTeams.forEach(nt => {
                const baseName = nt.name.split(' // ')[0].trim().toUpperCase();
                const matchedOld = oldTeams.find(ot => {
                  const otBase = (ot.name || '').split(' // ')[0].trim().toUpperCase();
                  return otBase === baseName;
                });
                if (matchedOld) {
                  nt.score = matchedOld.score || 0;
                  nt.codeCracked = !!matchedOld.codeCracked;
                  if (matchedOld.crackedBonus) nt.crackedBonus = matchedOld.crackedBonus;
                  if (matchedOld.crackedRank) nt.crackedRank = matchedOld.crackedRank;
                }
              });
              localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(newTeams));
              localStorage.setItem(STORAGE_KEY_BACKUP, JSON.stringify(newTeams));
              return newTeams;
            }
          } catch (me) {}
        }
      }
    } catch (e) {
      console.warn('Failed to parse teams from storage, checking secondary backup.', e);
      try {
        const backup = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_BACKUP) : null;
        if (backup) return JSON.parse(backup);
      } catch (be) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_TEAMS));
  }

  saveTeams(lastAction = null) {
    try {
      if (typeof localStorage !== 'undefined') {
        const json = JSON.stringify(this.teams);
        localStorage.setItem(STORAGE_KEY_TEAMS, json);
        localStorage.setItem(STORAGE_KEY_BACKUP, json);
      }
      this.lastAction = lastAction;
      this.broadcast({
        type: 'STATE_UPDATE',
        teams: this.teams,
        logs: this.logs,
        lastAction: this.lastAction
      });
    } catch (e) {
      console.error('Error saving teams to storage', e);
    }
  }

  exportDatabase() {
    const data = {
      app: 'SIS 2026 Engagement Portal',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      teams: this.teams,
      logs: this.logs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `sis-2026-database-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.addLog('Database backup exported to JSON');
  }

  importDatabase(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.teams)) {
        throw new Error('Invalid database format. Must contain squads array.');
      }
      this.teams = data.teams;
      if (Array.isArray(data.logs)) {
        this.logs = data.logs;
        this.saveLogs();
      }
      this.saveTeams({ type: 'DATABASE_IMPORT' });
      this.addLog(`Database restored from backup (${this.teams.length} squads loaded)`);
      this.notify({ type: 'DATABASE_IMPORT' });
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  }

  loadLogs() {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_LOGS) : null;
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: Date.now(), text: 'SIS Core Engine online. High-availability telemetry active.', time: new Date().toLocaleTimeString() }
    ];
  }

  saveLogs() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.logs.slice(0, 30)));
      }
    } catch (e) {}
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyLocally() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  notify(lastAction = null) {
    this.lastAction = lastAction;
    this.notifyLocally();
  }

  getLastAction() {
    return this.lastAction;
  }

  getTeams() {
    // Sorted descending by score, tie-break by name
    return [...this.teams].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });
  }

  getTeamById(id) {
    return this.teams.find(t => t.id === id);
  }

  addTeam(name) {
    if (!name || !name.trim()) return;
    const cleanName = name.trim().toUpperCase();
    const id = 'team-' + Date.now();
    const newTeam = {
      id,
      name: cleanName,
      score: 0,
      codeCracked: false,
      color: '#E4E4E7'
    };
    this.teams.push(newTeam);
    this.addLog(`Commissioned new squad: ${cleanName}`);
    this.saveTeams({ type: 'ADD_TEAM', teamId: id });
    this.notify({ type: 'ADD_TEAM', teamId: id });
    return newTeam;
  }

  removeTeam(id) {
    const team = this.getTeamById(id);
    if (!team) return;
    this.teams = this.teams.filter(t => t.id !== id);
    this.addLog(`Decommissioned squad: ${team.name}`);
    this.saveTeams({ type: 'REMOVE_TEAM', teamId: id });
    this.notify({ type: 'REMOVE_TEAM', teamId: id });
  }

  adjustScore(id, delta, reason = 'Operator adjustment') {
    const team = this.getTeamById(id);
    if (!team) return;
    team.score = Math.max(0, team.score + delta);
    const prefix = delta >= 0 ? `+${delta}` : `${delta}`;
    this.addLog(`${team.name} updated: ${prefix} PTS (${reason})`);
    const action = { type: 'ADJUST_SCORE', teamId: id, delta, newScore: team.score };
    this.saveTeams(action);
    this.notify(action);
  }

  setScore(id, newScore) {
    const team = this.getTeamById(id);
    if (!team) return;
    team.score = Math.max(0, Number(newScore) || 0);
    this.addLog(`${team.name} score set to ${team.score} PTS`);
    const action = { type: 'SET_SCORE', teamId: id, newScore: team.score };
    this.saveTeams(action);
    this.notify(action);
  }

  getNextCipherBonus() {
    const crackedCount = this.teams.filter(t => t.codeCracked).length;
    return Math.max(50, 100 - (crackedCount * 5));
  }

  crackCode(teamId, customBonus = null) {
    const team = this.getTeamById(teamId);
    if (!team) return false;
    const bonus = customBonus !== null ? customBonus : this.getNextCipherBonus();
    const crackedOrder = this.teams.filter(t => t.codeCracked).length + 1;
    team.codeCracked = true;
    team.crackedBonus = bonus;
    team.crackedRank = crackedOrder;
    team.score += bonus;
    const nextBounty = this.getNextCipherBonus();
    this.addLog(`[OVERRIDE #${crackedOrder}] ${team.name} cracked cipher! Awarded +${bonus} PTS (Next bounty: +${nextBounty} PTS)`);
    const action = { type: 'CRACK_CODE', teamId: team.id, bonus, nextBounty };
    this.saveTeams(action);
    this.notify(action);
    return bonus;
  }

  triggerRemoteWarp(teamId, bonus = null) {
    const awardBonus = bonus || this.getNextCipherBonus();
    this.broadcast({ type: 'TRIGGER_WARP', teamId, bonus: awardBonus });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sis-remote-warp', { detail: { teamId, bonus: awardBonus } }));
    }
  }

  resetScores() {
    this.teams.forEach(t => {
      t.score = 0;
      t.codeCracked = false;
      delete t.crackedBonus;
      delete t.crackedRank;
    });
    this.addLog('All squad standings reset to 0 PTS (Cipher bounty restored to 100 PTS)');
    const action = { type: 'RESET_SCORES' };
    this.saveTeams(action);
    this.notify(action);
  }

  resetToDefaults() {
    this.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
    this.logs = [];
    this.addLog('System factory restored to 15 default squads');
    this.saveLogs();
    const action = { type: 'FACTORY_RESET' };
    this.saveTeams(action);
    this.notify(action);
  }

  getActiveView() {
    return this.activeView;
  }

  setActiveView(view) {
    this.activeView = view;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY_VIEW, view);
    }
    this.notify();
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = !!enabled;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SOUND, String(this.soundEnabled));
    }
    this.notify();
  }

  getLogs() {
    return this.logs;
  }

  addLog(text) {
    const entry = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    this.logs.unshift(entry);
    this.saveLogs();
  }
}

export const store = new StateStore();
