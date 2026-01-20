import { motion } from 'framer-motion';
import { useState } from 'react';
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

export const DataTypeGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const lang = getLanguage();
  
  const dataTypes = [
    { id: 'number', label: t('number'), icon: '🔢', color: 'bg-blue-500' },
    { id: 'string', label: t('text'), icon: '📝', color: 'bg-green-500' },
    { id: 'boolean', label: t('boolean'), icon: '✅', color: 'bg-yellow-500' },
    { id: 'array', label: t('list'), icon: '📋', color: 'bg-purple-500' },
  ];

  const levelItems = [
    // Level 1 - Easy
    [
      { value: '42', type: 'number', display: '42' },
      { value: '"Hello"', type: 'string', display: '"Hello"' },
      { value: 'true', type: 'boolean', display: 'true' },
      { value: '100', type: 'number', display: '100' },
      { value: '"Budi"', type: 'string', display: '"Budi"' },
    ],
    // Level 2 - Medium
    [
      { value: 'false', type: 'boolean', display: 'false' },
      { value: '[1, 2, 3]', type: 'array', display: '[1, 2, 3]' },
      { value: '3.14', type: 'number', display: '3.14' },
      { value: '"123"', type: 'string', display: '"123"' },
      { value: '["a", "b"]', type: 'array', display: '["a", "b"]' },
    ],
    // Level 3 - Hard
    [
      { value: '[true, false]', type: 'array', display: '[true, false]' },
      { value: '"true"', type: 'string', display: '"true"' },
      { value: '0', type: 'number', display: '0' },
      { value: '[]', type: 'array', display: '[]' },
      { value: '"3.14"', type: 'string', display: '"3.14"' },
      { value: 'false', type: 'boolean', display: 'false' },
    ],
  ];
  
  const items = levelItems[Math.min(level - 1, levelItems.length - 1)];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  const currentItem = items[currentIndex];

  const handleSelect = (typeId: string) => {
    if (showResult) return;
    playClick();
    setSelected(typeId);
    setShowResult(true);
    
    if (typeId === currentItem.type) {
      playCorrect();
      setScore(score + 1);
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const finalScore = score + (selected === currentItem.type ? 1 : 0);
      const stars = finalScore === items.length ? 3 : finalScore >= items.length - 1 ? 2 : 1;
      setEarnedStars(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    }
  };

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      setCurrentIndex(0);
      setScore(0);
      setSelected(null);
      setShowResult(false);
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
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">{t('dataTypeExpert')}</h2>
          <StarDisplay count={earnedStars} maxStars={3} size="lg" animated />
          <p className="text-xl text-muted-foreground mt-4 mb-8">
            {t('score')} {score + (selected === currentItem.type ? 1 : 0)}/{items.length}
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
              <h1 className="text-2xl font-black text-foreground">📊 {t('dataTypes')}</h1>
              <p className="text-muted-foreground">{t('dataTypesDesc')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLevelSelect}>Level {level}</Button>
        </div>

        {/* Progress */}
        <div className="h-3 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          />
        </div>

        {/* Value to identify */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('whatDataType')}</p>
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-mono font-bold text-primary"
            >
              {currentItem.display}
            </motion.div>
          </CardContent>
        </Card>

        {/* Type Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {dataTypes.map((type, i) => {
            let variant: 'outline' | 'default' | 'success' | 'destructive' = 'outline';
            if (showResult) {
              if (type.id === currentItem.type) variant = 'success';
              else if (type.id === selected) variant = 'destructive';
            }
            
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Button
                  variant={variant === 'success' ? 'success' : variant === 'destructive' ? 'destructive' : variant}
                  size="lg"
                  className={`w-full h-24 flex-col gap-2 ${showResult && type.id === currentItem.type ? 'ring-4 ring-success' : ''}`}
                  onClick={() => handleSelect(type.id)}
                  disabled={showResult}
                >
                  <span className="text-3xl">{type.icon}</span>
                  <span className="font-bold">{type.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Hint */}
        <Card className="mb-6 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('textHint')}
            </p>
          </CardContent>
        </Card>

        {/* Next button */}
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button size="lg" className="w-full" onClick={handleNext}>
              {currentIndex < items.length - 1 ? t('nextQuestion') : t('seeResult')}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
