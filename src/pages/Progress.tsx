import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, BookOpen, Gamepad2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProgress } from '@/lib/progress';
import { useEffect, useState } from 'react';
import { Mascot } from '@/components/Mascot';
import { StarDisplay } from '@/components/StarDisplay';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

const Progress = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const badges: Badge[] = [
    {
      id: 'first-lesson',
      name: 'First Steps',
      icon: '🎓',
      description: 'Complete your first lesson',
      unlocked: progress.completedLessons.length >= 1
    },
    {
      id: 'all-lessons',
      name: 'Scholar',
      icon: '📚',
      description: 'Complete all lessons',
      unlocked: progress.completedLessons.length >= 5
    },
    {
      id: 'first-game',
      name: 'Player One',
      icon: '🎮',
      description: 'Complete your first game',
      unlocked: progress.completedGames.length >= 1
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      icon: '🏆',
      description: 'Score 80% or higher on quiz',
      unlocked: Object.values(progress.quizScores).some(score => score >= 80)
    },
    {
      id: 'star-collector',
      name: 'Star Collector',
      icon: '⭐',
      description: 'Earn 20 stars',
      unlocked: progress.totalStars >= 20
    },
    {
      id: 'super-coder',
      name: 'Super Coder',
      icon: '💻',
      description: 'Complete everything',
      unlocked: progress.completedLessons.length >= 5 && progress.completedGames.length >= 3
    }
  ];

  const motivationMessages = [
    "You're doing amazing! Keep it up! 🚀",
    "Every expert was once a beginner! 💪",
    "Learning to code is like a superpower! ⚡",
    "You're on your way to becoming a coder! 🌟"
  ];

  const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

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
            <h1 className="text-3xl font-black text-foreground">Your Progress</h1>
            <p className="text-muted-foreground">See how far you've come! 📈</p>
          </div>
        </div>

        {/* Mascot and motivation */}
        <Card variant="success" className="mb-8">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Mascot mood="happy" size="md" />
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-foreground mb-2">{randomMessage}</p>
              <StarDisplay count={progress.stars} size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center p-6">
              <BookOpen className="w-10 h-10 mx-auto text-primary mb-2" />
              <p className="text-3xl font-black text-foreground">{progress.completedLessons.length}</p>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center p-6">
              <Gamepad2 className="w-10 h-10 mx-auto text-secondary mb-2" />
              <p className="text-3xl font-black text-foreground">{progress.completedGames.length}</p>
              <p className="text-sm text-muted-foreground">Games</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center p-6">
              <Trophy className="w-10 h-10 mx-auto text-warning mb-2" />
              <p className="text-3xl font-black text-foreground">{badges.filter(b => b.unlocked).length}</p>
              <p className="text-sm text-muted-foreground">Badges</p>
            </Card>
          </motion.div>
        </div>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-accent" />
              Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-warning/20 to-secondary/20 border-2 border-warning/30'
                      : 'bg-muted/50 opacity-60'
                  }`}
                >
                  <span className={`text-4xl ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </span>
                  <p className="font-bold mt-2">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {badge.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <Star className="w-5 h-5 mx-auto text-warning fill-warning" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Progress;
