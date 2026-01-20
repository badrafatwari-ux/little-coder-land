import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getGameLevel, completeGameLevel } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playTap, playCorrect, playWrong, playGameComplete, playStar } from '@/lib/sounds';
import { t } from '@/lib/i18n';

interface ArrayAdventureGameProps {
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

export const ArrayAdventureGame = ({ onBack, level, onLevelSelect, gameId }: ArrayAdventureGameProps) => {
  const levelData = [
    {
      array: ['🍎', '🍊', '🍋'],
      question: 'index [1] = ?',
      options: ['🍎', '🍊', '🍋'],
      correct: 1,
    },
    {
      array: ['🐶', '🐱', '🐰', '🐻'],
      question: 'index [3] = ?',
      options: ['🐶', '🐰', '🐻'],
      correct: 2,
    },
    {
      array: ['⭐', '🌙', '☀️', '🌈', '❄️'],
      question: '🌈 = index ?',
      options: ['2', '3', '4'],
      correct: 1,
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    setShowFeedback(true);
    setAttempts(prev => prev + 1);
    
    if (selectedAnswer === currentLevel.correct) {
      playCorrect();
      const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    } else {
      playWrong();
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('arrayAce')}
        message={t('youUnderstandArrays')}
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`📋 ${t('arrayAdventure')}`}
          subtitle={t('arrayAdventureDesc')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <p className="text-lg font-semibold mb-4 text-center">{t('theArray')}</p>
            <div className="flex justify-center gap-2 mb-4">
              {currentLevel.array.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl border-2 border-primary/30">
                    {item}
                  </div>
                  <span className="text-sm font-mono text-muted-foreground mt-1">[{index}]</span>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm">
              {t('arrayStartAtZero')}
            </p>
          </CardContent>
        </Card>

        <Card variant="lesson" className="mb-6">
          <CardContent className="p-6">
            <p className="text-xl font-bold text-center mb-6">{currentLevel.question}</p>
            
            <div className="grid grid-cols-3 gap-4">
              {currentLevel.options.map((option, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer text-center text-3xl ${
                    selectedAnswer === index 
                      ? showFeedback
                        ? index === currentLevel.correct
                          ? 'bg-success text-success-foreground'
                          : 'bg-destructive text-destructive-foreground'
                        : 'bg-primary text-primary-foreground'
                      : 'bg-card border-2 border-primary/20 hover:border-primary/50'
                  }`}
                  onClick={() => !showFeedback && (playTap(), setSelectedAnswer(index))}
                  whileHover={{ scale: showFeedback ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showFeedback && selectedAnswer !== currentLevel.correct && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-destructive font-semibold mb-4"
          >
            {t('tryAgainArray')}
          </motion.p>
        )}

        <Button 
          size="lg" 
          className="w-full" 
          onClick={handleSubmit}
          disabled={selectedAnswer === null || showFeedback}
        >
          {t('checkAnswer')}
        </Button>
      </div>
    </div>
  );
};
