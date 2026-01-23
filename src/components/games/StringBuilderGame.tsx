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

interface StringBuilderGameProps {
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

export const StringBuilderGame = ({ onBack, level, onLevelSelect, gameId }: StringBuilderGameProps) => {
  const lang = getLanguage();
  
  const levelData = [
    {
      parts: ['"Hello"', '" "', '"World"'],
      answer: '"Hello World"',
      options: ['"Hello World"', '"HelloWorld"', '"Hello + World"', '"Hello" "World"'],
    },
    {
      parts: ['"I am "', 'age', '" years old"'],
      variables: { age: '10' },
      answer: '"I am 10 years old"',
      options: ['"I am 10 years old"', '"I am age years old"', '"Iamyearsold"', '"I am " 10 " years old"'],
    },
    {
      parts: ['name', '" loves "', 'food'],
      variables: { name: '"Alex"', food: '"pizza"' },
      answer: '"Alex loves pizza"',
      options: ['"Alex loves pizza"', '"name loves food"', '"Alexlovespizza"', 'Alex + loves + pizza'],
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const checkAnswer = () => {
    if (selectedAnswer === currentLevel.answer) {
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
      setSelectedAnswer(null);
    }
  };

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      setSelectedAnswer(null);
      setAttempts(0);
      setCompleted(false);
      setEarned(0);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('stringMaster')}
        message={t('youUnderstandStrings')}
        hasNextLevel={level < gameProgress.maxLevel}
        onNextLevel={handleNextLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`🔤 ${t('stringBuilder')}`}
          subtitle={t('combineStrings')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <p className="text-lg font-semibold mb-4 text-center">
              {t('whatResultWhenCombine')}
            </p>
            
            {currentLevel.variables && (
              <div className="bg-muted p-3 rounded-xl mb-4 font-mono text-sm">
                {Object.entries(currentLevel.variables).map(([key, value]) => (
                  <div key={key}>{key} = {value}</div>
                ))}
              </div>
            )}
            
            <div className="bg-primary/10 p-4 rounded-xl font-mono text-center text-lg">
              {currentLevel.parts.join(' + ')}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 mb-6">
          {currentLevel.options.map((option, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-2xl cursor-pointer border-2 transition-all font-mono text-center ${
                selectedAnswer === option 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-card border-primary/20 hover:border-primary/50'
              }`}
              onClick={() => {
                playTap();
                setSelectedAnswer(option);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option}
            </motion.div>
          ))}
        </div>

        <Button 
          size="lg" 
          className="w-full" 
          onClick={checkAnswer}
          disabled={!selectedAnswer}
        >
          {t('checkAnswer')} ✓
        </Button>

        {attempts > 0 && (
          <p className="text-center text-muted-foreground mt-4">
            {t('tryAgainString')}
          </p>
        )}
      </div>
    </div>
  );
};
