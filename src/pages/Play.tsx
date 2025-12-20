import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Bug, Puzzle, Blocks } from 'lucide-react';
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
  },
  {
    id: 'bug-hunter',
    title: 'Bug Hunter',
    description: 'Find and fix the bug in the code!',
    icon: '🐛',
    difficulty: 'medium'
  },
  {
    id: 'pattern-match',
    title: 'Pattern Match',
    description: 'Match the code to its output!',
    icon: '🧩',
    difficulty: 'easy'
  },
  {
    id: 'block-builder',
    title: 'Block Builder',
    description: 'Build code with visual blocks!',
    icon: '🧱',
    difficulty: 'hard'
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
  switch (game.id) {
    case 'sequence-robot':
      return <SequenceGame onBack={onBack} />;
    case 'loop-patterns':
      return <LoopGame onBack={onBack} />;
    case 'if-else-path':
      return <IfElseGame onBack={onBack} />;
    case 'bug-hunter':
      return <BugHunterGame onBack={onBack} />;
    case 'pattern-match':
      return <PatternMatchGame onBack={onBack} />;
    case 'block-builder':
      return <BlockBuilderGame onBack={onBack} />;
    default:
      return null;
  }
};

// Completion Screen Component
const CompletionScreen = ({ 
  onBack, 
  stars, 
  title, 
  message 
}: { 
  onBack: () => void; 
  stars: number; 
  title: string; 
  message: string;
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
      <Button size="lg" onClick={onBack}>Back to Games</Button>
    </motion.div>
  </div>
);

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
    return <CompletionScreen onBack={onBack} stars={earned} title="Amazing! 🎉" message="You completed the sequence!" />;
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
    return <CompletionScreen onBack={onBack} stars={earned} title="Perfect! 🎉" message="You understand loops!" />;
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
    return <CompletionScreen onBack={onBack} stars={earned} title="Great Job! 🎉" message="You understand conditions!" />;
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

// Bug Hunter Game Component
const BugHunterGame = ({ onBack }: { onBack: () => void }) => {
  const [selectedBug, setSelectedBug] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const codeLines = [
    { text: 'START program', hasBug: false },
    { text: 'SET score = 0', hasBug: false },
    { text: 'REPEAT 5 times:', hasBug: false },
    { text: '  score = score + 10', hasBug: false },
    { text: 'PRINT "Your score: " + socre', hasBug: true, bugType: 'typo' },
    { text: 'END program', hasBug: false },
  ];

  const bugLineIndex = codeLines.findIndex(line => line.hasBug);

  const checkAnswer = () => {
    if (selectedBug === bugLineIndex) {
      const stars = showHint ? 2 : 3;
      setEarned(stars);
      setCompleted(true);
      completeGame('bug-hunter', stars);
    }
  };

  if (completed) {
    return <CompletionScreen onBack={onBack} stars={earned} title="Bug Squashed! 🐛" message="You found the bug!" />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">🐛 Bug Hunter</h1>
            <p className="text-muted-foreground">Find the line with the bug!</p>
          </div>
        </div>

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bug className="w-6 h-6 text-destructive" />
              <p className="text-lg font-semibold">This program has a bug! Tap the wrong line.</p>
            </div>
            
            <div className="bg-muted rounded-2xl p-4 font-mono text-base space-y-2">
              {codeLines.map((line, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedBug === index 
                      ? 'bg-destructive/20 border-2 border-destructive' 
                      : 'bg-card hover:bg-primary/10 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedBug(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-muted-foreground mr-3">{index + 1}.</span>
                  <span className={line.hasBug ? 'text-foreground' : 'text-foreground'}>
                    {line.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-warning/20 border-2 border-warning/30 rounded-2xl p-4 mb-6 text-center"
          >
            <p className="text-lg">💡 Hint: Look for a spelling mistake in a variable name!</p>
          </motion.div>
        )}

        <div className="flex gap-4 mb-4">
          {!showHint && (
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setShowHint(true)}>
              💡 Get Hint
            </Button>
          )}
          <Button size="lg" className="flex-1" onClick={checkAnswer} disabled={selectedBug === null}>
            Check Answer ✓
          </Button>
        </div>
      </div>
    </div>
  );
};

// Pattern Match Game Component
const PatternMatchGame = ({ onBack }: { onBack: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      code: 'REPEAT 3 times:\n  Draw ⭐',
      options: ['⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐'],
      correct: 1
    },
    {
      code: 'IF hungry:\n  Eat 🍕\nELSE:\n  Play 🎮',
      scenario: "You are NOT hungry",
      options: ['🍕', '🎮', '🍕🎮', 'Nothing'],
      correct: 1
    },
    {
      code: 'SET x = 2\nSET y = 3\nPRINT x + y',
      options: ['23', '5', '6', 'xy'],
      correct: 1
    }
  ];

  const question = questions[currentQuestion];

  const handleAnswer = () => {
    if (selectedAnswer === question.correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = score + (selectedAnswer === question.correct ? 1 : 0);
      const stars = finalScore === 3 ? 3 : finalScore === 2 ? 2 : 1;
      completeGame('pattern-match', stars);
      setCompleted(true);
    }
  };

  if (completed) {
    const finalScore = score + (selectedAnswer === question.correct ? 1 : 0);
    const stars = finalScore === 3 ? 3 : finalScore === 2 ? 2 : 1;
    return <CompletionScreen onBack={onBack} stars={stars} title="Pattern Pro! 🧩" message={`You got ${finalScore}/3 correct!`} />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-foreground">🧩 Pattern Match</h1>
            <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-1">
            <Puzzle className="w-5 h-5 text-primary" />
            <span className="font-bold">{score}</span>
          </div>
        </div>

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <p className="text-lg font-semibold mb-4">What does this code output?</p>
            <div className="bg-muted rounded-2xl p-4 font-mono text-lg whitespace-pre-line mb-4">
              {question.code}
            </div>
            {question.scenario && (
              <div className="bg-accent/20 rounded-xl p-3 text-center">
                <p className="font-semibold">Scenario: {question.scenario}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {question.options.map((option, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedAnswer === index ? 'default' : 'outline'}
                size="lg"
                className="w-full h-20 text-2xl"
                onClick={() => setSelectedAnswer(index)}
              >
                {option}
              </Button>
            </motion.div>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={handleAnswer} disabled={selectedAnswer === null}>
          {currentQuestion < questions.length - 1 ? 'Next →' : 'Finish'}
        </Button>
      </div>
    </div>
  );
};

// Block Builder Game Component
const BlockBuilderGame = ({ onBack }: { onBack: () => void }) => {
  const [placedBlocks, setPlacedBlocks] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const availableBlocks = [
    { id: 'start', label: '🚀 START', color: 'bg-success' },
    { id: 'move', label: '➡️ Move Forward', color: 'bg-primary' },
    { id: 'turn', label: '↪️ Turn Right', color: 'bg-secondary' },
    { id: 'repeat', label: '🔄 Repeat 2x', color: 'bg-accent' },
    { id: 'end', label: '🏁 END', color: 'bg-warning' },
  ];

  const correctSequence = ['start', 'repeat', 'move', 'turn', 'end'];
  const goal = "Help the robot walk in a square! It needs to move and turn twice.";

  const addBlock = (blockId: string) => {
    if (placedBlocks.length < 5) {
      setPlacedBlocks([...placedBlocks, blockId]);
    }
  };

  const removeBlock = (index: number) => {
    setPlacedBlocks(placedBlocks.filter((_, i) => i !== index));
  };

  const checkSolution = () => {
    // Check if the sequence is correct
    const isCorrect = 
      placedBlocks.length === correctSequence.length &&
      placedBlocks.every((block, index) => block === correctSequence[index]);
    
    if (isCorrect) {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGame('block-builder', stars);
    }
  };

  const clearBlocks = () => {
    setPlacedBlocks([]);
  };

  if (completed) {
    return <CompletionScreen onBack={onBack} stars={earned} title="Master Builder! 🧱" message="You built the perfect program!" />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">🧱 Block Builder</h1>
            <p className="text-muted-foreground">Build a program with blocks!</p>
          </div>
        </div>

        {/* Goal */}
        <Card variant="lesson" className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Blocks className="w-8 h-8 text-primary" />
              <p className="text-lg font-semibold">{goal}</p>
            </div>
          </CardContent>
        </Card>

        {/* Program Area */}
        <Card variant="game" className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Your Program
              <Button variant="ghost" size="sm" onClick={clearBlocks}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] bg-muted/50 rounded-2xl p-4 border-2 border-dashed border-primary/30">
              {placedBlocks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Tap blocks below to add them here!
                </p>
              ) : (
                <div className="space-y-2">
                  {placedBlocks.map((blockId, index) => {
                    const block = availableBlocks.find(b => b.id === blockId);
                    return (
                      <motion.div
                        key={`${blockId}-${index}`}
                        initial={{ scale: 0, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        className={`${block?.color} text-card-foreground p-3 rounded-xl flex items-center justify-between cursor-pointer shadow-md`}
                        onClick={() => removeBlock(index)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="font-bold">{block?.label}</span>
                        <span className="text-sm opacity-70">tap to remove</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Blocks */}
        <div className="mb-6">
          <p className="text-lg font-semibold mb-3">Available Blocks:</p>
          <div className="grid grid-cols-2 gap-3">
            {availableBlocks.map((block) => (
              <motion.div
                key={block.id}
                className={`${block.color} text-card-foreground p-4 rounded-xl cursor-pointer shadow-md text-center font-bold`}
                onClick={() => addBlock(block.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {block.label}
              </motion.div>
            ))}
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full" 
          onClick={checkSolution}
          disabled={placedBlocks.length === 0}
        >
          Run Program ▶️
        </Button>
      </div>
    </div>
  );
};

export default Play;
