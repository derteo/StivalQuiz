import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ALL_PROVINCES } from '../data/cities';

const MAX_SUGGESTIONS = 5;

export default function FreeTextAnswer({ correctProvince, status, selected, onSubmit, colors: colorsOverride }) {
  const { colors: themeColors } = useTheme();
  const colors = colorsOverride ?? themeColors;
  const [text, setText] = useState('');
  const answered = status === 'answered';

  const query = text.trim().toLowerCase();
  const suggestions = query
    ? ALL_PROVINCES.filter((p) => p.toLowerCase().startsWith(query)).slice(0, MAX_SUGGESTIONS)
    : [];

  const submit = (value) => {
    const finalValue = value.trim();
    if (!finalValue || answered) return;
    setText(finalValue);
    onSubmit(finalValue);
  };

  const handleSubmitEditing = () => {
    const match = suggestions[0] ?? text.trim();
    submit(match);
  };

  const isCorrect = selected === correctProvince;
  const inputColors = answered
    ? isCorrect
      ? { backgroundColor: colors.correctBg, borderColor: colors.correctBorder }
      : { backgroundColor: colors.wrongBg, borderColor: colors.wrongBorder }
    : { backgroundColor: colors.card, borderColor: colors.border };

  return (
    <View>
      <TextInput
        style={[styles.input, inputColors, { color: colors.text }]}
        value={answered ? selected ?? '' : text}
        onChangeText={setText}
        onSubmitEditing={handleSubmitEditing}
        editable={!answered}
        placeholder="Scrivi il nome della provincia..."
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
      />

      {!answered && suggestions.length > 0 && (
        <View style={[styles.suggestions, { borderColor: colors.border }]}>
          {suggestions.map((s, idx) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.suggestionItem,
                { backgroundColor: colors.card, borderBottomColor: colors.border },
                idx === 0 && { backgroundColor: colors.modeActiveBg },
              ]}
              onPress={() => submit(s)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.suggestionText,
                  { color: colors.textSubtle },
                  idx === 0 && { fontWeight: '700', color: colors.primaryDark },
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {answered && !isCorrect && (
        <Text style={[styles.correctReveal, { color: colors.wrongBorder }]}>
          Risposta esatta: {correctProvince}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  suggestions: {
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  correctReveal: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
