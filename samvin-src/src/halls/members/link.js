// halls/members/link.js — the one shared handle between MEMBERS and WORKSHOP (both WP5): the operator capital's iris
// (SPEC §6.2.1 «its segments rotate 50° outward») and its render-space point, set by the MEMBERS hall while it is
// resident, read by the WORKSHOP entry path and the ОТПЕЧАТОК docking. null when MEMBERS is not built.
export const link = {
  /** (open01:number) => void */
  iris: null,
  /** (out:Vector3) => Vector3|null — his capital centre, render space */
  capital: null,
};
