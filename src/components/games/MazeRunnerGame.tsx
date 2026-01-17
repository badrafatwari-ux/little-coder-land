import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getGameLevel, completeGameLevel } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playTap, playCorrect, playWrong, playGameComplete, playStar } from '@/lib/sounds';

interface MazeRunnerGameProps {
  onBack: () => void;
  level: number;
  onLevelSelect: () => void;
  gameId: string;
}

const GameHeader = ({ 
  title, 
  subtitle, 
  level, 
  onBack, 
  onLevelSelect 
}: { 
  title: string; 
  subtitle: string; 
  level: number;
  onBack: () => void;
  onLevelSelect: () => void;
}) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <div>
        <h1 className="text-2xl font-black text-foreground">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    <Button variant="outline" size="sm" onClick={onLevelSelect}>
      Level {level}
    </Button>
  </div>
);

const CompletionScreen = ({ 
  onBack, 
  stars, 
  title, 
  message,
  onNextLevel,
  hasNextLevel
}: { 
  onBack: () => void; 
  stars: number; 
  title: string; 
  message: string;
  onNextLevel?: () => void;
  hasNextLevel?: boolean;
}) => (
  <div className="min-h-screen p-6 flex flex-col items-center justify-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="text-center"
    >
      <Mascot mood="celebrating" size="lg" />
      <h2 className="text-3xl font-black text-foreground mt-6 mb-4">{title}</h2>
      <StarDisplay count={stars} maxStars={3} size="lg" animated />
      <p className="text-xl text-muted-foreground mt-4 mb-8">{message}</p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={onBack}>Back to Games</Button>
        {hasNextLevel && onNextLevel && (
          <Button size="lg" onClick={onNextLevel}>Next Level →</Button>
        )}
      </div>
    </motion.div>
  </div>
);

type Direction = 'up' | 'down' | 'left' | 'right';

export const MazeRunnerGame = ({ onBack, level, onLevelSelect, gameId }: MazeRunnerGameProps) => {
  const levelData = [
    {
      grid: [
        ['🤖', '⬜', '🏁'],
        ['⬛', '⬜', '⬛'],
        ['⬛', '⬛', '⬛'],
      ],
      start: { x: 0, y: 0 },
      end: { x: 2, y: 0 },
      solution: ['right', 'right'] as Direction[],
    },
    {
      grid: [
        ['🤖', '⬜', '⬛'],
        ['⬛', '⬜', '⬜'],
        ['⬛', '⬛', '🏁'],
      ],
      start: { x: 0, y: 0 },
      end: { x: 2, y: 2 },
      solution: ['right', 'down', 'right', 'down'] as Direction[],
    },
    {
      grid: [
        ['🤖', '⬜', '⬜', '⬜'],
        ['⬛', '⬛', '⬛', '⬜'],
        ['🏁', '⬜', '⬜', '⬜'],
      ],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 2 },
      solution: ['right', 'right', 'right', 'down', 'down', 'left', 'left', 'left'] as Direction[],
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [commands, setCommands] = useState<Direction[]>([]);
  const [robotPos, setRobotPos] = useState(currentLevel.start);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const addCommand = (dir: Direction) => {
    if (commands.length < 10) {
      playTap();
      setCommands([...commands, dir]);
    }
  };

  const runProgram = async () => {
    setIsRunning(true);
    setRobotPos(currentLevel.start);
    
    let pos = { ...currentLevel.start };
    
    for (const cmd of commands) {
      await new Promise(r => setTimeout(r, 500));
      
      let newX = pos.x;
      let newY = pos.y;
      
      if (cmd === 'up') newY--;
      if (cmd === 'down') newY++;
      if (cmd === 'left') newX--;
      if (cmd === 'right') newX++;
      
      // Check bounds and walls
      if (
        newY >= 0 && newY < currentLevel.grid.length &&
        newX >= 0 && newX < currentLevel.grid[0].length &&
        currentLevel.grid[newY][newX] !== '⬛'
      ) {
        pos = { x: newX, y: newY };
        setRobotPos(pos);
        playCorrect();
      } else {
        playWrong();
      }
    }
    
    // Check if reached goal
    if (pos.x === currentLevel.end.x && pos.y === currentLevel.end.y) {
      const optimalLength = currentLevel.solution.length;
      const stars = commands.length <= optimalLength ? 3 : commands.length <= optimalLength + 2 ? 2 : 1;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    } else {
      playWrong();
    }
    
    setIsRunning(false);
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title="Maze Master! 🏃" 
        message={`Solved in ${commands.length} moves!`}
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🏃 Maze Runner"
          subtitle="Program the robot to reach the flag!"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-center mb-4">
              <div className="inline-grid gap-1">
                {currentLevel.grid.map((row, y) => (
                  <div key={y} className="flex gap-1">
                    {row.map((cell, x) => (
                      <div
                        key={`${x}-${y}`}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                          cell === '⬛' ? 'bg-foreground/80' : 'bg-muted'
                        }`}
                      >
                        {robotPos.x === x && robotPos.y === y ? '🤖' : 
                         cell === '🏁' ? '🏁' : 
                         cell === '⬛' ? '' : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="lesson" className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">Commands:</p>
              <Button variant="ghost" size="sm" onClick={() => setCommands([])}>Clear</Button>
            </div>
            <div className="min-h-[40px] bg-muted rounded-xl p-2 flex flex-wrap gap-1">
              {commands.map((cmd, i) => (
                <span key={i} className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                  {cmd === 'up' ? '⬆️' : cmd === 'down' ? '⬇️' : cmd === 'left' ? '⬅️' : '➡️'}
                </span>
              ))}
              {commands.length === 0 && (
                <span className="text-muted-foreground">Add commands below...</span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <Button variant="outline" onClick={() => addCommand('up')} disabled={isRunning}>⬆️ Up</Button>
          <Button variant="outline" onClick={() => addCommand('down')} disabled={isRunning}>⬇️ Down</Button>
          <Button variant="outline" onClick={() => addCommand('left')} disabled={isRunning}>⬅️ Left</Button>
          <Button variant="outline" onClick={() => addCommand('right')} disabled={isRunning}>➡️ Right</Button>
        </div>

        <Button 
          size="lg" 
          className="w-full" 
          onClick={runProgram}
          disabled={commands.length === 0 || isRunning}
        >
          {isRunning ? 'Running...' : 'Run ▶️'}
        </Button>
      </div>
    </div>
  );
};
