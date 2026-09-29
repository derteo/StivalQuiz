import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModeStatsChart from '../components/ModeStatsChart';
import { displayModeLabel, GAME_MODES } from '../constants/modes';
import { SURVIVAL_COLORS } from '../constants/survivalTheme';
import { useTheme } from '../context/ThemeContext';
import { getLastResult, getModeStats } from '../storage/scores';

export default function HomeScreen({ navigation }) {
  const { colors, scheme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('multiple');
  const [lastResult, setLastResult] = useState(null);
  const [modeStats, setModeStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect invece di useEffect: rilegge i dati ogni volta che si torna
  // alla Home (anche senza rimontare lo screen), cosi dopo una partita
  // l'ultimo risultato e le statistiche sono subito aggiornati.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      Promise.all([getLastResult(), getModeStats()]).then(([last, stats]) => {
        if (active) {
          setLastResult(last);
          setModeStats(stats);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const handleStart = (showdown) => {
    if (mode === 'minorComuni') {
      navigation.navigate('RegionPicker', { showdown });
    } else {
      navigation.navigate('Game', { mode, showdown });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[
          styles.themeToggle,
          { backgroundColor: colors.card, borderColor: colors.border, top: insets.top + 12 },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Text style={styles.themeToggleIcon}>{scheme === 'dark' ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primaryDark }]}>StivalQuiz</Text>
      <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
        Ti mostriamo una città italiana: tocca a te indovinare dove si trova!
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Ultimo risultato</Text>
        {loading ? (
          <Text style={[styles.cardValue, { color: colors.primaryDark }]}>...</Text>
        ) : lastResult ? (
          <>
            <Text style={[styles.cardValue, { color: colors.primaryDark }]}>
              {lastResult.score} / {lastResult.total}
            </Text>
            <Text style={[styles.cardHint, { color: colors.textMuted }]}>
              {displayModeLabel(lastResult.mode, lastResult.showdown)}
            </Text>
          </>
        ) : (
          <Text style={[styles.cardHint, { color: colors.textMuted }]}>Nessuna partita ancora</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Risposte corrette per modalità</Text>
        <ModeStatsChart stats={modeStats} />
      </View>

      <Text style={[styles.modeLabel, { color: colors.textMuted }]}>Modalità di gioco</Text>
      <View style={styles.modeList}>
        {GAME_MODES.map((m) => {
          const active = mode === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.modeRow,
                { backgroundColor: colors.card, borderColor: colors.border },
                active && { backgroundColor: colors.modeActiveBg, borderColor: colors.primary },
              ]}
              onPress={() => setMode(m.id)}
              activeOpacity={0.85}
            >
              <Text style={[styles.modeRowLabel, { color: colors.text }, active && { color: colors.primaryDark }]}>
                {m.label}
              </Text>
              <Text style={[styles.modeRowHint, { color: colors.textMuted }, active && { color: colors.textSubtle }]}>
                {m.hint}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.modeLabel, { color: colors.textMuted }]}>Come vuoi giocare?</Text>
      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.primary }]}
        onPress={() => handleStart(false)}
        activeOpacity={0.85}
      >
        <Text style={[styles.startButtonText, { color: colors.buttonText }]}>▶️ Modalità normale</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.startButton, styles.showdownButton, { backgroundColor: SURVIVAL_COLORS.primary }]}
        onPress={() => handleStart(true)}
        activeOpacity={0.85}
      >
        <Text style={[styles.startButtonText, { color: SURVIVAL_COLORS.buttonText }]}>
          🔥 Showdown (sopravvivenza)
        </Text>
      </TouchableOpacity>
      <Text style={[styles.showdownHint, { color: colors.textMuted }]}>
        Continua finché non sbagli, con lo stile di gioco della modalità scelta sopra
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  themeToggle: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  cardHint: {
    fontSize: 13,
    marginTop: 2,
  },
  modeLabel: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
  },
  modeList: {
    width: '100%',
    gap: 10,
    marginBottom: 8,
  },
  modeRow: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 2,
  },
  modeRowLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  modeRowHint: {
    fontSize: 13,
  },
  startButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 10,
  },
  showdownButton: {
    marginBottom: 6,
  },
  showdownHint: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
