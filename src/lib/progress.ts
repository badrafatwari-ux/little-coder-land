export interface GameLevelProgress {
  gameId: string;
  currentLevel: number;
  maxLevel: number;
  starsEarned: number[];
}

export interface GameProgress {
  stars: number;
  totalStars: number;
  completedLessons: string[];
  completedGames: string[];
  gameLevels: Record<string, GameLevelProgress>;
  quizScores: Record<string, number>;
  badges: string[];
  playerLevel: number;
  xp: number;
}

const STORAGE_KEY = 'programming-for-kids-progress';

// XP needed for each player level
export const XP_PER_LEVEL = 50;
export const MAX_PLAYER_LEVEL = 10;

// Game unlock requirements (player level needed)
export const GAME_UNLOCK_LEVELS: Record<string, number> = {
  'sequence-robot': 1,
  'pattern-match': 1,
  'memory-match': 1,
  'loop-patterns': 2,
  'if-else-path': 2,
  'number-sort': 2,
  'bug-hunter': 3,
  'variable-vault': 3,
  'color-code': 3,
  'block-builder': 4,
  'array-adventure': 4,
  'function-factory': 4,
  'maze-runner': 5,
  'binary-basics': 5,
};

// Max levels per game
export const GAME_MAX_LEVELS: Record<string, number> = {
  'sequence-robot': 3,
  'pattern-match': 3,
  'memory-match': 3,
  'loop-patterns': 3,
  'if-else-path': 3,
  'number-sort': 3,
  'bug-hunter': 3,
  'variable-vault': 3,
  'color-code': 3,
  'block-builder': 3,
  'array-adventure': 3,
  'function-factory': 3,
  'maze-runner': 3,
  'binary-basics': 3,
};

const defaultProgress: GameProgress = {
  stars: 0,
  totalStars: 0,
  completedLessons: [],
  completedGames: [],
  gameLevels: {},
  quizScores: {},
  badges: [],
  playerLevel: 1,
  xp: 0,
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

export const addXP = (amount: number): { newLevel: boolean; level: number } => {
  const current = getProgress();
  const newXP = current.xp + amount;
  const newLevel = Math.min(MAX_PLAYER_LEVEL, Math.floor(newXP / XP_PER_LEVEL) + 1);
  const leveledUp = newLevel > current.playerLevel;
  
  saveProgress({
    xp: newXP,
    playerLevel: newLevel,
  });
  
  return { newLevel: leveledUp, level: newLevel };
};

export const addStars = (count: number): void => {
  const current = getProgress();
  saveProgress({
    stars: current.stars + count,
    totalStars: current.totalStars + count,
  });
  // Also add XP when earning stars
  addXP(count * 5);
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

export const getGameLevel = (gameId: string): GameLevelProgress => {
  const current = getProgress();
  const maxLevel = GAME_MAX_LEVELS[gameId] || 3;
  
  if (current.gameLevels[gameId]) {
    return current.gameLevels[gameId];
  }
  
  return {
    gameId,
    currentLevel: 1,
    maxLevel,
    starsEarned: [],
  };
};

export const isGameUnlocked = (gameId: string): boolean => {
  const current = getProgress();
  const requiredLevel = GAME_UNLOCK_LEVELS[gameId] || 1;
  return current.playerLevel >= requiredLevel;
};

export const completeGameLevel = (gameId: string, level: number, stars: number): { 
  levelUp: boolean; 
  newLevel: number; 
  unlockedGame?: string;
} => {
  const current = getProgress();
  const gameProgress = getGameLevel(gameId);
  const maxLevel = GAME_MAX_LEVELS[gameId] || 3;
  
  // Update stars earned for this level
  const starsEarned = [...gameProgress.starsEarned];
  const previousStars = starsEarned[level - 1] || 0;
  
  // Only update if new stars are higher
  if (stars > previousStars) {
    starsEarned[level - 1] = stars;
  }
  
  // Advance to next level if completed with at least 1 star
  const newCurrentLevel = stars > 0 && level === gameProgress.currentLevel && level < maxLevel
    ? level + 1
    : gameProgress.currentLevel;
  
  const updatedGameProgress: GameLevelProgress = {
    ...gameProgress,
    currentLevel: Math.max(gameProgress.currentLevel, newCurrentLevel),
    starsEarned,
  };
  
  // Check if this completes a game (all levels done with 3 stars)
  const gameCompleteId = `${gameId}-complete`;
  const allLevelsComplete = starsEarned.length === maxLevel && starsEarned.every(s => s >= 1);
  
  const completedGames = allLevelsComplete && !current.completedGames.includes(gameCompleteId)
    ? [...current.completedGames, gameCompleteId]
    : current.completedGames;
  
  saveProgress({
    gameLevels: {
      ...current.gameLevels,
      [gameId]: updatedGameProgress,
    },
    completedGames,
  });
  
  // Add stars and XP
  const starsToAdd = Math.max(0, stars - previousStars);
  if (starsToAdd > 0) {
    addStars(starsToAdd);
  }
  
  // Check for newly unlocked games
  const updatedProgress = getProgress();
  let unlockedGame: string | undefined;
  
  Object.entries(GAME_UNLOCK_LEVELS).forEach(([gId, reqLevel]) => {
    if (reqLevel === updatedProgress.playerLevel && gId !== gameId) {
      unlockedGame = gId;
    }
  });
  
  return {
    levelUp: newCurrentLevel > gameProgress.currentLevel,
    newLevel: newCurrentLevel,
    unlockedGame,
  };
};

export const completeGame = (gameId: string, stars: number): void => {
  // Legacy function - now redirects to completeGameLevel for level 1
  completeGameLevel(gameId, 1, stars);
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

export const getXPProgress = (): { current: number; needed: number; percent: number } => {
  const progress = getProgress();
  const currentLevelXP = (progress.playerLevel - 1) * XP_PER_LEVEL;
  const xpInCurrentLevel = progress.xp - currentLevelXP;
  const percent = Math.min(100, (xpInCurrentLevel / XP_PER_LEVEL) * 100);
  
  return {
    current: xpInCurrentLevel,
    needed: XP_PER_LEVEL,
    percent,
  };
};
