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

interface Question {
  id: string;
  question: string;
  options: { text: string; icon: string }[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'What is a program?',
    options: [
      { text: 'A TV show', icon: '📺' },
      { text: 'Instructions for a computer', icon: '💻' },
      { text: 'A type of food', icon: '🍕' },
      { text: 'A game controller', icon: '🎮' }
    ],
    correctIndex: 1
  },
  {
    id: 'q2',
    question: 'What does a LOOP do?',
    options: [
      { text: 'Makes things disappear', icon: '🫥' },
      { text: 'Repeats actions', icon: '🔄' },
      { text: 'Stops the program', icon: '⛔' },
      { text: 'Plays music', icon: '🎵' }
    ],
    correctIndex: 1
  },
  {
    id: 'q3',
    question: 'IF it is raining, what should you do?',
    options: [
      { text: 'Take umbrella', icon: '☂️' },
      { text: 'Wear sunglasses', icon: '🕶️' },
      { text: 'Go swimming', icon: '🏊' },
      { text: 'Fly a kite', icon: '🪁' }
    ],
    correctIndex: 0
  },
  {
    id: 'q4',
    question: 'What is a VARIABLE?',
    options: [
      { text: 'A type of robot', icon: '🤖' },
      { text: 'A box that stores information', icon: '📦' },
      { text: 'A loud sound', icon: '📢' },
      { text: 'A dance move', icon: '💃' }
    ],
    correctIndex: 1
  },
  {
    id: 'q5',
    question: 'What is SEQUENCE in coding?',
    options: [
      { text: 'Random order', icon: '🎲' },
      { text: 'Steps in order', icon: '📝' },
      { text: 'Backwards steps', icon: '⏪' },
      { text: 'Skip steps', icon: '⏭️' }
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
            {finalScore >= 80 ? 'Amazing! 🎉' : finalScore >= 60 ? 'Great Job! 👏' : 'Keep Learning! 📚'}
          </h2>
          <StarDisplay count={stars} maxStars={3} size="lg" animated />
          <p className="text-2xl font-bold text-primary mt-6">{score} / {questions.length} Correct</p>
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
              Try Again
            </Button>
            <Button size="lg" onClick={() => navigate('/')}>
              Home
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
            <h1 className="text-2xl font-black text-foreground">Quiz Time!</h1>
            <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="text-xl font-bold text-primary">{score} pts</div>
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
              {question.question}
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
                  <span>{option.text}</span>
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
                <span className="text-xl font-bold">Correct! Great job! 🎉</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8" />
                <span className="text-xl font-bold">Not quite! Keep trying! 💪</span>
              </>
            )}
          </motion.div>
        )}

        {/* Actions */}
        {!showResult ? (
          <Button size="lg" className="w-full" onClick={handleCheck} disabled={selectedAnswer === null}>
            Check Answer
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
