import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  card: '#ffffff',
  text: '#1f2a24',
  border: '#dbe9e2',
  correctBg: '#d4f0df',
  correctBorder: '#1f9d5c',
  wrongBg: '#fbdfdc',
  wrongBorder: '#d64545',
};

export default function MultipleChoiceAnswer({ options, correctProvince, status, selected, onAnswer }) {
  const answered = status === 'answered';

  return (
    <View style={styles.options}>
      {options.map((option) => {
        const isCorrect = option === correctProvince;
        const isSelected = option === selected;

        let bg = COLORS.card;
        let border = COLORS.border;
        if (answered && isCorrect) {
          bg = COLORS.correctBg;
          border = COLORS.correctBorder;
        } else if (answered && isSelected && !isCorrect) {
          bg = COLORS.wrongBg;
          border = COLORS.wrongBorder;
        }

        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, { backgroundColor: bg, borderColor: border }]}
            disabled={answered}
            activeOpacity={0.8}
            onPress={() => onAnswer(option)}
          >
            <Text style={[styles.optionText, { color: COLORS.text }]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  options: { gap: 12 },
  option: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, borderWidth: 2 },
  optionText: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
});
