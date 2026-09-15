import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function MultipleChoiceAnswer({ options, correctProvince, status, selected, onAnswer }) {
  const { colors } = useTheme();
  const answered = status === 'answered';

  return (
    <View style={styles.options}>
      {options.map((option) => {
        const isCorrect = option === correctProvince;
        const isSelected = option === selected;

        let bg = colors.card;
        let border = colors.border;
        if (answered && isCorrect) {
          bg = colors.correctBg;
          border = colors.correctBorder;
        } else if (answered && isSelected && !isCorrect) {
          bg = colors.wrongBg;
          border = colors.wrongBorder;
        }

        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, { backgroundColor: bg, borderColor: border }]}
            disabled={answered}
            activeOpacity={0.8}
            onPress={() => onAnswer(option)}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
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
