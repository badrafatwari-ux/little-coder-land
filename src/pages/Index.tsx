import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, HelpCircle, Trophy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mascot } from '@/components/Mascot';
import { StarDisplay } from '@/components/StarDisplay';
import { LevelBadge } from '@/components/LevelSystem';
import { getProgress } from '@/lib/progress';
import { useEffect, useState } from 'react';

const menuItems = [
  { label: 'Learn', icon: BookOpen, path: '/learn', variant: 'default' as const, color: 'from-primary to-primary/80' },
  { label: 'Play', icon: Gamepad2, path: '/play', variant: 'secondary' as const, color: 'from-secondary to-secondary/80' },
  { label: 'Quiz', icon: HelpCircle, path: '/quiz', variant: 'accent' as const, color: 'from-accent to-accent/80' },
  { label: 'Progress', icon: Trophy, path: '/progress', variant: 'success' as const, color: 'from-success to-success/80' },
];

const Index = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 right-1/4 w-28 h-28 bg-success/10 rounded-full blur-2xl"
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.7, 0.4, 0.7] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        {/* Settings button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Level and Stars */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LevelBadge level={progress.playerLevel} size="md" />
          <StarDisplay count={progress.stars} size="lg" />
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        className="flex flex-col items-center gap-8 max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Mascot */}
        <Mascot mood="happy" size="lg" />

        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">
            Programming
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary">
            for Kids
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-medium">
            Learn to code through fun games! 🎮
          </p>
        </motion.div>

        {/* Menu buttons */}
        <motion.div
          className="grid grid-cols-2 gap-4 w-full mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Button
                variant={item.variant}
                size="lg"
                className="w-full h-24 flex-col gap-2 text-lg"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-8 h-8" />
                {item.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      />
    </div>
  );
};

export default Index;
