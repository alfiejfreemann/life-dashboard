// ================================================================
// Alfie Life Dashboard — Scriptable Widget
// ================================================================
// SETUP:
// 1. Download "Scriptable" from the App Store (free)
// 2. Open Scriptable → tap "+" → paste this entire file
// 3. Name it "Life Dashboard"
// 4. Replace DASHBOARD_URL below with your actual Vercel URL
// 5. Long press home screen → Add Widget → Scriptable
//    Select "Life Dashboard" — available in all 3 sizes
// ================================================================

const DASHBOARD_URL = "https://your-app.vercel.app" // ← UPDATE THIS

// ── Colours ─────────────────────────────────────────────────────
const C = {
  bg: new Color("#0d0d0d"),
  card: new Color("#111111"),
  border: new Color("#1a1a1a"),
  cyan: new Color("#00f5ff"),
  green: new Color("#00ff88"),
  orange: new Color("#ff6b35"),
  purple: new Color("#a855f7"),
  red: new Color("#ff4757"),
  white: new Color("#ffffff"),
  gray: new Color("#666666"),
  darkGray: new Color("#333333"),
}

// ── Hyrox countdown ─────────────────────────────────────────────
function getDaysToRace() {
  const raceDate = new Date("2026-07-19T00:00:00")
  const today = new Date()
  return Math.ceil((raceDate - today) / (1000 * 60 * 60 * 24))
}

function getWeeksAndDays(days) {
  return { weeks: Math.floor(days / 7), days: days % 7 }
}

// ── Widget sizes ─────────────────────────────────────────────────
const size = config.widgetFamily

if (size === "small") {
  Script.setWidget(buildSmall())
} else if (size === "medium") {
  Script.setWidget(buildMedium())
} else {
  Script.setWidget(buildLarge())
}

Script.complete()

// ── Small widget: Hyrox countdown + 1 key stat ──────────────────
function buildSmall() {
  const w = new ListWidget()
  w.backgroundColor = C.bg
  w.setPadding(14, 14, 14, 14)
  w.url = DASHBOARD_URL + "/training"

  const daysLeft = getDaysToRace()
  const { weeks, days } = getWeeksAndDays(daysLeft)

  // Header
  const header = w.addText("HYROX SYDNEY")
  header.textColor = C.cyan
  header.font = Font.boldSystemFont(9)
  header.textOpacity = 0.8

  w.addSpacer(6)

  // Countdown
  const countStack = w.addStack()
  countStack.layoutHorizontally()
  countStack.centerAlignContent()

  const weeksText = countStack.addText(`${weeks}`)
  weeksText.textColor = C.white
  weeksText.font = Font.boldSystemFont(36)

  const wLabel = countStack.addText("w")
  wLabel.textColor = C.cyan
  wLabel.font = Font.boldSystemFont(18)

  countStack.addSpacer(4)

  const daysText = countStack.addText(`${days}`)
  daysText.textColor = C.gray
  daysText.font = Font.boldSystemFont(24)

  const dLabel = countStack.addText("d")
  dLabel.textColor = C.gray
  dLabel.font = Font.boldSystemFont(14)

  w.addSpacer(4)

  const target = w.addText("TARGET: SUB-60")
  target.textColor = C.orange
  target.font = Font.boldSystemFont(10)

  w.addSpacer(8)

  // Date line
  const dateLine = w.addText("19 July 2026")
  dateLine.textColor = C.gray
  dateLine.font = Font.systemFont(9)

  return w
}

// ── Medium widget: countdown + 3 key stats + habit count ────────
function buildMedium() {
  const w = new ListWidget()
  w.backgroundColor = C.bg
  w.setPadding(14, 16, 14, 16)
  w.url = DASHBOARD_URL

  const daysLeft = getDaysToRace()
  const { weeks, days } = getWeeksAndDays(daysLeft)

  // Top row
  const topRow = w.addStack()
  topRow.layoutHorizontally()
  topRow.centerAlignContent()

  // Left: countdown
  const countSection = topRow.addStack()
  countSection.layoutVertically()

  const hyroxLabel = countSection.addText("HYROX SYDNEY")
  hyroxLabel.textColor = C.cyan
  hyroxLabel.font = Font.boldSystemFont(9)

  countSection.addSpacer(2)

  const countRow = countSection.addStack()
  countRow.layoutHorizontally()
  countRow.centerAlignContent()

  const wNum = countRow.addText(`${weeks}`)
  wNum.textColor = C.white
  wNum.font = Font.boldSystemFont(28)

  const wL = countRow.addText("w ")
  wL.textColor = C.cyan
  wL.font = Font.boldSystemFont(16)

  const dNum = countRow.addText(`${days}`)
  dNum.textColor = C.gray
  dNum.font = Font.boldSystemFont(22)

  const dL = countRow.addText("d")
  dL.textColor = C.gray
  dL.font = Font.boldSystemFont(14)

  countSection.addSpacer(2)

  const sub = countSection.addText("Target: sub-60min")
  sub.textColor = C.orange
  sub.font = Font.boldSystemFont(9)

  topRow.addSpacer()

  // Right: quick stats
  const statsStack = topRow.addStack()
  statsStack.layoutVertically()
  statsStack.spacing = 4

  addMiniStat(statsStack, "WEIGHT", "80.2 kg", C.white)
  addMiniStat(statsStack, "BODY FAT", "14.2%", C.orange)
  addMiniStat(statsStack, "INCOME/MO", "£1,450", C.green)

  w.addSpacer(10)

  // Bottom row: today's actions
  const bottomLabel = w.addText("TODAY → Train · Hit 200g protein · Zone 2")
  bottomLabel.textColor = C.gray
  bottomLabel.font = Font.systemFont(10)
  bottomLabel.lineLimit = 1

  return w
}

