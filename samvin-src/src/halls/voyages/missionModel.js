// halls/voyages/missionModel.js — SEED (owner WP6) written by WP0: the shared mission model (ARCH §3.19, §3.11.4, §4.3.4,
// SPEC §6.3). Functionally correct: WP11 (T0), the V data ring and worldCounts() consume it before WP6 lands. WP6 may
// rewrite it but must keep the results identical for the same inputs.
import { state, saveSoon } from '../../core/state.js';
import { daysBetween } from '../../core/time.js';
import { plural } from '../../core/ru.js';
import { bus } from '../../core/bus.js';
import { status } from '../../ui/status.js';
import { WORLD } from '../../data/world.js';

const LABEL = { done: 'ЗАВЕРШЕНА', active: 'В ПУТИ', new: 'НОВАЯ', sealed: 'ЗАПЕЧАТАНА' };

function percent(m) {
  const D = m.decodeDays != null ? m.decodeDays : m.unlockAtDays;
  if (m.status !== 'locked' || !D) return null;
  return Math.min(100, Math.round((100 * state.distinctDays) / D));
}

/** @typedef {{ code, title, state:'done'|'active'|'new'|'locked'|'sealed', label, p:number|null, numberShown:string,
 *   lockedText:string|null, decodeReady:boolean, probe:'none'|'out'|'back', canProbe:boolean, mission:Object }} MissionView */
/** Effective view of a mission: sealed → new once NADIR is open; locked → new at p = 100. */
export function missionView(mission) {
  const m = mission;
  const d = state.data || {};
  let st = m.status;
  const p = percent(m);
  if (st === 'sealed' && d.nadirOpen) st = 'new';
  if (st === 'locked' && p === 100) st = 'new';
  let lockedText = null;
  if (st === 'locked') {
    if (m.decodeDays != null) lockedText = 'Расшифровка идёт. Возвращайся завтра — будет больше.';
    else {
      const n = Math.max(1, m.unlockAtDays - state.distinctDays);
      lockedText = `Откроется через ${n} ${plural(n, 'день', 'дня', 'дней')}.`;
    }
  } else if (st === 'sealed') lockedText = 'Ключ к ней — в самом низу.';
  const decoded = Array.isArray(d.decoded) ? d.decoded : [];
  const probe = probeStatus(m.code);
  return {
    code: m.code,
    title: m.title,
    state: st,
    label: st === 'locked' ? `СИГНАЛ ЗАШИФРОВАН ${p}%` : LABEL[st],
    p: m.status === 'locked' ? p : null,
    numberShown: st === 'locked' ? '0??' : m.code,
    lockedText,
    decodeReady: m.status === 'locked' && p === 100 && !decoded.includes(m.code),
    probe,
    canProbe: (st === 'done' || st === 'active' || st === 'new') && probe === 'none',
    mission: m,
  };
}

/** → 'none' | 'out' | 'back' */
export function probeStatus(code) {
  const pr = state.data && state.data.probes ? state.data.probes[code] : null;
  if (!pr) return 'none';
  return pr.back ? 'back' : 'out';
}

/** probes[code] = {sent: today, back: false}; status 'probe.sent'; 'probe:sent'. → boolean */
export function sendProbe(code) {
  const m = WORLD.missions.find((x) => x.code === code);
  if (!m || !missionView(m).canProbe) return false;
  state.data.probes[code] = { sent: state.today, back: false };
  saveSoon();
  status.say('probe.sent', { code });
  bus.emit('probe:sent', { code });
  return true;
}

/** Probes sent before today and not back → back = true. → codes (caller shows status/visuals, emits 'probe:back'). */
export function collectReturnedProbes() {
  const out = [];
  const probes = (state.data && state.data.probes) || {};
  for (const code of Object.keys(probes)) {
    const pr = probes[code];
    if (pr && !pr.back && typeof pr.sent === 'string' && daysBetween(pr.sent, state.today) > 0) { pr.back = true; out.push(code); }
  }
  if (out.length) saveSoon();
  return out;
}

/** Locked missions whose p reached 100 and are not yet in state.decoded → added. → codes (caller plays the live decode). */
export function collectDecoded() {
  const out = [];
  if (!state.data) return out;
  for (const m of WORLD.missions) {
    if (m.status === 'locked' && percent(m) === 100 && !state.data.decoded.includes(m.code)) {
      state.data.decoded.push(m.code);
      out.push(m.code);
    }
  }
  if (out.length) saveSoon();
  return out;
}
