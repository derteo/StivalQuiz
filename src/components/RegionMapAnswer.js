import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ItalyRegionMap from './ItalyRegionMap';

export default function RegionMapAnswer({ correctRegion, status, selected, onSubmit, colors: colorsOverride }) {
  const { colors: themeColors } = useTheme();
  const colors = colorsOverride ?? themeColors;
  const answered = status === 'answered';
  const isCorrect = selected === correctRegion;

  return (
    <View>
      <ItalyRegionMap
        correctRegion={correctRegion}
        status={status}
        selected={selected}
        onSelect={onSubmit}
        colors={colorsOverride}
      />

      {!answered && <Text style={[styles.hint, { color: colors.textMuted }]}>Tocca la regione sulla mappa</Text>}

      {answered && (
        <Text style={[styles.feedback, { color: isCorrect ? colors.correctBorder : colors.wrongBorder }]}>
          {isCorrect
            ? `Corretto: ${correctRegion}`
            : `Hai scelto ${selected} — la risposta giusta è ${correctRegion}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 10,
    fontSize: 13,
    textAlign: 'center',
  },
  feedback: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
