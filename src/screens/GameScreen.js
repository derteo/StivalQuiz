import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FreeTextAnswer from '../components/FreeTextAnswer';
import MultipleChoiceAnswer from '../components/MultipleChoiceAnswer';
import ProvinceMapAnswer from '../components/ProvinceMapAnswer';
import RegionMapAnswer from '../components/RegionMapAnswer';
import { SURVIVAL_COLORS } from '../constants/survivalTheme';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../hooks/useGame';
import { saveGameResult } from '../storage/scores';

export default function GameScreen({ route, navigation }) {
  const { mode, region, showdown = false } = route.params;
  const { colors: themeColors } = useTheme();
  const colors = showdown ? SURVIVAL_COLORS : themeColors;
  const insets = useSafeAreaInsets();
  const {
    currentCity,
    options,
    questionIndex,
    totalQuestions,
    score,
    status,
    selected,
    lastCorrect,
    answers,
    answer,
    next,
  } = useGame(mode, region, showdown);

  useEffect(() => {
    if (status !== 'finished') return;
    let cancelled = false;

    saveGameResult({
      score,
      total: showdown ? score + 1 : totalQuestions,
      date: new Date().toISOString(),
      mode,
      showdown,
    }).then(({ bestScore, isNewBest }) => {
      if (!cancelled) {
        navigation.replace('Results', {
          score,
          total: showdown ? score + 1 : totalQuestions,
          bestScore,
          isNewBest,
          mode,
          region,
          showdown,
          answers,
        });
      }
    });

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

  const roundEnding = showdown ? status === 'answered' && !lastCorrect : questionIndex + 1 >= totalQuestions;
  const colorsProp = showdown ? colors : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <View style={styles.hud}>
        <Text style={[styles.hudText, { color: colors.textSubtle }]}>
          {showdown ? '🔥 Showdown' : `Domanda ${questionIndex + 1}/${totalQuestions}`}
        </Text>
        <Text style={[styles.hudText, { color: colors.textSubtle }]}>
          {showdown ? `Streak: ${score}` : `Punteggio: ${score}`}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.questionBox}>
          <Text style={[styles.questionLabel, { color: colors.textMuted }]}>
            {mode === 'region' ? 'In quale regione si trova' : 'In quale provincia si trova'}
          </Text>
          <Text style={[styles.cityName, { color: colors.primaryDark }]}>{currentCity.city}?</Text>
          {currentCity.minor && (
            <View style={[styles.minorBadge, { backgroundColor: colors.modeActiveBg, borderColor: colors.primary }]}>
              <Text style={[styles.minorBadgeText, { color: colors.primaryDark }]}>
                🏘️ Comune minore · {currentCity.region}
              </Text>
            </View>
          )}
        </View>

        {mode === 'multiple' && (
          <MultipleChoiceAnswer
            options={options}
            correctProvince={currentCity.province}
            status={status}
            selected={selected}
            onAnswer={answer}
            colors={colorsProp}
          />
        )}
        {mode === 'free' && (
          <FreeTextAnswer
            key={currentCity.city}
            correctProvince={currentCity.province}
            status={status}
            selected={selected}
            onSubmit={answer}
            colors={colorsProp}
          />
        )}
        {mode === 'region' && (
          <RegionMapAnswer
            correctRegion={currentCity.region}
            status={status}
            selected={selected}
            onSubmit={answer}
            colors={colorsProp}
          />
        )}
        {mode === 'minorComuni' && (
          <ProvinceMapAnswer
            region={region}
            correctProvince={currentCity.province}
            status={status}
            selected={selected}
            onSubmit={answer}
            colors={colorsProp}
          />
        )}

        {status === 'answered' && (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={next}
            activeOpacity={0.85}
          >
            <Text style={[styles.nextButtonText, { color: colors.buttonText }]}>
              {showdown
                ? lastCorrect
                  ? '🔥 Avanti'
                  : '💀 Vedi risultato'
                : roundEnding
                  ? 'Vedi risultato'
                  : 'Avanti'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  hudText: {
    fontSize: 15,
    fontWeight: '600',
  },
  questionBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionLabel: {
    fontSize: 16,
    marginBottom: 6,
  },
  cityName: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  minorBadge: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  minorBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nextButton: {
    marginTop: 32,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
