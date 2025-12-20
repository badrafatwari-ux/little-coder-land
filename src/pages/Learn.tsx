import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProgress, completeLesson } from '@/lib/progress';
import { useState, useEffect } from 'react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  content: {
    explanation: string;
    example: string;
    interactive: string;
  };
}

const lessons: Lesson[] = [
  {
    id: 'program',
    title: 'What is a Program?',
    description: 'Learn what programs are and how they work',
    icon: '💻',
    color: 'from-primary to-primary/70',
    content: {
      explanation: 'A program is like a recipe for a computer! Just like a recipe tells you step by step how to make a cake, a program tells the computer what to do.',
      example: 'When you play a game, a program tells the computer to show pictures, play sounds, and respond when you press buttons!',
      interactive: 'Think of your morning routine as a program: Wake up → Brush teeth → Eat breakfast → Get dressed → Go to school!'
    }
  },
  {
    id: 'sequence',
    title: 'Sequence',
    description: 'Steps that happen one after another',
    icon: '📝',
    color: 'from-secondary to-secondary/70',
    content: {
      explanation: 'A sequence is when things happen in order, one step at a time. The computer follows instructions from top to bottom!',
      example: 'Making a sandwich: 1. Get bread 2. Add peanut butter 3. Add jelly 4. Put bread on top',
      interactive: 'The order matters! You can\'t eat the sandwich before you make it!'
    }
  },
  {
    id: 'loops',
    title: 'Loops',
    description: 'Repeating actions over and over',
    icon: '🔄',
    color: 'from-success to-success/70',
    content: {
      explanation: 'A loop repeats the same actions multiple times. Instead of writing the same thing 10 times, we use a loop!',
      example: 'Brushing teeth: Repeat 30 times → Move brush up and down',
      interactive: 'Imagine drawing 100 stars. With a loop, you just say "draw a star, repeat 100 times"!'
    }
  },
  {
    id: 'conditions',
    title: 'If / Else',
    description: 'Making decisions in code',
    icon: '🤔',
    color: 'from-accent to-accent/70',
    content: {
      explanation: 'Conditions let the computer make choices. IF something is true, do one thing. ELSE, do something different!',
      example: 'IF it is raining → Take umbrella, ELSE → Wear sunglasses',
      interactive: 'Games use conditions: IF player touches coin → Add points, ELSE IF player touches enemy → Lose life'
    }
  },
  {
    id: 'variables',
    title: 'Variables',
    description: 'Boxes that store information',
    icon: '📦',
    color: 'from-warning to-warning/70',
    content: {
      explanation: 'A variable is like a labeled box that holds something. You can put things in, take things out, and change what\'s inside!',
      example: 'score = 0 (a box called "score" with 0 inside). When you get a point: score = score + 1',
      interactive: 'Your name is stored in a variable! playerName = "Alex"'
    }
  }
];

const Learn = () => {
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const progress = getProgress();
    setCompletedLessons(progress.completedLessons);
  }, []);

  const handleLessonComplete = (lessonId: string) => {
    completeLesson(lessonId);
    setCompletedLessons(prev => [...prev, lessonId]);
    setSelectedLesson(null);
  };

  if (selectedLesson) {
    return <LessonDetail lesson={selectedLesson} onComplete={handleLessonComplete} onBack={() => setSelectedLesson(null)} />;
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-foreground">Learn Programming</h1>
            <p className="text-muted-foreground">Tap a lesson to start learning! 📚</p>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="lesson"
                className="cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${lesson.color} opacity-10`} />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{lesson.icon}</span>
                    {completedLessons.includes(lesson.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-success text-success-foreground rounded-full p-1"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

interface LessonDetailProps {
  lesson: Lesson;
  onComplete: (id: string) => void;
  onBack: () => void;
}

const LessonDetail = ({ lesson, onComplete, onBack }: LessonDetailProps) => {
  const [step, setStep] = useState(0);
  const steps = ['explanation', 'example', 'interactive'] as const;
  const stepTitles = ['What is it?', 'Example', 'Try it!'];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{lesson.icon}</span>
            <h1 className="text-2xl font-black text-foreground">{lesson.title}</h1>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-8">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-4 h-4 rounded-full transition-all ${
                index === step ? 'bg-primary scale-125' : index < step ? 'bg-success' : 'bg-muted'
              }`}
              animate={{ scale: index === step ? 1.25 : 1 }}
            />
          ))}
        </div>

        {/* Content card */}
        <Card variant="lesson" className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary">{stepTitles[step]}</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p
              key={step}
              className="text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {lesson.content[steps[step]]}
            </motion.p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < steps.length - 1 ? (
            <Button size="lg" onClick={() => setStep(step + 1)}>
              Next →
            </Button>
          ) : (
            <Button variant="success" size="lg" onClick={() => onComplete(lesson.id)}>
              Complete! ⭐
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Learn;
