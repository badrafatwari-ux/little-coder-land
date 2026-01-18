import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { completeGameLevel, getGameLevel } from '@/lib/progress';
import { playCorrect, playWrong, playGameComplete, playStar, playClick } from '@/lib/sounds';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';

interface GameProps {
  onBack: () => void;
  level: number;
  onLevelSelect: () => void;
  gameId: string;
}

const levelQuestions = [
  // Level 1 - Basic operators
  [
    { left: 5, right: 3, result: 8, operators: ['+', '-', '×'], correct: '+' },
    { left: 10, right: 4, result: 6, operators: ['+', '-', '×'], correct: '-' },
    { left: 3, right: 4, result: 12, operators: ['+', '-', '×'], correct: '×' },
    { left: 7, right: 2, result: 9, operators: ['+', '-', '×'], correct: '+' },
  ],
  // Level 2 - More complex
  [
    { left: 15, right: 7, result: 8, operators: ['+', '-', '×', '÷'], correct: '-' },
    { left: 12, right: 3, result: 4, operators: ['+', '-', '×', '÷'], correct: '÷' },
    { left: 6, right: 7, result: 42, operators: ['+', '-', '×', '÷'], correct: '×' },
    { left: 20, right: 5, result: 4, operators: ['+', '-', '×', '÷'], correct: '÷' },
  ],
  // Level 3 - Harder numbers
  [
    { left: 25, right: 5, result: 5, operators: ['+', '-', '×', '÷'], correct: '÷' },
    { left: 8, right: 9, result: 72, operators: ['+', '-', '×', '÷'], correct: '×' },
    { left: 100, right: 45, result: 55, operators: ['+', '-', '×', '÷'], correct: '-' },
    { left: 48, right: 6, result: 8, operators: ['+', '-', '×', '÷'], correct: '÷' },
  ],
];

export const OperatorQuestGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const questions = levelQuestions[Math.min(level - 1, levelQuestions.length - 1)];
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  const question = questions[currentQ];

  const handleSelect = (op: string) => {
    if (showResult) return;
    playClick();
    setSelected(op);
    setShowResult(true);
    
    if (op === question.correct) {
      playCorrect();
      setScore(score + 1);
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const finalScore = score + (selected === question.correct ? 1 : 0);
      const stars = finalScore === questions.length ? 3 : finalScore >= questions.length - 1 ? 2 : 1;
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
      setCurrentQ(0);
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
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">Ahli Matematika! 🧮</h2>
          <StarDisplay count={earnedStars} maxStars={3} size="lg" animated />
          <p className="text-xl text-muted-foreground mt-4 mb-8">
            Skor: {score + (selected === question.correct ? 1 : 0)}/{questions.length}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={onBack}>Kembali</Button>
            {level < gameProgress.maxLevel && (
              <Button size="lg" onClick={handleNextLevel}>Level Berikutnya →</Button>
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
              <h1 className="text-2xl font-black text-foreground">🧮 Operator Quest</h1>
              <p className="text-muted-foreground">Temukan operator yang tepat!</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLevelSelect}>Level {level}</Button>
        </div>

        {/* Progress */}
        <div className="h-3 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <motion.div
              key={currentQ}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-4 text-4xl font-black"
            >
              <span className="text-primary">{question.left}</span>
              <span className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-3xl">
                {selected || '?'}
              </span>
              <span className="text-primary">{question.right}</span>
              <span>=</span>
              <span className="text-success">{question.result}</span>
            </motion.div>
          </CardContent>
        </Card>

        {/* Operator Options */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {question.operators.map((op, i) => {
            let variant: 'outline' | 'default' | 'success' | 'destructive' = 'outline';
            if (showResult) {
              if (op === question.correct) variant = 'success';
              else if (op === selected) variant = 'destructive';
            }
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Button
                  variant={variant === 'success' ? 'success' : variant === 'destructive' ? 'destructive' : variant}
                  size="lg"
                  className={`w-full h-20 text-4xl ${showResult && op === question.correct ? 'ring-4 ring-success' : ''}`}
                  onClick={() => handleSelect(op)}
                  disabled={showResult}
                >
                  {op}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Next button */}
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button size="lg" className="w-full" onClick={handleNext}>
              {currentQ < questions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Lihat Hasil'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
