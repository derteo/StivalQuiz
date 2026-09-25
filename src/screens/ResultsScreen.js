import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SURVIVAL_COLORS } from '../constants/survivalTheme';
import { useTheme } from '../context/ThemeContext';

function getFeedback(ratio) {
  if (ratio === 1) return 'Perfetto! Conosci l\'Italia a memoria 🇮🇹';
  if (ratio >= 0.7) return 'Ottimo risultato!';
  if (ratio >= 0.4) return 'Non male, puoi migliorare!';
  return 'Riprova, la geografia si allena!';
}

function getShowdownFeedback(score) {
  if (score >= 30) return 'Leggendario. Conosci l\'Italia a memoria 🏆';
  if (score >= 15) return 'Impressionante sopravvivenza!';
  if (score >= 5) return 'Bel tentativo, puoi fare di meglio!';
  return 'La prima città è sempre la più dura. Riprova!';
}

export default function ResultsScreen({ route, navigation }) {
  const { score, total, bestScore, mode, region, answers } = route.params;
  const { colors: themeColors } = useTheme();
  const isShowdown = mode === 'showdown';
  const colors = isShowdown ? SURVIVAL_COLORS : themeColors;
  const ratio = total > 0 ? score / total : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {isShowdown ? '💀 Sei sopravvissuto...' : 'Round completato'}
      </Text>
      {region && <Text style={[styles.regionLabel, { color: colors.textMuted }]}>Regione: {region}</Text>}

      <View style={[styles.scoreBox, { backgroundColor: colors.card }]}>
        {isShowdown ? (
          <>
            <Text style={[styles.scoreValue, { color: colors.primaryDark }]}>{score}</Text>
            <Text style={[styles.feedback, { color: colors.textSubtle }]}>città di fila corrette</Text>
            <Text style={[styles.feedback, { color: colors.textSubtle, marginTop: 6 }]}>
              {getShowdownFeedback(score)}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.scoreValue, { color: colors.primaryDark }]}>
              {score}/{total}
            </Text>
            <Text style={[styles.feedback, { color: colors.textSubtle }]}>{getFeedback(ratio)}</Text>
          </>
        )}
      </View>

      <Text style={[styles.bestScoreText, { color: colors.textMuted }]}>Miglior punteggio: {bestScore}</Text>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.replace('Game', { mode, region })}
        activeOpacity={0.85}
      >
        <Text style={[styles.primaryButtonText, { color: colors.buttonText }]}>Gioca ancora</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryOutlineButton, { borderColor: colors.border }]}
        onPress={() => navigation.navigate('Report', { answers, mode })}
        activeOpacity={0.85}
      >
        <Text style={[styles.secondaryOutlineButtonText, { color: colors.text }]}>Rivedi le risposte</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.popToTop()} activeOpacity={0.7}>
        <Text style={[styles.secondaryButtonText, { color: colors.textSubtle }]}>Torna alla home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  regionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 24 },
  scoreBox: { borderRadius: 20, paddingVertical: 28, paddingHorizontal: 48, alignItems: 'center', marginBottom: 20 },
  scoreValue: { fontSize: 44, fontWeight: '800', marginBottom: 8 },
  feedback: { fontSize: 15, textAlign: 'center' },
  bestScoreText: { fontSize: 14, marginBottom: 36 },
  primaryButton: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30, marginBottom: 14, width: '100%', alignItems: 'center' },
  primaryButtonText: { fontSize: 17, fontWeight: '700' },
  secondaryOutlineButton: {
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  secondaryOutlineButtonText: { fontSize: 16, fontWeight: '700' },
  secondaryButton: { paddingVertical: 10 },
  secondaryButtonText: { fontSize: 15, fontWeight: '600' },
});
