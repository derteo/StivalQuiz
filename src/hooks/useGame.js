import { useCallback, useMemo, useState } from 'react';
import { ALL_PROVINCES, CITIES } from '../data/cities';

export const ROUND_LENGTH = 10;
const OPTIONS_COUNT = 4;
const MAJOR_POOL = CITIES.filter((c) => !c.minor);

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Il pool "sorgente" di una modalità: comuni minori+maggiori della regione scelta
// per "Comuni minori", solo città maggiori per tutte le altre modalità.
function sourcePool(mode, region) {
  return mode === 'minorComuni' ? CITIES.filter((c) => c.region === region) : MAJOR_POOL;
}

function pickQuestions(mode, region, showdown) {
  const pool = sourcePool(mode, region);
  // In Showdown il pool viene mescolato per intero e si allunga on demand in
  // useGame.next(): il round è potenzialmente infinito, finisce solo su errore.
  if (showdown) return shuffle(pool);
  const count = Math.min(ROUND_LENGTH, pool.length);
  return shuffle(pool).slice(0, count);
}

function buildOptions(correctProvince) {
  const wrongPool = ALL_PROVINCES.filter((p) => p !== correctProvince);
  const wrongOptions = shuffle(wrongPool).slice(0, OPTIONS_COUNT - 1);
  return shuffle([correctProvince, ...wrongOptions]);
}

export function useGame(mode = 'multiple', region = null, showdown = false) {
  const [questions, setQuestions] = useState(() => pickQuestions(mode, region, showdown));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState('playing');
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [lastCorrect, setLastCorrect] = useState(null);

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
      setLastCorrect(isCorrect);
      setAnswers((prev) => [
        ...prev,
        { city: currentCity.city, correctAnswer: currentCity[targetField], givenAnswer: value, isCorrect },
      ]);
      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }
    },
    [status, currentCity, targetField]
  );

  const next = useCallback(() => {
    if (showdown) {
      if (!lastCorrect) {
        setStatus('finished');
        return;
      }
      setQuestions((qs) =>
        questionIndex + 1 >= qs.length ? [...qs, ...shuffle(sourcePool(mode, region))] : qs
      );
      setQuestionIndex((i) => i + 1);
      setSelected(null);
      setStatus('playing');
      return;
    }
    if (questionIndex + 1 >= totalQuestions) {
      setStatus('finished');
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelected(null);
    setStatus('playing');
  }, [questionIndex, totalQuestions, showdown, lastCorrect, mode, region]);

  const restart = useCallback(() => {
    setQuestions(pickQuestions(mode, region, showdown));
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setStatus('playing');
    setAnswers([]);
    setLastCorrect(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, region, showdown]);

  return {
    currentCity,
    options,
    questionIndex,
    totalQuestions,
    score,
    streak,
    status,
    selected,
    lastCorrect,
    answers,
    answer,
    next,
    restart,
  };
}
