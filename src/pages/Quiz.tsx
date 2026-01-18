import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { saveQuizScore } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playClick, playCorrect, playWrong, playStar, playGameComplete, initAudio } from '@/lib/sounds';
import { t } from '@/lib/i18n';

interface Question {
  id: string;
  questionKey: keyof typeof import('@/lib/i18n').translations.en;
  options: { textKey: keyof typeof import('@/lib/i18n').translations.en; icon: string }[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    id: 'q1',
    questionKey: 'q1Question',
    options: [
      { textKey: 'q1Option1', icon: '📺' },
      { textKey: 'q1Option2', icon: '💻' },
      { textKey: 'q1Option3', icon: '🍕' },
      { textKey: 'q1Option4', icon: '🎮' }
    ],
    correctIndex: 1
  },
  {
    id: 'q2',
    questionKey: 'q2Question',
    options: [
      { textKey: 'q2Option1', icon: '🫥' },
      { textKey: 'q2Option2', icon: '🔄' },
      { textKey: 'q2Option3', icon: '⛔' },
      { textKey: 'q2Option4', icon: '🎵' }
    ],
    correctIndex: 1
  },
  {
    id: 'q3',
    questionKey: 'q3Question',
    options: [
      { textKey: 'q3Option1', icon: '☂️' },
      { textKey: 'q3Option2', icon: '🕶️' },
      { textKey: 'q3Option3', icon: '🏊' },
      { textKey: 'q3Option4', icon: '🪁' }
    ],
    correctIndex: 0
  },
  {
    id: 'q4',
    questionKey: 'q4Question',
    options: [
      { textKey: 'q4Option1', icon: '🤖' },
      { textKey: 'q4Option2', icon: '📦' },
      { textKey: 'q4Option3', icon: '📢' },
      { textKey: 'q4Option4', icon: '💃' }
    ],
    correctIndex: 1
  },
  {
    id: 'q5',
    questionKey: 'q5Question',
    options: [
      { textKey: 'q5Option1', icon: '🎲' },
      { textKey: 'q5Option2', icon: '📝' },
      { textKey: 'q5Option3', icon: '⏪' },
      { textKey: 'q5Option4', icon: '⏭️' }
    ],
    correctIndex: 1
  }
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    initAudio();
    playClick();
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    if (isCorrect) {
      playCorrect();
      setScore(score + 1);
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    playClick();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);
      saveQuizScore('main-quiz', finalScore);
      playGameComplete();
      if (finalScore >= 60) {
        setTimeout(() => playStar(), 300);
      }
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const finalScore = Math.round((score / questions.length) * 100);
    const stars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : finalScore >= 40 ? 1 : 0;

    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center max-w-md"
        >
          <Mascot mood={finalScore >= 60 ? 'celebrating' : 'thinking'} size="lg" />
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">
            {finalScore >= 80 ? t('amazing') : finalScore >= 60 ? 'Great Job! 👏' : 'Keep Learning! 📚'}
          </h2>
          <StarDisplay count={stars} maxStars={3} size="lg" animated />
          <p className="text-2xl font-bold text-primary mt-6">{score} / {questions.length} {t('correct').split('!')[0]}</p>
          <p className="text-lg text-muted-foreground mt-2 mb-8">{finalScore}% Score</p>
          
          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setScore(0);
              setAnswers([]);
              setIsComplete(false);
            }}>
              {t('tryAgain')}
            </Button>
            <Button size="lg" onClick={() => navigate('/')}>
              {t('home')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-foreground">{t('quizTime')}</h1>
            <p className="text-muted-foreground">{t('question')} {currentQuestion + 1} {t('of')} {questions.length}</p>
          </div>
          <div className="text-xl font-bold text-primary">{score} {t('pts')}</div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-muted rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <Card variant="quiz" className="mb-6">
          <CardContent className="p-8">
            <motion.h2
              key={currentQuestion}
              className="text-2xl font-bold text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t(question.questionKey)}
            </motion.h2>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {question.options.map((option, index) => {
            let variant: 'outline' | 'success' | 'destructive' = 'outline';
            if (showResult) {
              if (index === question.correctIndex) variant = 'success';
              else if (index === selectedAnswer) variant = 'destructive';
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={selectedAnswer === index && !showResult ? 'default' : variant === 'success' ? 'success' : variant === 'destructive' ? 'destructive' : 'outline'}
                  size="lg"
                  className={`w-full h-24 flex-col gap-2 text-lg ${
                    showResult && index === question.correctIndex ? 'ring-4 ring-success' : ''
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span>{t(option.textKey)}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Result feedback */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center justify-center gap-3 p-4 rounded-2xl mb-6 ${
              isCorrect ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-8 h-8" />
                <span className="text-xl font-bold">{t('correct')}</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8" />
                <span className="text-xl font-bold">{t('notQuite')}</span>
              </>
            )}
          </motion.div>
        )}

        {/* Actions */}
        {!showResult ? (
          <Button size="lg" className="w-full" onClick={handleCheck} disabled={selectedAnswer === null}>
            {t('checkAnswer')}
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? t('nextQuestion') : t('seeResults')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
