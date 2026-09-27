const stages = ['New inquiry', 'Contacted', 'Viewing scheduled', 'Offer in progress'];
const deals = [
  { id: 1, name: 'Daniel Torres', property: '3BR condo', value: 5800000, stage: 0, source: 'Website inquiry', email: 'daniel.torres@example.com', phone: '0917-555-0101', next: 'Send available 3BR options', due: 'Today', urgent: true, notes: 'Interested in units near the business district.' },
  { id: 2, name: 'Mia Delgado', property: '3BR house', value: 7200000, stage: 0, source: 'Facebook', email: 'mia.delgado@example.com', phone: '0917-555-0120', next: 'Confirm budget and preferred area', due: 'Tomorrow', urgent: false, notes: 'Looking for a move-in ready home.' },
  { id: 3, name: 'Bianca Flores', property: '2BR apartment', value: 4200000, stage: 1, source: 'Referral', email: 'bianca.flores@example.com', phone: '0917-555-0108', next: 'Check pet policy', due: 'Today', urgent: true, notes: 'Needs a pet-friendly property.' },
  { id: 4, name: 'Andrea Cruz', property: 'Townhouse', value: 6700000, stage: 1, source: 'Instagram', email: 'andrea.cruz@example.com', phone: '0917-555-0104', next: 'Share payment details', due: 'This week', urgent: false, notes: 'Asked about payment options.' },
  { id: 5, name: 'Joshua Aquino', property: '3BR condo', value: 6100000, stage: 2, source: 'Website inquiry', email: 'joshua.aquino@example.com', phone: '0917-555-0113', next: 'Confirm Friday viewing', due: 'Today', urgent: true, notes: 'Ready for a property viewing.' },
  { id: 6, name: 'Chloe Fernandez', property: 'Studio condo', value: 3400000, stage: 2, source: 'Instagram', email: 'chloe.fernandez@example.com', phone: '0917-555-0118', next: 'Send viewing address and time', due: 'Tomorrow', urgent: false, notes: 'Requested a virtual tour before viewing.' },
  { id: 7, name: 'Adrian Sy', property: 'Investment condo', value: 8900000, stage: 3, source: 'Referral', email: 'adrian.sy@example.com', phone: '0917-555-0119', next: 'Review offer terms', due: 'This week', urgent: false, notes: 'Interested in long-term rental yield.' }
];
const board = document.getElementById('board');
const search = document.getElementById('searchDeals');
const actionOnly = document.getElementById('actionOnly');
const detailDialog = document.getElementById('dealDialog');
const detailContent = document.getElementById('detailContent');
const addDialog = document.getElementById('addDialog');
let selectedId = null;
const money = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);
const el = (tag, cls, value) => { const node = document.createElement(tag); if (cls) node.className = cls; if (value !== undefined) node.textContent = value; return node; };
function render() {
  const term = search.value.trim().toLowerCase();
  const visible = deals.filter((d) => (!actionOnly.checked || d.urgent) && (!term || [d.name, d.property, d.source, d.next].some((v) => v.toLowerCase().includes(term))));
  board.replaceChildren();
  stages.forEach((stageName, index) => {
    const stageDeals = visible.filter((d) => d.stage === index);
    const section = el('section', 'stage');
    const head = el('div', 'stage-head');
    const title = el('div', 'stage-title');
    title.append(el('strong', '', stageName), el('span', '', String(stageDeals.length)));
    head.append(title, el('span', 'stage-value', money(stageDeals.reduce((sum, d) => sum + d.value, 0))));
    section.append(head);
    if (!stageDeals.length) section.append(el('div', 'empty', 'No matching deals'));
    stageDeals.forEach((d) => {
      const card = el('button', 'deal-card'); card.type = 'button';
      card.setAttribute('aria-label', `Open ${d.name}, ${d.property}, ${stageName}`);
      card.append(el('strong', '', `${d.property} · ${d.name}`), el('span', 'value', money(d.value)), el('span', 'person', `${d.name} · ${d.source}`));
      const activity = el('span', `activity${d.urgent ? ' urgent' : ''}`);
      activity.append(el('span', 'act-dot'), el('span', '', `${d.next} · ${d.due}`));
      card.append(activity); card.addEventListener('click', () => showDeal(d.id)); section.append(card);
    });
    board.append(section);
  });
  document.getElementById('dealCount').textContent = String(deals.length);
  document.getElementById('pipelineValue').textContent = money(deals.reduce((sum, d) => sum + d.value, 0));
  document.getElementById('actionCount').textContent = String(deals.filter((d) => d.urgent).length);
  document.getElementById('viewCount').textContent = `${visible.length} of ${deals.length} deals shown`;
}
function row(label, value) { const r = el('div', 'detail-row'); r.append(el('span', '', label), el('span', '', value)); return r; }
function showDeal(id) {
  const d = deals.find((item) => item.id === id); if (!d) return; selectedId = id;
  detailContent.replaceChildren();
  detailContent.append(el('h2', 'detail-title', `${d.property} · ${d.name}`), el('div', 'detail-value', money(d.value)), el('span', 'detail-stage', stages[d.stage]));
  const contact = el('section', 'detail-section'); contact.append(el('h3', '', 'CONTACT & PROPERTY'), row('Contact', d.name), row('Email', d.email), row('Phone', d.phone), row('Property', d.property), row('Lead source', d.source));
  const next = el('section', 'detail-section'); next.append(el('h3', '', 'NEXT ACTIVITY'), row('Task', d.next), row('Due', d.due));
  const notes = el('section', 'detail-section'); notes.append(el('h3', '', 'NOTES'), el('p', 'detail-notes', d.notes));
  const actions = el('div', 'detail-actions');
  const close = el('button', 'secondary-button', 'Close'); close.type = 'button'; close.addEventListener('click', () => detailDialog.close()); actions.append(close);
  if (d.stage < stages.length - 1) {
    const advance = el('button', 'primary-button', `Move to ${stages[d.stage + 1]}`); advance.type = 'button';
    advance.addEventListener('click', () => { d.stage += 1; d.urgent = false; render(); showDeal(id); }); actions.append(advance);
  }
  detailContent.append(contact, next, notes, actions);
  if (!detailDialog.open) detailDialog.showModal();
}
search.addEventListener('input', render);
actionOnly.addEventListener('change', render);
document.getElementById('addDeal').addEventListener('click', () => addDialog.showModal());
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
for (const dialog of [detailDialog, addDialog]) dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
document.getElementById('addForm').addEventListener('submit', (event) => {
  event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
  deals.unshift({ id: Date.now(), name: String(data.get('name')).trim(), property: String(data.get('property')).trim(), value: Number(data.get('value')), stage: 0, source: String(data.get('source')), email: 'sample@example.com', phone: '—', next: String(data.get('next')).trim(), due: 'To schedule', urgent: false, notes: 'New sample deal added in this browser tab.' });
  form.reset(); search.value = ''; actionOnly.checked = false; addDialog.close(); render();
});
render();
