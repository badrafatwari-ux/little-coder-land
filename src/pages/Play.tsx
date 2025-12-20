import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { completeGame } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const games: Game[] = [
  {
    id: 'sequence-robot',
    title: 'Robot Sequence',
    description: 'Put the steps in order to help the robot!',
    icon: '🤖',
    difficulty: 'easy'
  },
  {
    id: 'loop-patterns',
    title: 'Loop Patterns',
    description: 'Use loops to complete the pattern!',
    icon: '🔄',
    difficulty: 'medium'
  },
  {
    id: 'if-else-path',
    title: 'Decision Path',
    description: 'Choose the right path with if/else!',
    icon: '🛤️',
    difficulty: 'medium'
  }
];

const Play = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  if (selectedGame) {
    return <GameScreen game={selectedGame} onBack={() => setSelectedGame(null)} />;
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
            <h1 className="text-3xl font-black text-foreground">Play Games</h1>
            <p className="text-muted-foreground">Practice coding with fun puzzles! 🎮</p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="game"
                className="cursor-pointer h-full"
                onClick={() => setSelectedGame(game)}
              >
                <CardHeader>
                  <span className="text-5xl mb-2">{game.icon}</span>
                  <CardTitle className="text-xl">{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    game.difficulty === 'easy' ? 'bg-success/20 text-success' :
                    game.difficulty === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

interface GameScreenProps {
  game: Game;
  onBack: () => void;
}

const GameScreen = ({ game, onBack }: GameScreenProps) => {
  if (game.id === 'sequence-robot') {
    return <SequenceGame onBack={onBack} />;
  }
  if (game.id === 'loop-patterns') {
    return <LoopGame onBack={onBack} />;
  }
  if (game.id === 'if-else-path') {
    return <IfElseGame onBack={onBack} />;
  }
  return null;
};

// Sequence Game Component
const SequenceGame = ({ onBack }: { onBack: () => void }) => {
  const correctOrder = ['Start', 'Walk Forward', 'Turn Right', 'Pick Up Item', 'End'];
  const [items, setItems] = useState(['Pick Up Item', 'Turn Right', 'Walk Forward', 'End', 'Start']);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const checkOrder = () => {
    const isCorrect = items.every((item, index) => item === correctOrder[index]);
    if (isCorrect) {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGame('sequence-robot', stars);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item === active.id);
      const newIndex = items.findIndex(item => item === over.id);
      const newItems = [...items];
      newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, active.id as string);
      setItems(newItems);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <Mascot mood="celebrating" size="lg" />
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">Amazing! 🎉</h2>
          <StarDisplay count={earned} maxStars={3} size="lg" animated />
          <p className="text-xl text-muted-foreground mt-4 mb-8">You completed the sequence!</p>
          <Button size="lg" onClick={onBack}>Back to Games</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">🤖 Robot Sequence</h1>
            <p className="text-muted-foreground">Drag the steps into the correct order!</p>
          </div>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="space-y-3 mb-8">
            {items.map((item, index) => (
              <DraggableItem key={item} id={item} index={index} />
            ))}
          </div>
        </DndContext>

        <Button size="lg" className="w-full" onClick={checkOrder}>
          Check Order ✓
        </Button>
      </div>
    </div>
  );
};

const DraggableItem = ({ id, index }: { id: string; index: number }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const { setNodeRef: setDropRef } = useDroppable({ id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  } : undefined;

  return (
    <motion.div
      ref={(node) => {
        setNodeRef(node);
        setDropRef(node);
      }}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 bg-card border-2 border-primary/20 rounded-2xl flex items-center gap-4 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'shadow-glow scale-105' : 'shadow-card hover:border-primary/40'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
        {index + 1}
      </span>
      <span className="text-lg font-semibold">{id}</span>
    </motion.div>
  );
};

// Loop Game Component
const LoopGame = ({ onBack }: { onBack: () => void }) => {
  const [loopCount, setLoopCount] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const targetCount = 4;

  const checkAnswer = () => {
    if (loopCount === targetCount) {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGame('loop-patterns', stars);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <Mascot mood="celebrating" size="lg" />
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">Perfect! 🎉</h2>
          <StarDisplay count={earned} maxStars={3} size="lg" animated />
          <p className="text-xl text-muted-foreground mt-4 mb-8">You understand loops!</p>
          <Button size="lg" onClick={onBack}>Back to Games</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">🔄 Loop Patterns</h1>
            <p className="text-muted-foreground">How many stars do we need to draw?</p>
          </div>
        </div>

        <Card variant="game" className="mb-8">
          <CardContent className="p-8">
            <p className="text-xl mb-6 text-center">Draw this pattern:</p>
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Star className="w-12 h-12 text-warning fill-warning" />
                </motion.div>
              ))}
            </div>
            <div className="bg-muted p-4 rounded-2xl text-center">
              <p className="text-lg font-mono mb-4">REPEAT <span className="text-primary font-bold">{loopCount}</span> times:</p>
              <p className="text-lg">Draw ⭐</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLoopCount(Math.max(1, loopCount - 1))}
          >
            -
          </Button>
          <span className="text-4xl font-black w-16 text-center">{loopCount}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLoopCount(Math.min(10, loopCount + 1))}
          >
            +
          </Button>
        </div>

        <Button size="lg" className="w-full" onClick={checkAnswer}>
          Check Answer ✓
        </Button>
      </div>
    </div>
  );
};

// If/Else Game Component
const IfElseGame = ({ onBack }: { onBack: () => void }) => {
  const [answer, setAnswer] = useState<'sunny' | 'rainy' | null>(null);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const checkAnswer = () => {
    if (answer === 'sunny') {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGame('if-else-path', stars);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <Mascot mood="celebrating" size="lg" />
          <h2 className="text-3xl font-black text-foreground mt-6 mb-4">Great Job! 🎉</h2>
          <StarDisplay count={earned} maxStars={3} size="lg" animated />
          <p className="text-xl text-muted-foreground mt-4 mb-8">You understand conditions!</p>
          <Button size="lg" onClick={onBack}>Back to Games</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">🛤️ Decision Path</h1>
            <p className="text-muted-foreground">Choose what happens!</p>
          </div>
        </div>

        <Card variant="game" className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <span className="text-6xl">☀️</span>
              <p className="text-xl mt-4">The weather is <strong>SUNNY</strong>!</p>
            </div>
            
            <div className="bg-muted p-4 rounded-2xl font-mono text-lg">
              <p>IF weather is sunny:</p>
              <p className="ml-4 text-success">→ Wear sunglasses 🕶️</p>
              <p>ELSE:</p>
              <p className="ml-4 text-primary">→ Take umbrella ☂️</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-xl text-center mb-4 font-semibold">What should you do?</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button
            variant={answer === 'sunny' ? 'success' : 'outline'}
            size="lg"
            className="h-24 text-xl"
            onClick={() => setAnswer('sunny')}
          >
            🕶️ Sunglasses
          </Button>
          <Button
            variant={answer === 'rainy' ? 'accent' : 'outline'}
            size="lg"
            className="h-24 text-xl"
            onClick={() => setAnswer('rainy')}
          >
            ☂️ Umbrella
          </Button>
        </div>

        <Button size="lg" className="w-full" onClick={checkAnswer} disabled={!answer}>
          Check Answer ✓
        </Button>
      </div>
    </div>
  );
};

export default Play;
