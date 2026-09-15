import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MODES = [
  { id: 'multiple', label: 'Scelta multipla' },
  { id: 'free', label: 'Risposta libera' },
  { id: 'region', label: 'Regione sulla mappa' },
];

export default function HomeScreen({ navigation }) {
  const { colors, scheme, toggleTheme } = useTheme();
  const [mode, setMode] = useState('multiple');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.themeButton, { borderColor: colors.border }]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Text style={{ color: colors.text }}>{scheme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primaryDark }]}>Indovina la Provincia</Text>
      <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
        Ti mostriamo una città italiana: tocca a te indovinare dove si trova!
      </Text>

      <View style={styles.modeList}>
        {MODES.map((m) => {
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
  themeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  title: { fontSize: 30, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  modeList: { width: '100%', gap: 10, marginBottom: 24 },
  modeRow: { width: '100%', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, borderWidth: 2 },
  modeRowLabel: { fontSize: 16, fontWeight: '700' },
  startButton: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30 },
  startButtonText: { fontSize: 18, fontWeight: '700' },
});
