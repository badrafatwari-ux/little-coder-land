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

interface FunctionFactoryGameProps {
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

export const FunctionFactoryGame = ({ onBack, level, onLevelSelect, gameId }: FunctionFactoryGameProps) => {
  const lang = getLanguage();
  
  const levelData = [
    {
      name: 'double',
      description: lang === 'id' ? 'KALIKAN input dengan 2' : 'DOUBLE the input number',
      inputs: [2, 5],
      correctOutputs: [4, 10],
    },
    {
      name: 'addFive',
      description: lang === 'id' ? 'TAMBAH 5 ke input' : 'ADD 5 to the input',
      inputs: [3, 10, 0],
      correctOutputs: [8, 15, 5],
    },
    {
      name: 'triple_minus_one',
      description: lang === 'id' ? 'KALIKAN 3, lalu KURANGI 1' : 'TRIPLE the input, then SUBTRACT 1',
      inputs: [2, 4, 5],
      correctOutputs: [5, 11, 14],
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [currentInput, setCurrentInput] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleSubmit = () => {
    const correctAnswer = currentLevel.correctOutputs[currentInput];
    const isCorrect = parseInt(userAnswer) === correctAnswer;

    if (isCorrect) {
      playCorrect();
      setShowFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      playWrong();
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentInput < currentLevel.inputs.length - 1) {
        setCurrentInput(prev => prev + 1);
        setUserAnswer('');
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        const stars = finalScore === currentLevel.inputs.length ? 3 : finalScore >= 1 ? 2 : 1;
        setEarned(stars);
        setCompleted(true);
        completeGameLevel(gameId, level, stars);
        playGameComplete();
        setTimeout(() => playStar(), 300);
      }
    }, 1000);
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('functionMaster')}
        message={`${score}/${currentLevel.inputs.length} ${lang === 'id' ? 'benar!' : 'correct!'}`}
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`⚡ ${t('functionFactory')}`}
          subtitle={t('functionFactoryDesc')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <div className="bg-muted rounded-2xl p-4 font-mono text-lg mb-4">
              <p className="text-primary font-bold">FUNCTION {currentLevel.name}(input):</p>
              <p className="ml-4">{currentLevel.description}</p>
              <p className="ml-4">RETURN result</p>
            </div>
            
            <p className="text-center text-lg">
              {t('question')} {currentInput + 1} {t('of')} {currentLevel.inputs.length}
            </p>
          </CardContent>
        </Card>

        <Card variant="lesson" className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">{t('inputValue')}</p>
                <div className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-black">
                  {currentLevel.inputs[currentInput]}
                </div>
              </div>
              
              <motion.div
                className="text-4xl"
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                →
              </motion.div>
              
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">{t('outputValue')}</p>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className={`w-20 h-20 rounded-2xl text-3xl font-black text-center border-4 ${
                    showFeedback === 'correct' ? 'border-success bg-success/20' :
                    showFeedback === 'wrong' ? 'border-destructive bg-destructive/20' :
                    'border-primary/30 bg-card'
                  }`}
                  placeholder="?"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center text-2xl font-bold mb-4 ${
              showFeedback === 'correct' ? 'text-success' : 'text-destructive'
            }`}
          >
            {showFeedback === 'correct' ? `✓ ${t('correct')}!` : `✗ ${lang === 'id' ? 'Jawaban' : 'Answer'}: ${currentLevel.correctOutputs[currentInput]}`}
          </motion.div>
        )}

        <Button 
          size="lg" 
          className="w-full" 
          onClick={handleSubmit}
          disabled={!userAnswer || showFeedback !== null}
        >
          {t('checkOutput')}
        </Button>
      </div>
    </div>
  );
};
