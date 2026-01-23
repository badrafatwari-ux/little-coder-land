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

interface LogicGateGameProps {
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

export const LogicGateGame = ({ onBack, level, onLevelSelect, gameId }: LogicGateGameProps) => {
  const lang = getLanguage();
  
  const levelData = [
    {
      questions: [
        { a: true, b: true, gate: 'AND', answer: true },
        { a: true, b: false, gate: 'AND', answer: false },
        { a: false, b: false, gate: 'OR', answer: false },
      ],
    },
    {
      questions: [
        { a: true, b: false, gate: 'OR', answer: true },
        { a: false, b: true, gate: 'AND', answer: false },
        { a: true, gate: 'NOT', answer: false },
        { a: false, gate: 'NOT', answer: true },
      ],
    },
    {
      questions: [
        { a: true, b: true, gate: 'OR', answer: true },
        { a: false, b: false, gate: 'AND', answer: false },
        { a: true, gate: 'NOT', answer: false },
        { a: false, b: true, gate: 'OR', answer: true },
        { a: true, b: true, gate: 'AND', answer: true },
      ],
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const question = currentLevel.questions[currentQuestion];

  const checkAnswer = (answer: boolean) => {
    playTap();
    if (answer === question.answer) {
      playCorrect();
      setScore(prev => prev + 1);
      setFeedback('correct');
    } else {
      playWrong();
      setAttempts(prev => prev + 1);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion < currentLevel.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Game complete
        const correctAnswers = score + (answer === question.answer ? 1 : 0);
        const totalQuestions = currentLevel.questions.length;
        const percentage = correctAnswers / totalQuestions;
        const stars = percentage === 1 ? 3 : percentage >= 0.7 ? 2 : 1;
        setEarned(stars);
        setCompleted(true);
        completeGameLevel(gameId, level, stars);
        playGameComplete();
        setTimeout(() => playStar(), 300);
      }
    }, 800);
  };

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      setCurrentQuestion(0);
      setScore(0);
      setAttempts(0);
      setCompleted(false);
      setEarned(0);
      setFeedback(null);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('logicMaster')}
        message={`${t('score')}: ${score}/${currentLevel.questions.length}`}
        hasNextLevel={level < gameProgress.maxLevel}
        onNextLevel={handleNextLevel}
      />
    );
  }

  const formatBool = (val: boolean) => val ? 'TRUE ✓' : 'FALSE ✗';
  
  const gateExplanation: Record<string, string> = {
    AND: lang === 'id' ? 'AND = Keduanya harus TRUE' : 'AND = Both must be TRUE',
    OR: lang === 'id' ? 'OR = Salah satu bisa TRUE' : 'OR = At least one is TRUE',
    NOT: lang === 'id' ? 'NOT = Kebalikannya' : 'NOT = The opposite',
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`🔌 ${t('logicGate')}`}
          subtitle={t('solveLogicGates')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <div className="text-center mb-4">
          <span className="text-sm text-muted-foreground">
            {t('question')} {currentQuestion + 1} / {currentLevel.questions.length}
          </span>
        </div>

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <span className="px-4 py-2 bg-primary/20 text-primary font-bold rounded-xl text-xl">
                {question.gate}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center mb-6">
              {gateExplanation[question.gate]}
            </p>

            <div className="bg-muted p-4 rounded-xl font-mono text-center text-lg mb-4">
              {question.gate === 'NOT' ? (
                <span>NOT {formatBool(question.a)} = ?</span>
              ) : (
                <span>{formatBool(question.a)} {question.gate} {formatBool(question.b!)} = ?</span>
              )}
            </div>

            {feedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-center text-2xl ${feedback === 'correct' ? 'text-success' : 'text-destructive'}`}
              >
                {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            className="p-6 rounded-2xl bg-success text-success-foreground text-xl font-bold"
            onClick={() => checkAnswer(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={feedback !== null}
          >
            TRUE ✓
          </motion.button>
          <motion.button
            className="p-6 rounded-2xl bg-destructive text-destructive-foreground text-xl font-bold"
            onClick={() => checkAnswer(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={feedback !== null}
          >
            FALSE ✗
          </motion.button>
        </div>

        <div className="text-center">
          <span className="text-muted-foreground">{t('score')}: {score}</span>
        </div>
      </div>
    </div>
  );
};
