// secrets/registry.js — the fourteen secrets (ARCH §3.14.1, SPEC §8.1). Complete; nobody else edits it.
// `line` is the shard-line template: {p} = foundVars.S03.p, {freq} = WORLD.clan.frequency (2 decimals),
// {name} = WORLD.companion.name. hintRoom: a RoomId, 'CURRENT' (= app.room) or null (time-gated / none).

/** @typedef {{ id:string, name:string, where:string, note:string, line:string, hintRoom:string|null, timeGated:boolean }} Secret */
const S = (id, name, where, note, line, hintRoom, timeGated = false) => Object.freeze({ id, name, where, note, line, hintRoom, timeGated });

export const SECRETS = Object.freeze([
  S('S01', 'РЕЗОНАНС', 'CORE', 'G4', 'Песок написал имя.', 'CORE'),
  S('S02', 'БЕСКОНЕЧНОСТЬ', 'CORE', 'A4', 'Ты всё ещё внутри SAM.VIN.', 'CORE'),
  S('S03', 'ГОЛОВОКРУЖЕНИЕ', 'CORE', 'B4', 'Ключ закружился на {p}%.', 'CORE'),
  S('S04', 'АККОРД', 'MEMBERS', 'D5', 'Весь клан прозвучал вместе.', 'MEMBERS'),
  S('S05', 'ПОЗЫВНОЙ', 'anywhere', 'E5', 'Система узнала тебя.', 'CORE'),
  S('S06', 'МАСТЕРСКАЯ', 'MEMBERS', 'G5', 'Твой знак вырезан.', 'MEMBERS'),
  S('S07', 'КИТ', 'any hall', 'A5', 'Ты видел кита.', null, true),
  S('S08', 'ИЗНАНКА', 'CORE', 'B5', 'Ты видел изнанку.', 'CORE'),
  S('S09', 'ДРОН', 'any hall', 'D6', 'Ты поймал дрона.', 'CURRENT'),
  S('S10', 'НОЧЬ', 'any', 'E6', 'Ты видел, как VIN спит.', null, true),
  S('S11', 'ЧАСТОТА', 'SIGNAL', 'G6', 'Тайная частота: {freq}.', 'SIGNAL'),
  S('S12', 'КАПСУЛА', 'INSIGNIA', 'A6', 'Капсула открылась.', null, true),
  S('S13', 'ЗЕНИТ', 'navigator', 'B6', 'Ты был над всем.', 'ZENITH'),
  S('S14', 'СПУТНИК', 'CORE', 'D7', '{name} прилетела и осталась.', null, true),
]);

export const HINT_ORDER = Object.freeze(['S01', 'S03', 'S04', 'S02', 'S06', 'S09', 'S08', 'S11', 'S13', 'S05']);
export const TIME_GATED = Object.freeze(['S07', 'S10', 'S12', 'S14']);

const BY_ID = new Map(SECRETS.map((s) => [s.id, s]));
/** → Secret | null */
export function secretById(id) { return BY_ID.get(id) || null; }
