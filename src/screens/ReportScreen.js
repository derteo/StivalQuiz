import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ReportScreen({ route, navigation }) {
  const { answers, mode } = route.params;
  const { colors } = useTheme();
  const answerLabel = mode === 'region' ? 'Regione' : 'Provincia';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Report risposte</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {answers.map((a, i) => (
          <View
            key={`${a.city}-${i}`}
            style={[
              styles.row,
              { backgroundColor: colors.card, borderColor: a.isCorrect ? colors.correctBorder : colors.wrongBorder },
            ]}
          >
            <View style={styles.rowHeader}>
              <Text style={[styles.questionNumber, { color: colors.textMuted }]}>#{i + 1}</Text>
              <Text style={[styles.cityName, { color: colors.text }]}>{a.city}</Text>
              <Text style={styles.icon}>{a.isCorrect ? '✅' : '❌'}</Text>
            </View>

            <Text style={[styles.answerLine, { color: colors.textSubtle }]}>
              {answerLabel} data: <Text style={styles.bold}>{a.givenAnswer}</Text>
            </Text>
            {!a.isCorrect && (
              <Text style={[styles.answerLine, { color: colors.correctBorder }]}>
                {answerLabel} corretta: <Text style={styles.bold}>{a.correctAnswer}</Text>
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Text style={[styles.closeButtonText, { color: colors.buttonText }]}>Torna ai risultati</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  scrollContent: { paddingBottom: 16, gap: 10 },
  row: { borderRadius: 14, borderWidth: 2, padding: 14 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  questionNumber: { fontSize: 13, fontWeight: '600' },
  cityName: { fontSize: 16, fontWeight: '700', flex: 1 },
  icon: { fontSize: 16 },
  answerLine: { fontSize: 14, marginTop: 2 },
  bold: { fontWeight: '700' },
  closeButton: { marginVertical: 16, alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
  closeButtonText: { fontSize: 16, fontWeight: '700' },
});
