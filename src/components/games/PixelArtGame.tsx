import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { completeGameLevel, getGameLevel } from '@/lib/progress';
import { playCorrect, playWrong, playGameComplete, playStar, playClick } from '@/lib/sounds';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';

interface GameProps {
  onBack: () => void;
  level: number;
  onLevelSelect: () => void;
  gameId: string;
}

const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF'];
const colorNames = ['Merah', 'Biru', 'Kuning', 'Hijau Muda', 'Hijau'];

const levelPatterns = [
  // Level 1 - Simple 3x3 pattern
  {
    size: 3,
    target: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    hint: 'Buat tanda plus (+)!',
  },
  // Level 2 - 4x4 pattern
  {
    size: 4,
    target: [
      [0, 0, 0, 0],
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ],
    hint: 'Buat kotak kuning di tengah!',
  },
  // Level 3 - 5x5 pattern
  {
    size: 5,
    target: [
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
    ],
    hint: 'Buat huruf X besar!',
  },
];

export const PixelArtGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const pattern = levelPatterns[Math.min(level - 1, levelPatterns.length - 1)];
  const [grid, setGrid] = useState<number[][]>(
    Array(pattern.size).fill(null).map(() => Array(pattern.size).fill(-1))
  );
  const [selectedColor, setSelectedColor] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handleCellClick = (row: number, col: number) => {
    if (completed) return;
    playClick();
    const newGrid = grid.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? selectedColor : c))
    );
    setGrid(newGrid);
  };

  const checkPattern = () => {
    setAttempts(attempts + 1);
    let correct = true;
    
    for (let i = 0; i < pattern.size; i++) {
      for (let j = 0; j < pattern.size; j++) {
        if (pattern.target[i][j] >= 0 && grid[i][j] !== pattern.target[i][j]) {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }

    if (correct) {
      const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      setEarnedStars(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    } else {
      playWrong();
    }
  };

  const resetGrid = () => {
    playClick();
    setGrid(Array(pattern.size).fill(null).map(() => Array(pattern.size).fill(-1)));
  };

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      const nextPattern = levelPatterns[level];
      setGrid(Array(nextPattern.size).fill(null).map(() => Array(nextPattern.size).fill(-1)));
      setCompleted(false);
      setEarnedStars(0);
      setAttempts(0);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <Mascot mood="celebrating" size="lg" />
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">Karya Seni! 🎨</h2>
          <StarDisplay count={earnedStars} maxStars={3} size="lg" animated />
          <p className="text-xl text-muted-foreground mt-4 mb-8">Level {level} selesai!</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={onBack}>Kembali</Button>
            {level < gameProgress.maxLevel && (
              <Button size="lg" onClick={handleNextLevel}>Level Berikutnya →</Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-foreground">🎨 Pixel Art</h1>
              <p className="text-muted-foreground">Buat gambar sesuai pola!</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLevelSelect}>Level {level}</Button>
        </div>

        {/* Hint */}
        <Card className="mb-6 bg-primary/10">
          <CardContent className="p-4 text-center">
            <p className="text-lg font-semibold">💡 {pattern.hint}</p>
          </CardContent>
        </Card>

        {/* Target Pattern (small preview) */}
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Pola Target:</p>
            <div 
              className="grid gap-0.5 mx-auto border rounded-lg p-1 bg-muted/30"
              style={{ gridTemplateColumns: `repeat(${pattern.size}, 1fr)` }}
            >
              {pattern.target.map((row, ri) =>
                row.map((cell, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: cell >= 0 ? colors[cell] : '#e5e5e5' }}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Canvas Grid */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div 
              className="grid gap-1 mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${pattern.size}, 1fr)`,
                maxWidth: `${pattern.size * 60}px`
              }}
            >
              {grid.map((row, ri) =>
                row.map((cell, ci) => (
                  <motion.div
                    key={`${ri}-${ci}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square rounded-lg cursor-pointer border-2 border-muted"
                    style={{ backgroundColor: cell >= 0 ? colors[cell] : '#f5f5f5' }}
                    onClick={() => handleCellClick(ri, ci)}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">Pilih Warna:</p>
            <div className="flex justify-center gap-3">
              {colors.map((color, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-xl cursor-pointer ${
                    selectedColor === i ? 'ring-4 ring-foreground ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    playClick();
                    setSelectedColor(i);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={resetGrid} className="flex-1">
            <RotateCcw className="w-5 h-5 mr-2" /> Reset
          </Button>
          <Button size="lg" onClick={checkPattern} className="flex-1">
            Periksa ✓
          </Button>
        </div>
      </div>
    </div>
  );
};
