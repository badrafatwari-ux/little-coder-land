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

interface DebugDetectiveGameProps {
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

export const DebugDetectiveGame = ({ onBack, level, onLevelSelect, gameId }: DebugDetectiveGameProps) => {
  const lang = getLanguage();
  
  const levelData = [
    {
      code: [
        'total = 5',
        'total = total + 3',
        'total = total - 10',
      ],
      bugLine: 2,
      expected: '8',
      actual: '-2',
      options: [0, 1, 2],
      explanation: lang === 'id' 
        ? 'Baris 3 mengurangi 10, jadi hasilnya -2 bukan 8!' 
        : 'Line 3 subtracts 10, so the result is -2 not 8!',
    },
    {
      code: [
        'count = 0',
        'count = count + 1',
        'count = count + 1',
        'count = 0',
      ],
      bugLine: 3,
      expected: '2',
      actual: '0',
      options: [0, 1, 2, 3],
      explanation: lang === 'id' 
        ? 'Baris 4 me-reset count ke 0!' 
        : 'Line 4 resets count to 0!',
    },
    {
      code: [
        'price = 100',
        'discount = 20',
        'final = price + discount',
      ],
      bugLine: 2,
      expected: '80',
      actual: '120',
      options: [0, 1, 2],
      explanation: lang === 'id' 
        ? 'Seharusnya mengurangi diskon (price - discount), bukan menambah!' 
        : 'Should subtract discount (price - discount), not add!',
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const checkAnswer = () => {
    if (selectedLine === currentLevel.bugLine) {
      playCorrect();
      const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    } else {
      playWrong();
      setAttempts(prev => prev + 1);
      if (attempts >= 1) {
        setShowExplanation(true);
      }
    }
  };

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      setSelectedLine(null);
      setAttempts(0);
      setCompleted(false);
      setEarned(0);
      setShowExplanation(false);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('debugMaster')}
        message={t('youFoundBug')}
        hasNextLevel={level < gameProgress.maxLevel}
        onNextLevel={handleNextLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`🔍 ${t('debugDetective')}`}
          subtitle={t('findTheBug')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between text-center mb-4">
              <div className="bg-success/20 text-success px-4 py-2 rounded-xl">
                <p className="text-sm">{t('expected')}</p>
                <p className="text-2xl font-bold">{currentLevel.expected}</p>
              </div>
              <div className="bg-destructive/20 text-destructive px-4 py-2 rounded-xl">
                <p className="text-sm">{t('actual')}</p>
                <p className="text-2xl font-bold">{currentLevel.actual}</p>
              </div>
            </div>
            
            <p className="text-lg font-semibold mb-4 text-center">
              {t('whichLineHasBug')}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-2 mb-6">
          {currentLevel.code.map((line, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-xl cursor-pointer border-2 transition-all font-mono flex items-center gap-3 ${
                selectedLine === index 
                  ? 'bg-destructive/10 border-destructive text-destructive' 
                  : 'bg-muted border-transparent hover:border-primary/30'
              }`}
              onClick={() => {
                playTap();
                setSelectedLine(index);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span>{line}</span>
              {selectedLine === index && <span className="ml-auto">🐛</span>}
            </motion.div>
          ))}
        </div>

        {showExplanation && (
          <Card className="mb-6 bg-warning/10 border-warning">
            <CardContent className="p-4">
              <p className="text-sm">💡 {currentLevel.explanation}</p>
            </CardContent>
          </Card>
        )}

        <Button 
          size="lg" 
          className="w-full" 
          onClick={checkAnswer}
          disabled={selectedLine === null}
        >
          {t('findBug')} 🔍
        </Button>
      </div>
    </div>
  );
};
