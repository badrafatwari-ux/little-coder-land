import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { completeGameLevel, getGameLevel } from '@/lib/progress';
import { playCorrect, playWrong, playGameComplete, playStar, playClick } from '@/lib/sounds';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { t, getLanguage } from '@/lib/i18n';

interface GameProps {
  onBack: () => void;
  level: number;
  onLevelSelect: () => void;
  gameId: string;
}

const levelCodes = [
  // Level 1 - Simple keywords
  ['print', 'hello', 'if', 'loop', 'end'],
  // Level 2 - More complex
  ['function', 'return', 'while', 'array', 'string'],
  // Level 3 - Full statements
  ['print("Hi")', 'x = 10', 'if x > 5', 'for i', 'end loop'],
];

export const TypingCodeGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const lang = getLanguage();
  const codes = levelCodes[Math.min(level - 1, levelCodes.length - 1)];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [showError, setShowError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCode = codes[currentIndex];

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTyped(value);
    
    // Check if matches so far
    if (!currentCode.startsWith(value)) {
      setShowError(true);
      setErrors(errors + 1);
      playWrong();
      setTimeout(() => setShowError(false), 200);
      return;
    }
    
    playClick();
    
    // Check if complete
    if (value === currentCode) {
      playCorrect();
      setScore(score + 1);
      
      if (currentIndex < codes.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setTyped('');
        }, 500);
      } else {
        // Game complete
        const stars = errors === 0 ? 3 : errors <= 3 ? 2 : 1;
        setEarnedStars(stars);
        setCompleted(true);
        completeGameLevel(gameId, level, stars);
        playGameComplete();
        setTimeout(() => playStar(), 300);
      }
    }
  };

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      setCurrentIndex(0);
      setTyped('');
      setScore(0);
      setErrors(0);
      setCompleted(false);
      setEarnedStars(0);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <Mascot mood="celebrating" size="lg" />
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">{t('fastCoder')}</h2>
          <StarDisplay count={earnedStars} maxStars={3} size="lg" animated />
          <p className="text-xl text-muted-foreground mt-4 mb-2">
            {t('wordsCompleted')} {score}/{codes.length}
          </p>
          <p className="text-muted-foreground mb-8">
            {t('typingErrors')} {errors}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={onBack}>{t('backToGames')}</Button>
            {level < gameProgress.maxLevel && (
              <Button size="lg" onClick={handleNextLevel}>{t('nextLevel')}</Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-foreground">⌨️ {t('typingCode')}</h1>
              <p className="text-muted-foreground">{t('typingCodeDesc')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLevelSelect}>Level {level}</Button>
        </div>

        {/* Progress */}
        <div className="h-3 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            animate={{ width: `${((currentIndex + 1) / codes.length) * 100}%` }}
          />
        </div>

        <div className="text-center mb-4">
          <span className="text-muted-foreground">{t('word')} {currentIndex + 1} {t('of')} {codes.length}</span>
        </div>

        {/* Code to type */}
        <Card className={`mb-6 transition-all ${showError ? 'ring-4 ring-destructive' : ''}`}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('typeThisCode')}</p>
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-mono font-bold"
            >
              {currentCode.split('').map((char, i) => (
                <span
                  key={i}
                  className={
                    i < typed.length
                      ? typed[i] === char
                        ? 'text-success'
                        : 'text-destructive'
                      : i === typed.length
                      ? 'text-primary underline'
                      : 'text-muted-foreground'
                  }
                >
                  {char}
                </span>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={handleChange}
              className="w-full text-2xl font-mono text-center bg-transparent border-none outline-none p-4"
              placeholder={t('startTypingHere')}
              autoComplete="off"
              autoCapitalize="off"
            />
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-success">{score}</p>
            <p className="text-sm text-muted-foreground">{t('correct')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-destructive">{errors}</p>
            <p className="text-sm text-muted-foreground">{t('errors')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
