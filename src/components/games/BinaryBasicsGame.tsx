import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getGameLevel, completeGameLevel } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playTap, playCorrect, playWrong, playGameComplete, playStar } from '@/lib/sounds';

interface BinaryBasicsGameProps {
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
        <Button variant="outline" size="lg" onClick={onBack}>Back to Games</Button>
        {hasNextLevel && onNextLevel && (
          <Button size="lg" onClick={onNextLevel}>Next Level →</Button>
        )}
      </div>
    </motion.div>
  </div>
);

export const BinaryBasicsGame = ({ onBack, level, onLevelSelect, gameId }: BinaryBasicsGameProps) => {
  const levelData = [
    {
      question: 'What is 1 + 1 in binary?',
      options: ['01', '10', '11'],
      correct: 1,
      explanation: '1 + 1 = 2, which is 10 in binary!',
    },
    {
      question: 'Convert 5 to binary:',
      options: ['100', '101', '110'],
      correct: 1,
      explanation: '5 = 4 + 1 = 101 in binary!',
    },
    {
      question: 'What is binary 1010 in decimal?',
      options: ['8', '10', '12'],
      correct: 1,
      explanation: '1010 = 8 + 0 + 2 + 0 = 10!',
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
        title="Binary Boss! 🔢" 
        message={currentLevel.explanation}
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🔢 Binary Basics"
          subtitle="Learn the language of computers!"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6 text-center">
            <p className="text-lg mb-4">Binary uses only 0s and 1s!</p>
            <div className="bg-muted rounded-2xl p-4 font-mono inline-block">
              <span className="text-primary">1 = 💡 ON</span>
              <span className="mx-4">|</span>
              <span className="text-muted-foreground">0 = 💡 OFF</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="lesson" className="mb-6">
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-center mb-8">{currentLevel.question}</p>
            
            <div className="grid grid-cols-3 gap-4">
              {currentLevel.options.map((option, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer text-center text-3xl font-mono ${
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
            Not quite! Think about place values: 1, 2, 4, 8...
          </motion.p>
        )}

        <Button 
          size="lg" 
          className="w-full" 
          onClick={handleSubmit}
          disabled={selectedAnswer === null || showFeedback}
        >
          Check Answer ✓
        </Button>
      </div>
    </div>
  );
};
