export interface GameProgress {
  stars: number;
  totalStars: number;
  completedLessons: string[];
  completedGames: string[];
  quizScores: Record<string, number>;
  badges: string[];
  currentLevel: number;
}

const STORAGE_KEY = 'programming-for-kids-progress';

const defaultProgress: GameProgress = {
  stars: 0,
  totalStars: 0,
  completedLessons: [],
  completedGames: [],
  quizScores: {},
  badges: [],
  currentLevel: 1,
};

export const getProgress = (): GameProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading progress:', error);
  }
  return defaultProgress;
};

export const saveProgress = (progress: Partial<GameProgress>): void => {
  try {
    const current = getProgress();
    const updated = { ...current, ...progress };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const addStars = (count: number): void => {
  const current = getProgress();
  saveProgress({
    stars: current.stars + count,
    totalStars: current.totalStars + count,
  });
};

export const completeLesson = (lessonId: string): void => {
  const current = getProgress();
  if (!current.completedLessons.includes(lessonId)) {
    saveProgress({
      completedLessons: [...current.completedLessons, lessonId],
    });
    addStars(3);
  }
};

export const completeGame = (gameId: string, stars: number): void => {
  const current = getProgress();
  if (!current.completedGames.includes(gameId)) {
    saveProgress({
      completedGames: [...current.completedGames, gameId],
    });
  }
  addStars(stars);
};

export const saveQuizScore = (quizId: string, score: number): void => {
  const current = getProgress();
  const previousScore = current.quizScores[quizId] || 0;
  if (score > previousScore) {
    saveProgress({
      quizScores: { ...current.quizScores, [quizId]: score },
    });
    if (score === 100 && previousScore < 100) {
      addStars(5);
    } else if (score >= 80 && previousScore < 80) {
      addStars(3);
    }
  }
};

export const earnBadge = (badgeId: string): void => {
  const current = getProgress();
  if (!current.badges.includes(badgeId)) {
    saveProgress({
      badges: [...current.badges, badgeId],
    });
  }
};

export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
