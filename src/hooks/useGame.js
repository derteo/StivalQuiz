import { useCallback, useMemo, useState } from 'react';
import { ALL_PROVINCES, CITIES } from '../data/cities';

export const ROUND_LENGTH = 10;
const OPTIONS_COUNT = 4;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestions() {
  return shuffle(CITIES).slice(0, ROUND_LENGTH);
}

function buildOptions(correctProvince) {
  const wrongPool = ALL_PROVINCES.filter((p) => p !== correctProvince);
  const wrongOptions = shuffle(wrongPool).slice(0, OPTIONS_COUNT - 1);
  return shuffle([correctProvince, ...wrongOptions]);
}

export function useGame(mode = 'multiple') {
  const [questions, setQuestions] = useState(() => pickQuestions());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing');
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const currentCity = questions[questionIndex];
  const totalQuestions = questions.length;
  const targetField = mode === 'region' ? 'region' : 'province';

  const options = useMemo(
    () => (currentCity && mode === 'multiple' ? buildOptions(currentCity.province) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCity?.city, mode]
  );

  const answer = useCallback(
    (value) => {
      if (status !== 'playing') return;
      setSelected(value);
      setStatus('answered');
      const isCorrect = value === currentCity[targetField];
      setAnswers((prev) => [
        ...prev,
        { city: currentCity.city, correctAnswer: currentCity[targetField], givenAnswer: value, isCorrect },
      ]);
      if (isCorrect) setScore((s) => s + 1);
    },
    [status, currentCity, targetField]
  );

  const next = useCallback(() => {
    if (questionIndex + 1 >= totalQuestions) {
      setStatus('finished');
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelected(null);
    setStatus('playing');
  }, [questionIndex, totalQuestions]);

  const restart = useCallback(() => {
    setQuestions(pickQuestions());
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
    setStatus('playing');
    setAnswers([]);
  }, []);

  return { currentCity, options, questionIndex, totalQuestions, score, status, selected, answers, answer, next, restart };
}
