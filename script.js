// Opening hours in 24h time. Update these and the hours table, today bar and open/closed dot all follow.
// Index 0 = Sunday. Each day lists one or more [open, close] ranges; an empty list means closed.
const HOURS = [
  { day: 'Sunday',    ranges: [] },
  { day: 'Monday',    ranges: [['11:00', '18:30']] },
  { day: 'Tuesday',   ranges: [['11:00', '18:30']] },
  { day: 'Wednesday', ranges: [['11:00', '18:30']] },
  { day: 'Thursday',  ranges: [['11:00', '18:30']] },
  { day: 'Friday',    ranges: [['11:00', '12:45'], ['14:15', '18:30']] },
  { day: 'Saturday',  ranges: [['11:30', '17:00']] },
];

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

function formatRanges(entry, separator) {
  if (!entry.ranges.length) return 'Closed';
  return entry.ranges.map(([open, close]) => `${formatTime(open)} – ${formatTime(close)}`).join(separator);
}

function renderHours() {
  const now = new Date();
  const todayIndex = now.getDay();
  const today = HOURS[todayIndex];

  const table = document.getElementById('hours-table');
  // Show Monday first.
  const order = [1, 2, 3, 4, 5, 6, 0];
  table.innerHTML = order.map((i) => {
    const entry = HOURS[i];
    const cls = i === todayIndex ? ' class="today"' : '';
    return `<tr${cls}><td>${entry.day}</td><td>${formatRanges(entry, '<br>')}</td></tr>`;
  }).join('');

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const current = today.ranges.find(([open, close]) => minutesNow >= toMinutes(open) && minutesNow < toMinutes(close));
  const next = today.ranges.find(([open]) => minutesNow < toMinutes(open));

  let text;
  if (current) {
    text = `Open now · until ${formatTime(current[1])}`;
  } else if (next) {
    text = `Closed now · opens at ${formatTime(next[0])}`;
  } else {
    text = today.ranges.length ? 'Closed for today' : 'Closed today';
  }

  document.getElementById('open-status').classList.add(current ? 'open' : 'closed');
  document.getElementById('today-hours').textContent = text;
}

function setupMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tabs [role="tab"]');
  const panels = document.querySelectorAll('.menu-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      panels.forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
    });
  });
}

renderHours();
setupMenuTabs();
document.getElementById('year').textContent = new Date().getFullYear();
