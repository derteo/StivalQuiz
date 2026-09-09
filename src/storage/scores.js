import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = '@province_game/best_score';

export async function getBestScore() {
  const raw = await AsyncStorage.getItem(BEST_SCORE_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export async function saveScore(score) {
  const currentBest = await getBestScore();
  const isNewBest = score > currentBest;
  const bestScore = isNewBest ? score : currentBest;
  await AsyncStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  return { bestScore, isNewBest };
}
