import { motion } from 'framer-motion';
import { Star, Lock, Sparkles } from 'lucide-react';
import { getProgress, getXPProgress, XP_PER_LEVEL, MAX_PLAYER_LEVEL } from '@/lib/progress';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showXP?: boolean;
}

export const LevelBadge = ({ level, size = 'md', showXP = false }: LevelBadgeProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const xpProgress = getXPProgress();

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-primary-foreground shadow-lg relative`}
        whileHover={{ scale: 1.1 }}
        animate={{ 
          boxShadow: ['0 0 10px hsl(var(--primary) / 0.3)', '0 0 20px hsl(var(--primary) / 0.5)', '0 0 10px hsl(var(--primary) / 0.3)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {level}
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-warning" />
      </motion.div>
      
      {showXP && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">Level {level}</span>
          {level < MAX_PLAYER_LEVEL && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress.percent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{xpProgress.current}/{xpProgress.needed} XP</span>
            </div>
          )}
          {level >= MAX_PLAYER_LEVEL && (
            <span className="text-xs text-success font-semibold">MAX LEVEL!</span>
          )}
        </div>
      )}
    </div>
  );
};

interface GameLevelIndicatorProps {
  currentLevel: number;
  maxLevel: number;
  starsEarned: number[];
}

export const GameLevelIndicator = ({ currentLevel, maxLevel, starsEarned }: GameLevelIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxLevel }).map((_, index) => {
        const level = index + 1;
        const isUnlocked = level <= currentLevel;
        const stars = starsEarned[index] || 0;
        
        return (
          <motion.div
            key={level}
            className={`relative flex flex-col items-center ${!isUnlocked ? 'opacity-50' : ''}`}
            whileHover={isUnlocked ? { scale: 1.1 } : {}}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
              isUnlocked 
                ? stars > 0 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {isUnlocked ? level : <Lock className="w-4 h-4" />}
            </div>
            {isUnlocked && (
              <div className="flex gap-0.5 mt-1">
                {[1, 2, 3].map(s => (
                  <Star
                    key={s}
                    className={`w-2.5 h-2.5 ${
                      s <= stars ? 'text-warning fill-warning' : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

interface LockedOverlayProps {
  requiredLevel: number;
  currentLevel: number;
}

export const LockedOverlay = ({ requiredLevel, currentLevel }: LockedOverlayProps) => {
  const levelsNeeded = requiredLevel - currentLevel;
  
  return (
    <motion.div
      className="absolute inset-0 bg-foreground/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-2 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Lock className="w-10 h-10 text-card" />
      <p className="text-sm font-bold text-card text-center px-4">
        Reach Level {requiredLevel} to unlock!
      </p>
      <p className="text-xs text-card/80">
        {levelsNeeded} more level{levelsNeeded > 1 ? 's' : ''} to go
      </p>
    </motion.div>
  );
};
