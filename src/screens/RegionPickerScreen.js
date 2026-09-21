import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { ITALY_MAP_VIEWBOX, ITALY_REGIONS_PATHS } from '../data/italyRegionsMap';

export default function RegionPickerScreen({ navigation }) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(null);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Scegli una regione</Text>
      <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
        Giocherai con i comuni minori di quella regione, da collocare nella provincia giusta
      </Text>

      <Svg viewBox={ITALY_MAP_VIEWBOX} style={styles.map}>
        {ITALY_REGIONS_PATHS.map(({ name, d }) => {
          const isSelected = name === selected;
          return (
            <Path
              key={name}
              d={d}
              fill={isSelected ? colors.modeActiveBg : colors.card}
              stroke={isSelected ? colors.primary : colors.border}
              strokeWidth={isSelected ? 2.2 : 1.2}
              strokeLinejoin="round"
              onPress={() => setSelected(name)}
            />
          );
        })}
      </Svg>

      <Text style={[styles.selectedLabel, { color: colors.primaryDark }]}>
        {selected ?? 'Tocca una regione sulla mappa'}
      </Text>

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: selected ? colors.primary : colors.border }]}
        disabled={!selected}
        onPress={() => navigation.replace('Game', { mode: 'minorComuni', region: selected })}
        activeOpacity={0.85}
      >
        <Text style={[styles.startButtonText, { color: colors.buttonText }]}>Inizia a giocare</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  map: { width: '100%', aspectRatio: 441.5 / 513.9, marginBottom: 16 },
  selectedLabel: { fontSize: 17, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  startButton: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30 },
  startButtonText: { fontSize: 18, fontWeight: '700' },
});
