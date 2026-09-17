export const GAME_MODES = [
  { id: 'multiple', label: 'Scelta multipla', hint: 'Indovina la provincia tra 4 opzioni' },
  { id: 'free', label: 'Risposta libera', hint: 'Scrivi la provincia con suggerimenti live' },
  { id: 'region', label: 'Regione sulla mappa', hint: 'Tocca la regione giusta sulla cartina' },
];

export const MODE_LABELS = Object.fromEntries(GAME_MODES.map((m) => [m.id, m.label]));
