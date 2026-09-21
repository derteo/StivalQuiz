import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ProvinceMap from './ProvinceMap';

export default function ProvinceMapAnswer({ region, correctProvince, status, selected, onSubmit }) {
  const { colors } = useTheme();
  const answered = status === 'answered';
  const isCorrect = selected === correctProvince;

  return (
    <View>
      <ProvinceMap region={region} correctProvince={correctProvince} status={status} selected={selected} onSelect={onSubmit} />

      {!answered && (
        <Text style={[styles.hint, { color: colors.textMuted }]}>Tocca la provincia sulla mappa</Text>
      )}

      {answered && (
        <Text style={[styles.feedback, { color: isCorrect ? colors.correctBorder : colors.wrongBorder }]}>
          {isCorrect
            ? `Corretto: ${correctProvince}`
            : `Hai scelto ${selected} — la risposta giusta è ${correctProvince}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: 10, fontSize: 13, textAlign: 'center' },
  feedback: { marginTop: 14, fontSize: 15, fontWeight: '600', textAlign: 'center' },
});