// ── Large widget: full dashboard snapshot ───────────────────────
function buildLarge() {
  const w = new ListWidget()
  w.backgroundColor = C.bg
  w.setPadding(16, 16, 16, 16)
  w.url = DASHBOARD_URL

  const daysLeft = getDaysToRace()
  const { weeks, days } = getWeeksAndDays(daysLeft)

  // Title
  const title = w.addText("ALFIE DASHBOARD")
  title.textColor = C.cyan
  title.font = Font.boldSystemFont(11)

  w.addSpacer(10)

  // Hyrox countdown
  const hyroxCard = w.addStack()
  hyroxCard.layoutHorizontally()
  hyroxCard.centerAlignContent()
  hyroxCard.backgroundColor = new Color("#111111")
  hyroxCard.cornerRadius = 10
  hyroxCard.setPadding(10, 12, 10, 12)

  const countdownLeft = hyroxCard.addStack()
  countdownLeft.layoutVertically()

  const hl = countdownLeft.addText("HYROX SYDNEY")
  hl.textColor = C.cyan
  hl.font = Font.boldSystemFont(9)

  countdownLeft.addSpacer(2)

  const cr = countdownLeft.addStack()
  cr.layoutHorizontally()

  const wt = cr.addText(`${weeks}`)
  wt.textColor = C.white
  wt.font = Font.boldSystemFont(24)

  const wlb = cr.addText("w ")
  wlb.textColor = C.cyan
  wlb.font = Font.boldSystemFont(14)

  const dt = cr.addText(`${days}`)
  dt.textColor = C.gray
  dt.font = Font.boldSystemFont(20)

  const dlb = cr.addText("d")
  dlb.textColor = C.gray
  dlb.font = Font.boldSystemFont(14)

  hyroxCard.addSpacer()

  const targetText = hyroxCard.addText("SUB-60 TARGET")
  targetText.textColor = C.orange
  targetText.font = Font.boldSystemFont(9)

  w.addSpacer(8)

  // Stats grid
  const statsTitle = w.addText("KEY STATS")
  statsTitle.textColor = C.gray
  statsTitle.font = Font.boldSystemFont(8)

  w.addSpacer(4)

  const stats = [
    { label: "Body Weight", value: "80.2 kg", color: C.white },
    { label: "Body Fat %", value: "14.2%", color: C.orange },
    { label: "Online Income", value: "£1,450/mo", color: C.green },
    { label: "Est. Finish", value: "~68:30", color: C.red },
  ]

  for (let i = 0; i < stats.length; i += 2) {
    const row = w.addStack()
    row.layoutHorizontally()
    row.spacing = 8

    for (let j = i; j < Math.min(i + 2, stats.length); j++) {
      const s = stats[j]
      const cell = row.addStack()
      cell.layoutVertically()
      cell.backgroundColor = new Color("#111111")
      cell.cornerRadius = 8
      cell.setPadding(8, 10, 8, 10)

      const val = cell.addText(s.value)
      val.textColor = s.color
      val.font = Font.boldSystemFont(14)

      const lbl = cell.addText(s.label)
      lbl.textColor = C.gray
      lbl.font = Font.systemFont(8)

      if (j === i) row.addSpacer()
    }

    w.addSpacer(6)
  }

  // Today's mission
  w.addSpacer(4)
  const missionTitle = w.addText("TODAY'S MISSION")
  missionTitle.textColor = C.gray
  missionTitle.font = Font.boldSystemFont(8)

  w.addSpacer(4)

  const missions = [
    "⚡ Hyrox station work — Wall Balls + Burpees",
    "🥩 Hit 200g protein (non-negotiable)",
    "🏃 Zone 2 run — 30-45 min, HR 130-145",
  ]

  for (const mission of missions) {
    const m = w.addText(mission)
    m.textColor = C.white
    m.font = Font.systemFont(10)
    m.lineLimit = 1
    w.addSpacer(3)
  }

  return w
}

// ── Helpers ──────────────────────────────────────────────────────
function addMiniStat(stack, label, value, valueColor) {
  const row = stack.addStack()
  row.layoutHorizontally()

  const lbl = row.addText(`${label}: `)
  lbl.textColor = C.gray
  lbl.font = Font.systemFont(9)

  const val = row.addText(value)
  val.textColor = valueColor
  val.font = Font.boldSystemFont(9)
}
