// fx/pieces/swarf.js — lock swarf (SPEC-ADDENDUM A2.1.1, A2.7.3; Phase C). OWNER: WP12.
// Each cryptex lock sheds TIER_PARAMS.fx.swarf motes (T3/T2 900, T2 phone 400, T1 300) from that stratum's gap edges:
// ballistic, 0.15 m/s tangential to the spin, gravity 2 m/s² at Key scale, drag 1.2/s, --silver at 0.4, fading over
// 1,400 ms; they hang in the ПАУЗА (world time) and the wave's near shell blows them outward. No dust → nothing.
import { quality } from '../../core/quality.js';

export function swarf(F, stratum) {
  const n = (quality.params && quality.params.fx && quality.params.fx.swarf) || 0;
  if (!n || !(stratum >= 0 && stratum < 7)) return;
  F.dust.emitter('swarf', { stratum: stratum | 0, count: n });
}
