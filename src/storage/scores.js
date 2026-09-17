import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = '@province_game/best_score';
const HISTORY_KEY = '@province_game/history';

export async function getBestScore() {
  const raw = await AsyncStorage.getItem(BEST_SCORE_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export async function getHistory() {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveGameResult(result) {
  const currentBest = await getBestScore();
  const isNewBest = result.score > currentBest;
  const bestScore = isNewBest ? result.score : currentBest;

  const history = await getHistory();
  const updatedHistory = [result, ...history].slice(0, 20);

  await Promise.all([
    AsyncStorage.setItem(BEST_SCORE_KEY, String(bestScore)),
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory)),
  ]);

  return { bestScore, isNewBest };
}

export async function getLastResult() {
  const history = await getHistory();
  return history[0] ?? null;
}

export async function getModeStats() {
  const history = await getHistory();
  const totals = {};

  for (const entry of history) {
    const mode = entry.mode ?? 'multiple';
    if (!totals[mode]) totals[mode] = { correct: 0, total: 0 };
    totals[mode].correct += entry.score;
    totals[mode].total += entry.total;
  }

  return Object.entries(totals).map(([mode, { correct, total }]) => ({
    mode,
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));
}
