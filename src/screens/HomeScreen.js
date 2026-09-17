import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModeStatsChart from '../components/ModeStatsChart';
import { GAME_MODES, MODE_LABELS } from '../constants/modes';
import { useTheme } from '../context/ThemeContext';
import { getLastResult, getModeStats } from '../storage/scores';

export default function HomeScreen({ navigation }) {
  const { colors, scheme, toggleTheme } = useTheme();
  const [mode, setMode] = useState('multiple');
  const [lastResult, setLastResult] = useState(null);
  const [modeStats, setModeStats] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.themeToggle, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Text style={styles.themeToggleIcon}>{scheme === 'dark' ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primaryDark }]}>Indovina la Provincia</Text>
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
            <Text style={[styles.cardHint, { color: colors.textMuted }]}>{MODE_LABELS[lastResult.mode]}</Text>
          </>
        ) : (
          <Text style={[styles.cardHint, { color: colors.textMuted }]}>Nessuna partita ancora</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Risposte corrette per modalità</Text>
        <ModeStatsChart stats={modeStats} />
      </View>

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
              <Text style={[styles.modeRowLabel, { color: colors.text }]}>{m.label}</Text>
              <Text style={[styles.modeRowHint, { color: colors.textMuted }]}>{m.hint}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Game', { mode })}
        activeOpacity={0.85}
      >
        <Text style={[styles.startButtonText, { color: colors.buttonText }]}>Inizia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  themeToggle: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleIcon: { fontSize: 18 },
  title: { fontSize: 30, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  card: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: { fontSize: 13, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardValue: { fontSize: 28, fontWeight: '700' },
  cardHint: { fontSize: 13, marginTop: 2 },
  modeList: { width: '100%', gap: 10, marginBottom: 24 },
  modeRow: { width: '100%', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, borderWidth: 2 },
  modeRowLabel: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  modeRowHint: { fontSize: 13 },
  startButton: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30 },
  startButtonText: { fontSize: 18, fontWeight: '700' },
});
