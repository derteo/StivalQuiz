import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MultipleChoiceAnswer from './src/components/MultipleChoiceAnswer';
import { useGame } from './src/hooks/useGame';
import { getBestScore, saveScore } from './src/storage/scores';

const COLORS = {
  background: '#eef6f2',
  text: '#1f2a24',
  textMuted: '#6b8077',
  primary: '#12896f',
  primaryDark: '#0b5f4d',
  buttonText: '#ffffff',
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [bestScore, setBestScore] = useState(0);
  const game = useGame();

  useEffect(() => {
    getBestScore().then(setBestScore);
  }, []);

  useEffect(() => {
    if (game.status === 'finished' && screen === 'game') {
      saveScore(game.score).then(({ bestScore: newBest }) => {
        setBestScore(newBest);
        setScreen('results');
      });
    }
  }, [game.status]);

  const startGame = () => {
    game.restart();
    setScreen('game');
  };

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Indovina la Provincia</Text>
        <Text style={styles.subtitle}>Ti mostriamo una città italiana: indovina la provincia!</Text>
        <Text style={styles.bestScore}>Miglior punteggio: {bestScore}</Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.85}>
          <Text style={styles.startButtonText}>Inizia</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'game') {
    if (!game.currentCity) return <SafeAreaView style={styles.container} />;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.hud}>
          Domanda {game.questionIndex + 1}/{game.totalQuestions} · Punteggio: {game.score}
        </Text>
        <Text style={styles.cityName}>{game.currentCity.city}?</Text>
        <MultipleChoiceAnswer
          options={game.options}
          correctProvince={game.currentCity.province}
          status={game.status}
          selected={game.selected}
          onAnswer={game.answer}
        />
        {game.status === 'answered' && (
          <TouchableOpacity style={styles.startButton} onPress={game.next} activeOpacity={0.85}>
            <Text style={styles.startButtonText}>Avanti</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Round completato</Text>
      <Text style={styles.cityName}>
        {game.score}/{game.totalQuestions}
      </Text>
      <Text style={styles.bestScore}>Miglior punteggio: {bestScore}</Text>
      <TouchableOpacity style={styles.startButton} onPress={() => setScreen('home')} activeOpacity={0.85}>
        <Text style={styles.startButtonText}>Torna alla home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.primaryDark, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: COLORS.textMuted, textAlign: 'center', marginBottom: 20 },
  bestScore: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24 },
  hud: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 20 },
  cityName: { fontSize: 30, fontWeight: '800', color: COLORS.primaryDark, marginBottom: 24, textAlign: 'center' },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 24,
  },
  startButtonText: { color: COLORS.buttonText, fontSize: 17, fontWeight: '700' },
});
