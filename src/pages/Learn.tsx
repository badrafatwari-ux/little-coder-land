import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProgress, completeLesson } from '@/lib/progress';
import { t } from '@/lib/i18n';
import { useState, useEffect } from 'react';

interface Lesson {
  id: string;
  titleKey: keyof typeof import('@/lib/i18n').translations.en;
  descKey: keyof typeof import('@/lib/i18n').translations.en;
  icon: string;
  color: string;
  content: {
    explanationKey: keyof typeof import('@/lib/i18n').translations.en;
    exampleKey: keyof typeof import('@/lib/i18n').translations.en;
    interactiveKey: keyof typeof import('@/lib/i18n').translations.en;
  };
}

const lessons: Lesson[] = [
  {
    id: 'program',
    titleKey: 'lessonProgram',
    descKey: 'lessonProgramDesc',
    icon: '💻',
    color: 'from-primary to-primary/70',
    content: {
      explanationKey: 'lessonProgramExplanation',
      exampleKey: 'lessonProgramExample',
      interactiveKey: 'lessonProgramInteractive'
    }
  },
  {
    id: 'sequence',
    titleKey: 'lessonSequence',
    descKey: 'lessonSequenceDesc',
    icon: '📝',
    color: 'from-secondary to-secondary/70',
    content: {
      explanationKey: 'lessonSequenceExplanation',
      exampleKey: 'lessonSequenceExample',
      interactiveKey: 'lessonSequenceInteractive'
    }
  },
  {
    id: 'loops',
    titleKey: 'lessonLoops',
    descKey: 'lessonLoopsDesc',
    icon: '🔄',
    color: 'from-success to-success/70',
    content: {
      explanationKey: 'lessonLoopsExplanation',
      exampleKey: 'lessonLoopsExample',
      interactiveKey: 'lessonLoopsInteractive'
    }
  },
  {
    id: 'conditions',
    titleKey: 'lessonConditions',
    descKey: 'lessonConditionsDesc',
    icon: '🤔',
    color: 'from-accent to-accent/70',
    content: {
      explanationKey: 'lessonConditionsExplanation',
      exampleKey: 'lessonConditionsExample',
      interactiveKey: 'lessonConditionsInteractive'
    }
  },
  {
    id: 'variables',
    titleKey: 'lessonVariables',
    descKey: 'lessonVariablesDesc',
    icon: '📦',
    color: 'from-warning to-warning/70',
    content: {
      explanationKey: 'lessonVariablesExplanation',
      exampleKey: 'lessonVariablesExample',
      interactiveKey: 'lessonVariablesInteractive'
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
            <h1 className="text-3xl font-black text-foreground">{t('learnProgramming')}</h1>
            <p className="text-muted-foreground">{t('tapLessonToStart')}</p>
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
                  <CardTitle className="text-xl">{t(lesson.titleKey)}</CardTitle>
                  <CardDescription>{t(lesson.descKey)}</CardDescription>
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
  const stepTitles = [t('whatIsIt'), t('example'), t('tryIt')];

  const getContent = () => {
    switch (steps[step]) {
      case 'explanation':
        return t(lesson.content.explanationKey);
      case 'example':
        return t(lesson.content.exampleKey);
      case 'interactive':
        return t(lesson.content.interactiveKey);
    }
  };

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
            <h1 className="text-2xl font-black text-foreground">{t(lesson.titleKey)}</h1>
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
              {getContent()}
            </motion.p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              {t('back')}
            </Button>
          )}
          <div className="flex-1" />
          {step < steps.length - 1 ? (
            <Button size="lg" onClick={() => setStep(step + 1)}>
              {t('next')}
            </Button>
          ) : (
            <Button variant="success" size="lg" onClick={() => onComplete(lesson.id)}>
              {t('complete')}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Learn;
