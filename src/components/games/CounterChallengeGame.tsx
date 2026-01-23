import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getGameLevel, completeGameLevel } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playTap, playCorrect, playWrong, playGameComplete, playStar } from '@/lib/sounds';
import { t, getLanguage } from '@/lib/i18n';

interface CounterChallengeGameProps {
  onBack: () => void;
  level: number;
  onLevelSelect: () => void;
  gameId: string;
}

const GameHeader = ({ 
  title, 
  subtitle, 
  level, 
  onBack, 
  onLevelSelect 
}: { 
  title: string; 
  subtitle: string; 
  level: number;
  onBack: () => void;
  onLevelSelect: () => void;
}) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <div>
        <h1 className="text-2xl font-black text-foreground">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    <Button variant="outline" size="sm" onClick={onLevelSelect}>
      Level {level}
    </Button>
  </div>
);

const CompletionScreen = ({ 
  onBack, 
  stars, 
  title, 
  message,
  onNextLevel,
  hasNextLevel
}: { 
  onBack: () => void; 
  stars: number; 
  title: string; 
  message: string;
  onNextLevel?: () => void;
  hasNextLevel?: boolean;
}) => (
  <div className="min-h-screen p-6 flex flex-col items-center justify-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="text-center"
    >
      <Mascot mood="celebrating" size="lg" />
      <h2 className="text-3xl font-black text-foreground mt-6 mb-4">{title}</h2>
      <StarDisplay count={stars} maxStars={3} size="lg" animated />
      <p className="text-xl text-muted-foreground mt-4 mb-8">{message}</p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={onBack}>{t('backToGames')}</Button>
        {hasNextLevel && onNextLevel && (
          <Button size="lg" onClick={onNextLevel}>{t('nextLevel')}</Button>
        )}
      </div>
    </motion.div>
  </div>
);

export const CounterChallengeGame = ({ onBack, level, onLevelSelect, gameId }: CounterChallengeGameProps) => {
  const lang = getLanguage();
  
  const levelData = [
    {
      target: 5,
      startValue: 0,
      operations: ['+1', '+1', '+1'],
      timeLimit: 15,
    },
    {
      target: 10,
      startValue: 5,
      operations: ['+1', '+2', '-1'],
      timeLimit: 20,
    },
    {
      target: 0,
      startValue: 8,
      operations: ['+3', '-2', '-5'],
      timeLimit: 25,
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [counter, setCounter] = useState(currentLevel.startValue);
  const [moves, setMoves] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(currentLevel.timeLimit);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !completed && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed) {
      setGameOver(true);
    }
  }, [timeLeft, completed, gameOver]);

  useEffect(() => {
    if (counter === currentLevel.target && !completed) {
      playCorrect();
      const usedTime = currentLevel.timeLimit - timeLeft;
      const stars = usedTime <= currentLevel.timeLimit / 3 ? 3 
        : usedTime <= currentLevel.timeLimit * 2 / 3 ? 2 : 1;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    }
  }, [counter, currentLevel.target, completed, timeLeft, currentLevel.timeLimit, gameId, level]);

  const applyOperation = (op: string) => {
    playTap();
    const value = parseInt(op);
    setCounter(prev => prev + value);
    setMoves(prev => [...prev, op]);
  };

  const resetGame = () => {
    setCounter(currentLevel.startValue);
    setMoves([]);
    setTimeLeft(currentLevel.timeLimit);
    setGameOver(false);
    setCompleted(false);
  };

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      const nextLevelData = levelData[level];
      setCounter(nextLevelData.startValue);
      setMoves([]);
      setTimeLeft(nextLevelData.timeLimit);
      setCompleted(false);
      setEarned(0);
      setGameOver(false);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('counterChampion')}
        message={`${t('reachedTarget')} ${moves.length} ${t('moves')}!`}
        hasNextLevel={level < gameProgress.maxLevel}
        onNextLevel={handleNextLevel}
      />
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <Mascot mood="thinking" size="lg" />
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">{t('timeUp')}</h2>
          <p className="text-xl text-muted-foreground mb-8">{t('tryAgainCounter')}</p>
          <Button size="lg" onClick={resetGame}>{t('tryAgain')}</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`🔢 ${t('counterChallenge')}`}
          subtitle={t('reachTheTarget')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <div className="text-center mb-6">
          <motion.div
            className={`text-4xl font-black mb-2 ${timeLeft <= 5 ? 'text-destructive' : 'text-foreground'}`}
            animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            ⏱️ {timeLeft}s
          </motion.div>
        </div>

        <Card variant="game" className="mb-6">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-2">{t('target')}</p>
            <div className="text-5xl font-black text-primary mb-6">{currentLevel.target}</div>
            
            <p className="text-muted-foreground mb-2">{t('currentValue')}</p>
            <motion.div 
              className="text-6xl font-black"
              key={counter}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {counter}
            </motion.div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {currentLevel.operations.map((op, index) => (
            <motion.button
              key={index}
              className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg"
              onClick={() => applyOperation(op)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {op}
            </motion.button>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">{t('movesUsed')}: {moves.length}</p>
          <div className="flex justify-center gap-1 mt-2 flex-wrap">
            {moves.map((m, i) => (
              <span key={i} className="px-2 py-1 bg-muted rounded text-xs font-mono">{m}</span>
            ))}
          </div>
        </div>

        <Button variant="outline" size="lg" className="w-full" onClick={resetGame}>
          {t('restart')}
        </Button>
      </div>
    </div>
  );
};
