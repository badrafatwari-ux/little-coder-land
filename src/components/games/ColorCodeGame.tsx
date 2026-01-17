import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getGameLevel, completeGameLevel } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playTap, playCorrect, playWrong, playGameComplete, playStar } from '@/lib/sounds';

interface ColorCodeGameProps {
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

export const ColorCodeGame = ({ onBack, level, onLevelSelect, gameId }: ColorCodeGameProps) => {
  const colors = ['🔴', '🟢', '🔵', '🟡'];
  
  const levelData = [
    { sequence: [0, 1, 0], displayTime: 2000 },
    { sequence: [2, 0, 1, 2], displayTime: 2500 },
    { sequence: [3, 1, 0, 2, 1], displayTime: 3000 },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [phase, setPhase] = useState<'showing' | 'input' | 'result'>('showing');
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // Show sequence effect
  useState(() => {
    if (phase === 'showing') {
      const interval = setInterval(() => {
        setCurrentShowIndex(prev => {
          if (prev >= currentLevel.sequence.length - 1) {
            clearInterval(interval);
            setTimeout(() => setPhase('input'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, currentLevel.displayTime / currentLevel.sequence.length);
      
      return () => clearInterval(interval);
    }
  });

  const handleColorClick = (colorIndex: number) => {
    if (phase !== 'input') return;
    
    playTap();
    const newSequence = [...userSequence, colorIndex];
    setUserSequence(newSequence);

    const currentPos = newSequence.length - 1;
    
    if (colorIndex !== currentLevel.sequence[currentPos]) {
      playWrong();
      setMistakes(prev => prev + 1);
      setUserSequence([]);
      return;
    }

    playCorrect();

    if (newSequence.length === currentLevel.sequence.length) {
      const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    }
  };

  const restartSequence = () => {
    setPhase('showing');
    setUserSequence([]);
    setCurrentShowIndex(0);
    
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= currentLevel.sequence.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('input'), 500);
      } else {
        setCurrentShowIndex(index);
      }
    }, currentLevel.displayTime / currentLevel.sequence.length);
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title="Color Coder! 🎨" 
        message="Perfect memory!"
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🎨 Color Code"
          subtitle="Remember the color sequence!"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6 text-center">
            {phase === 'showing' ? (
              <>
                <p className="text-lg font-semibold mb-4">Watch the sequence!</p>
                <motion.div
                  key={currentShowIndex}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-8xl"
                >
                  {colors[currentLevel.sequence[currentShowIndex]]}
                </motion.div>
                <p className="text-muted-foreground mt-4">
                  {currentShowIndex + 1} / {currentLevel.sequence.length}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold mb-4">Now repeat the sequence!</p>
                <div className="flex justify-center gap-2 mb-4 min-h-[60px]">
                  {userSequence.map((colorIdx, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-4xl"
                    >
                      {colors[colorIdx]}
                    </motion.span>
                  ))}
                  {Array.from({ length: currentLevel.sequence.length - userSequence.length }).map((_, i) => (
                    <span key={`empty-${i}`} className="text-4xl opacity-20">⚪</span>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  {userSequence.length} / {currentLevel.sequence.length}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {colors.map((color, index) => (
            <motion.div
              key={index}
              className={`aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer ${
                phase === 'input' ? 'bg-card border-2 border-primary/20 hover:border-primary' : 'bg-muted opacity-50'
              }`}
              onClick={() => handleColorClick(index)}
              whileHover={{ scale: phase === 'input' ? 1.1 : 1 }}
              whileTap={{ scale: 0.9 }}
            >
              {color}
            </motion.div>
          ))}
        </div>

        <Button 
          variant="outline" 
          size="lg" 
          className="w-full" 
          onClick={restartSequence}
        >
          Show Again 👀
        </Button>
      </div>
    </div>
  );
};
