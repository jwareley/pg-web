/* Single source of truth for the current beta stage. */
const BETA_STAGE = "Stage 1";
// Update these two dates when the official beta window is confirmed.
const BETA_START = "2026-09-01";
const BETA_END = "2026-09-30";
const startDate = new Date(`${BETA_START}T00:00:00`);
const endDate = new Date(`${BETA_END}T23:59:59`);
const today = new Date();
const daysRemaining = Math.max(0, Math.ceil((endDate - today) / 86400000));
const dateFormat = new Intl.DateTimeFormat("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
const betaWindow = `${dateFormat.format(startDate)} – ${dateFormat.format(endDate)}`;
const stageBadge = document.createElement("div");
stageBadge.className = "beta-stage-badge";
stageBadge.innerHTML = `<span>BETA · ${BETA_STAGE}</span><span>${betaWindow}</span><strong>${daysRemaining} days remaining</strong>`;
stageBadge.setAttribute("aria-label", `Beta testing ${BETA_STAGE}, ${betaWindow}, ${daysRemaining} days remaining`);
document.body.appendChild(stageBadge);
