import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarDisplayProps {
  count: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StarDisplay = ({ count, maxStars, size = 'md', animated = false }: StarDisplayProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  if (maxStars) {
    // Show individual stars
    return (
      <div className="flex gap-1">
        {Array.from({ length: maxStars }).map((_, i) => (
          <motion.div
            key={i}
            initial={animated ? { scale: 0, rotate: -180 } : {}}
            animate={animated ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          >
            <Star
              className={`${sizeClasses[size]} ${
                i < count
                  ? 'text-warning fill-warning drop-shadow-md'
                  : 'text-muted-foreground/30'
              }`}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Show count with star icon
  return (
    <motion.div
      className="flex items-center gap-2 bg-gradient-to-r from-warning/20 to-secondary/20 px-4 py-2 rounded-full"
      whileHover={{ scale: 1.05 }}
    >
      <Star className={`${sizeClasses[size]} text-warning fill-warning`} />
      <span className={`${textSizes[size]} font-bold text-foreground`}>{count}</span>
    </motion.div>
  );
};
