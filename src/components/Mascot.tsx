import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface MascotProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
}

export const Mascot = ({ mood = 'happy', size = 'md' }: MascotProps) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  const getMoodAnimation = () => {
    switch (mood) {
      case 'excited':
        return { y: [0, -10, 0], rotate: [-3, 3, -3] };
      case 'thinking':
        return { rotate: [-5, 5, -5] };
      case 'celebrating':
        return { scale: [1, 1.1, 1], rotate: [-5, 5, -5] };
      default:
        return { y: [0, -5, 0] };
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={getMoodAnimation()}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Robot body */}
      <div className="relative w-full h-full">
        {/* Main body */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-3xl shadow-lg overflow-hidden">
          {/* Face plate */}
          <div className="absolute top-4 left-4 right-4 bottom-12 bg-card/90 rounded-2xl flex flex-col items-center justify-center gap-2">
            {/* Eyes */}
            <div className="flex gap-4">
              <motion.div
                className="w-6 h-6 bg-foreground rounded-full"
                animate={{ scaleY: mood === 'happy' ? [1, 0.3, 1] : 1 }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="w-6 h-6 bg-foreground rounded-full"
                animate={{ scaleY: mood === 'happy' ? [1, 0.3, 1] : 1 }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
              />
            </div>
            {/* Mouth */}
            <div className={`w-12 h-4 rounded-full ${mood === 'excited' || mood === 'celebrating' ? 'bg-secondary' : 'bg-success'}`} 
                 style={{ borderRadius: mood === 'happy' ? '0 0 50% 50%' : '50%' }} />
          </div>
          
          {/* Antenna */}
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-8 bg-secondary rounded-full"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-warning rounded-full shadow-glow"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Control buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-warning rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
        
        {/* Arms */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-x-4 w-6 h-16 bg-primary rounded-full"
          animate={mood === 'celebrating' ? { rotate: [-20, 20, -20] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-0 top-1/2 translate-x-4 w-6 h-16 bg-primary rounded-full"
          animate={mood === 'celebrating' ? { rotate: [20, -20, 20] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
      
      {/* Celebration stars */}
      {mood === 'celebrating' && (
        <>
          <motion.div
            className="absolute -top-2 -left-2"
            animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Star className="w-6 h-6 text-warning fill-warning" />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: -360, scale: [1, 0.8, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Star className="w-5 h-5 text-secondary fill-secondary" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
