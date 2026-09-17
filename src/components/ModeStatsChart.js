import { StyleSheet, Text, View } from 'react-native';
import { MODE_LABELS } from '../constants/modes';
import { useTheme } from '../context/ThemeContext';

export default function ModeStatsChart({ stats }) {
  const { colors } = useTheme();

  if (!stats.length) {
    return (
      <Text style={[styles.empty, { color: colors.textMuted }]}>
        Gioca una partita per vedere le statistiche
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {stats.map((s) => (
        <View key={s.mode} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={[styles.modeLabel, { color: colors.text }]}>{MODE_LABELS[s.mode] ?? s.mode}</Text>
            <Text style={[styles.percentage, { color: colors.primaryDark }]}>{s.percentage}%</Text>
          </View>
          <View style={[styles.track, { backgroundColor: colors.border }]}>
            <View style={[styles.bar, { width: `${s.percentage}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  empty: {
    fontSize: 13,
    textAlign: 'center',
  },
  row: {
    width: '100%',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
});
