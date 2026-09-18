import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FreeTextAnswer from '../components/FreeTextAnswer';
import ItalyRegionMap from '../components/ItalyRegionMap';
import MultipleChoiceAnswer from '../components/MultipleChoiceAnswer';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../hooks/useGame';
import { saveGameResult } from '../storage/scores';

export default function GameScreen({ route, navigation }) {
  const { mode } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentCity, options, questionIndex, totalQuestions, score, status, selected, answers, answer, next } =
    useGame(mode);

  useEffect(() => {
    if (status !== 'finished') return;
    let cancelled = false;

    saveGameResult({ score, total: totalQuestions, date: new Date().toISOString(), mode }).then(
      ({ bestScore, isNewBest }) => {
        if (!cancelled) {
          navigation.replace('Results', { score, total: totalQuestions, bestScore, isNewBest, mode, answers });
        }
      }
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!currentCity || status === 'finished') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <View style={styles.hud}>
        <Text style={[styles.hudText, { color: colors.textSubtle }]}>
          Domanda {questionIndex + 1}/{totalQuestions}
        </Text>
        <Text style={[styles.hudText, { color: colors.textSubtle }]}>Punteggio: {score}</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={[styles.questionLabel, { color: colors.textMuted }]}>
          {mode === 'region' ? 'In quale regione si trova' : 'In quale provincia si trova'}
        </Text>
        <Text style={[styles.cityName, { color: colors.primaryDark }]}>{currentCity.city}?</Text>
      </View>

      {mode === 'multiple' && (
        <MultipleChoiceAnswer
          options={options}
          correctProvince={currentCity.province}
          status={status}
          selected={selected}
          onAnswer={answer}
        />
      )}
      {mode === 'free' && (
        <FreeTextAnswer
          key={currentCity.city}
          correctProvince={currentCity.province}
          status={status}
          selected={selected}
          onSubmit={answer}
        />
      )}
      {mode === 'region' && (
        <ItalyRegionMap correctRegion={currentCity.region} status={status} selected={selected} onSelect={answer} />
      )}

      {status === 'answered' && (
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={next}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextButtonText, { color: colors.buttonText }]}>
            {questionIndex + 1 >= totalQuestions ? 'Vedi risultato' : 'Avanti'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  hud: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  hudText: { fontSize: 15, fontWeight: '600' },
  questionBox: { alignItems: 'center', marginBottom: 40 },
  questionLabel: { fontSize: 16, marginBottom: 6 },
  cityName: { fontSize: 34, fontWeight: '800', textAlign: 'center' },
  nextButton: { marginTop: 32, alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
  nextButtonText: { fontSize: 16, fontWeight: '700' },
});
