import { StyleSheet, Text, View } from 'react-native';
import ItalyRegionMap from './ItalyRegionMap';

const COLORS = {
  textMuted: '#6b8077',
  correctBorder: '#1f9d5c',
  wrongBorder: '#d64545',
};

export default function RegionMapAnswer({ correctRegion, status, selected, onSubmit }) {
  const answered = status === 'answered';
  const isCorrect = selected === correctRegion;

  return (
    <View>
      <ItalyRegionMap correctRegion={correctRegion} status={status} selected={selected} onSelect={onSubmit} />

      {!answered && <Text style={[styles.hint, { color: COLORS.textMuted }]}>Tocca la regione sulla mappa</Text>}

      {answered && (
        <Text style={[styles.feedback, { color: isCorrect ? COLORS.correctBorder : COLORS.wrongBorder }]}>
          {isCorrect
            ? `Corretto: ${correctRegion}`
            : `Hai scelto ${selected} — la risposta giusta è ${correctRegion}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: 10, fontSize: 13, textAlign: 'center' },
  feedback: { marginTop: 14, fontSize: 15, fontWeight: '600', textAlign: 'center' },
});
