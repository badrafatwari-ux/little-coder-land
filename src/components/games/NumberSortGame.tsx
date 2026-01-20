import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getGameLevel, completeGameLevel } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playTap, playCorrect, playWrong, playGameComplete, playStar } from '@/lib/sounds';
import { t, getLanguage } from '@/lib/i18n';

interface NumberSortGameProps {
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

export const NumberSortGame = ({ onBack, level, onLevelSelect, gameId }: NumberSortGameProps) => {
  const lang = getLanguage();
  
  const levelData = [
    { numbers: [3, 1, 2], mode: 'asc' as const },
    { numbers: [5, 2, 8, 1, 4], mode: 'asc' as const },
    { numbers: [9, 3, 7, 1, 5, 2], mode: 'desc' as const },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const shuffled = [...currentLevel.numbers].sort(() => Math.random() - 0.5);
  
  const [numbers, setNumbers] = useState<number[]>(shuffled);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const correctOrder = currentLevel.mode === 'asc' 
    ? [...currentLevel.numbers].sort((a, b) => a - b)
    : [...currentLevel.numbers].sort((a, b) => b - a);

  const handleNumberClick = (index: number) => {
    playTap();
    
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      // Swap numbers
      const newNumbers = [...numbers];
      [newNumbers[selectedIndex], newNumbers[index]] = [newNumbers[index], newNumbers[selectedIndex]];
      setNumbers(newNumbers);
      setSelectedIndex(null);
      setMoves(prev => prev + 1);

      // Check if sorted
      const isSorted = newNumbers.every((num, i) => num === correctOrder[i]);
      if (isSorted) {
        playCorrect();
        const optimalMoves = currentLevel.numbers.length;
        const stars = moves + 1 <= optimalMoves ? 3 : moves + 1 <= optimalMoves * 2 ? 2 : 1;
        setEarned(stars);
        setCompleted(true);
        completeGameLevel(gameId, level, stars);
        playGameComplete();
        setTimeout(() => playStar(), 300);
      }
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('sortingSuccess')}
        message={`${lang === 'id' ? 'Diurutkan dalam' : 'Sorted in'} ${moves} ${t('swaps')}!`}
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`📊 ${t('numberSort')}`}
          subtitle={currentLevel.mode === 'asc' ? t('sortSmallestLargest') : t('sortLargestSmallest')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <p className="text-lg font-semibold mb-4 text-center">
              {t('tapToSwap')}
            </p>
            <p className="text-muted-foreground text-center mb-4">
              {t('goal')}: {currentLevel.mode === 'asc' ? '1 → 2 → 3 → ...' : '... → 3 → 2 → 1'}
            </p>
            <p className="text-center font-mono text-sm">{t('swaps')}: {moves}</p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-3 flex-wrap mb-8">
          {numbers.map((num, index) => (
            <motion.div
              key={`${num}-${index}`}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black cursor-pointer ${
                selectedIndex === index 
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/50' 
                  : 'bg-card border-2 border-primary/20 hover:border-primary/50'
              }`}
              onClick={() => handleNumberClick(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              layout
            >
              {num}
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1" 
            onClick={() => {
              setNumbers([...currentLevel.numbers].sort(() => Math.random() - 0.5));
              setSelectedIndex(null);
              setMoves(0);
            }}
          >
            {t('shuffle')}
          </Button>
        </div>
      </div>
    </div>
  );
};
