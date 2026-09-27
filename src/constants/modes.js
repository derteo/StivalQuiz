export const GAME_MODES = [
  { id: 'multiple', label: 'Scelta multipla', hint: 'Indovina la provincia tra 4 opzioni' },
  { id: 'free', label: 'Risposta libera', hint: 'Scrivi la provincia con suggerimenti live' },
  { id: 'region', label: 'Regione sulla mappa', hint: 'Tocca la regione giusta sulla cartina' },
  {
    id: 'minorComuni',
    label: 'Comuni minori',
    hint: 'Scegli una regione e colloca i comuni minori nelle province giuste',
  },
];

export const MODE_LABELS = Object.fromEntries(GAME_MODES.map((m) => [m.id, m.label]));

// Etichetta da mostrare per un risultato salvato: aggiunge il prefisso/suffisso
// Showdown quando la partita è stata giocata in modalità sopravvivenza.
export function displayModeLabel(mode, showdown) {
  const base = MODE_LABELS[mode] ?? 'Scelta multipla';
  return showdown ? `🔥 ${base} (Showdown)` : base;
}
