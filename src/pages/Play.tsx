import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { 
  getProgress, 
  getGameLevel, 
  isGameUnlocked, 
  completeGameLevel, 
  GAME_UNLOCK_LEVELS, 
  GAME_MAX_LEVELS 
} from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { LevelBadge, GameLevelIndicator, LockedOverlay } from '@/components/LevelSystem';

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
    id: 'pattern-match',
    title: 'Pattern Match',
    description: 'Match the code to its output!',
    icon: '🧩',
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
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, [selectedGame]);

  const handleGameSelect = (game: Game) => {
    if (!isGameUnlocked(game.id)) return;
    const gameProgress = getGameLevel(game.id);
    setSelectedLevel(gameProgress.currentLevel);
    setSelectedGame(game);
  };

  if (selectedGame) {
    return (
      <GameScreen 
        game={selectedGame} 
        level={selectedLevel}
        onBack={() => setSelectedGame(null)} 
        onLevelChange={setSelectedLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-black text-foreground">Play Games</h1>
              <p className="text-muted-foreground">Complete levels to unlock more! 🎮</p>
            </div>
          </div>
          <LevelBadge level={progress.playerLevel} showXP />
        </div>

        {/* Games Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => {
            const unlocked = isGameUnlocked(game.id);
            const gameProgress = getGameLevel(game.id);
            const requiredLevel = GAME_UNLOCK_LEVELS[game.id] || 1;
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="game"
                  className={`cursor-pointer h-full relative overflow-hidden ${!unlocked ? 'opacity-80' : ''}`}
                  onClick={() => handleGameSelect(game)}
                >
                  {!unlocked && (
                    <LockedOverlay requiredLevel={requiredLevel} currentLevel={progress.playerLevel} />
                  )}
                  <CardHeader>
                    <span className="text-5xl mb-2">{game.icon}</span>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                    
                    {unlocked && (
                      <GameLevelIndicator
                        currentLevel={gameProgress.currentLevel}
                        maxLevel={gameProgress.maxLevel}
                        starsEarned={gameProgress.starsEarned}
                      />
                    )}
                    
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
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

interface GameScreenProps {
  game: Game;
  level: number;
  onBack: () => void;
  onLevelChange: (level: number) => void;
}

const GameScreen = ({ game, level, onBack, onLevelChange }: GameScreenProps) => {
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const gameProgress = getGameLevel(game.id);

  if (showLevelSelect) {
    return (
      <LevelSelectScreen
        game={game}
        gameProgress={gameProgress}
        onSelectLevel={(lvl) => {
          onLevelChange(lvl);
          setShowLevelSelect(false);
        }}
        onBack={onBack}
      />
    );
  }

  const gameProps = { 
    onBack, 
    level, 
    onLevelSelect: () => setShowLevelSelect(true),
    gameId: game.id
  };

  switch (game.id) {
    case 'sequence-robot':
      return <SequenceGame {...gameProps} />;
    case 'loop-patterns':
      return <LoopGame {...gameProps} />;
    case 'if-else-path':
      return <IfElseGame {...gameProps} />;
    case 'bug-hunter':
      return <BugHunterGame {...gameProps} />;
    case 'pattern-match':
      return <PatternMatchGame {...gameProps} />;
    case 'block-builder':
      return <BlockBuilderGame {...gameProps} />;
    default:
      return null;
  }
};

interface LevelSelectScreenProps {
  game: Game;
  gameProgress: ReturnType<typeof getGameLevel>;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const LevelSelectScreen = ({ game, gameProgress, onSelectLevel, onBack }: LevelSelectScreenProps) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{game.icon}</span>
            <div>
              <h1 className="text-2xl font-black text-foreground">{game.title}</h1>
              <p className="text-muted-foreground">Choose a level</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {Array.from({ length: gameProgress.maxLevel }).map((_, index) => {
            const levelNum = index + 1;
            const isUnlocked = levelNum <= gameProgress.currentLevel;
            const stars = gameProgress.starsEarned[index] || 0;
            const isCompleted = stars > 0;

            return (
              <motion.div
                key={levelNum}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant={isCompleted ? 'success' : isUnlocked ? 'game' : 'default'}
                  className={`cursor-pointer ${!isUnlocked ? 'opacity-60' : ''}`}
                  onClick={() => isUnlocked && onSelectLevel(levelNum)}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${
                        isCompleted ? 'bg-success text-success-foreground' :
                        isUnlocked ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {isUnlocked ? levelNum : <Lock className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-xl font-bold">Level {levelNum}</p>
                        <p className="text-sm text-muted-foreground">
                          {levelNum === 1 ? 'Easy' : levelNum === 2 ? 'Medium' : 'Hard'} difficulty
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {isUnlocked && (
                        <div className="flex gap-1">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              className={`w-6 h-6 ${
                                s <= stars ? 'text-warning fill-warning' : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {isUnlocked && <ChevronRight className="w-6 h-6 text-muted-foreground" />}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Shared Game Props
interface GameProps {
  onBack: () => void;
  level: number;
  onLevelSelect: () => void;
  gameId: string;
}

// Completion Screen Component
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

// Game Header Component
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

// Sequence Game Component
const SequenceGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const levelData = [
    { correct: ['Start', 'Walk Forward', 'End'], initial: ['End', 'Walk Forward', 'Start'] },
    { correct: ['Start', 'Walk Forward', 'Turn Right', 'Pick Up Item', 'End'], initial: ['Pick Up Item', 'Turn Right', 'Walk Forward', 'End', 'Start'] },
    { correct: ['Start', 'Walk Forward', 'Turn Left', 'Jump', 'Pick Up Key', 'Open Door', 'End'], initial: ['Open Door', 'Jump', 'Walk Forward', 'End', 'Pick Up Key', 'Turn Left', 'Start'] },
  ];
  
  const currentLevelData = levelData[Math.min(level - 1, levelData.length - 1)];
  const [items, setItems] = useState(currentLevelData.initial);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const checkOrder = () => {
    const isCorrect = items.every((item, index) => item === currentLevelData.correct[index]);
    if (isCorrect) {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
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

  const handleNextLevel = () => {
    const gameProgress = getGameLevel(gameId);
    if (level < gameProgress.maxLevel) {
      const nextLevelData = levelData[level];
      setItems(nextLevelData.initial);
      setCompleted(false);
      setEarned(0);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title="Amazing! 🎉" 
        message={`Level ${level} complete!`}
        hasNextLevel={level < gameProgress.maxLevel}
        onNextLevel={handleNextLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🤖 Robot Sequence"
          subtitle="Drag the steps into the correct order!"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

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
const LoopGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const levelData = [
    { target: 3, emoji: '⭐' },
    { target: 5, emoji: '🌙' },
    { target: 7, emoji: '❤️' },
  ];
  
  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [loopCount, setLoopCount] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const checkAnswer = () => {
    if (loopCount === currentLevel.target) {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title="Perfect! 🎉" 
        message="You understand loops!"
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🔄 Loop Patterns"
          subtitle="How many items do we need?"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-8">
          <CardContent className="p-8">
            <p className="text-xl mb-6 text-center">Draw this pattern:</p>
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {Array.from({ length: currentLevel.target }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-4xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  {currentLevel.emoji}
                </motion.span>
              ))}
            </div>
            <div className="bg-muted p-4 rounded-2xl text-center">
              <p className="text-lg font-mono mb-4">REPEAT <span className="text-primary font-bold">{loopCount}</span> times:</p>
              <p className="text-lg">Draw {currentLevel.emoji}</p>
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
const IfElseGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const levelData = [
    { condition: 'sunny', weather: '☀️', correct: 'sunny', options: [{ id: 'sunny', label: '🕶️ Sunglasses' }, { id: 'rainy', label: '☂️ Umbrella' }] },
    { condition: 'cold', weather: '❄️', correct: 'cold', options: [{ id: 'cold', label: '🧥 Coat' }, { id: 'hot', label: '👕 T-Shirt' }] },
    { condition: 'night', weather: '🌙', correct: 'night', options: [{ id: 'night', label: '🛏️ Sleep' }, { id: 'day', label: '⚽ Play' }, { id: 'eat', label: '🍕 Eat' }] },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [answer, setAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const checkAnswer = () => {
    if (answer === currentLevel.correct) {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title="Great Job! 🎉" 
        message="You understand conditions!"
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  const conditionText = {
    sunny: 'SUNNY',
    cold: 'COLD',
    night: 'NIGHT TIME',
  }[currentLevel.condition] || currentLevel.condition.toUpperCase();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🛤️ Decision Path"
          subtitle="Choose what happens!"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <span className="text-6xl">{currentLevel.weather}</span>
              <p className="text-xl mt-4">It is <strong>{conditionText}</strong>!</p>
            </div>
            
            <div className="bg-muted p-4 rounded-2xl font-mono text-lg">
              <p>IF it is {conditionText.toLowerCase()}:</p>
              <p className="ml-4 text-success">→ {currentLevel.options[0].label}</p>
              <p>ELSE:</p>
              <p className="ml-4 text-primary">→ {currentLevel.options[1].label}</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-xl text-center mb-4 font-semibold">What should you do?</p>

        <div className={`grid gap-4 mb-8 ${currentLevel.options.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {currentLevel.options.map((option) => (
            <Button
              key={option.id}
              variant={answer === option.id ? 'success' : 'outline'}
              size="lg"
              className="h-24 text-xl"
              onClick={() => setAnswer(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={checkAnswer} disabled={!answer}>
          Check Answer ✓
        </Button>
      </div>
    </div>
  );
};

// Bug Hunter Game Component
const BugHunterGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const levelData = [
    {
      lines: [
        { text: 'START program', hasBug: false },
        { text: 'SET score = 0', hasBug: false },
        { text: 'PRINT "Score: " + socre', hasBug: true },
        { text: 'END program', hasBug: false },
      ],
      hint: 'Look for a spelling mistake!'
    },
    {
      lines: [
        { text: 'START program', hasBug: false },
        { text: 'SET x = 5', hasBug: false },
        { text: 'SET y = 10', hasBug: false },
        { text: 'PRINT x + y + z', hasBug: true },
        { text: 'END program', hasBug: false },
      ],
      hint: 'Is every variable defined?'
    },
    {
      lines: [
        { text: 'START program', hasBug: false },
        { text: 'REPEAT 3 times:', hasBug: false },
        { text: '  Draw star', hasBug: false },
        { text: '  Move forward', hasBug: false },
        { text: 'REPEAT 2 times', hasBug: true },
        { text: '  Draw circle', hasBug: false },
        { text: 'END program', hasBug: false },
      ],
      hint: 'Check if all loops have colons!'
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [selectedBug, setSelectedBug] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const bugLineIndex = currentLevel.lines.findIndex(line => line.hasBug);

  const checkAnswer = () => {
    if (selectedBug === bugLineIndex) {
      const stars = showHint ? 2 : 3;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title="Bug Squashed! 🐛" 
        message="You found the bug!"
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🐛 Bug Hunter"
          subtitle="Find the line with the bug!"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="game" className="mb-6">
          <CardContent className="p-6">
            <p className="text-lg font-semibold mb-4">Tap the line with the bug:</p>
            
            <div className="bg-muted rounded-2xl p-4 font-mono text-base space-y-2">
              {currentLevel.lines.map((line, index) => (
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
                  <span>{line.text}</span>
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
            <p className="text-lg">💡 Hint: {currentLevel.hint}</p>
          </motion.div>
        )}

        <div className="flex gap-4">
          {!showHint && (
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setShowHint(true)}>
              💡 Hint
            </Button>
          )}
          <Button size="lg" className="flex-1" onClick={checkAnswer} disabled={selectedBug === null}>
            Check ✓
          </Button>
        </div>
      </div>
    </div>
  );
};

// Pattern Match Game Component
const PatternMatchGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const levelData = [
    [
      { code: 'REPEAT 3 times:\n  Draw ⭐', options: ['⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'], correct: 1 },
      { code: 'REPEAT 2 times:\n  Draw 🌙', options: ['🌙', '🌙🌙', '🌙🌙🌙'], correct: 1 },
    ],
    [
      { code: 'IF hungry:\n  Eat 🍕\nELSE:\n  Play 🎮', scenario: 'NOT hungry', options: ['🍕', '🎮', '🍕🎮'], correct: 1 },
      { code: 'SET x = 2\nSET y = 3\nPRINT x + y', options: ['23', '5', '6'], correct: 1 },
    ],
    [
      { code: 'SET count = 0\nREPEAT 4 times:\n  count = count + 2\nPRINT count', options: ['4', '6', '8'], correct: 2 },
      { code: 'IF score > 10:\n  PRINT "Win!"\nELSE:\n  PRINT "Try again"', scenario: 'score = 15', options: ['Win!', 'Try again', 'Error'], correct: 0 },
    ],
  ];

  const currentLevelQuestions = levelData[Math.min(level - 1, levelData.length - 1)];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = currentLevelQuestions[currentQuestion];

  const handleAnswer = () => {
    const isCorrect = selectedAnswer === question.correct;
    const newScore = isCorrect ? score + 1 : score;
    
    if (currentQuestion < currentLevelQuestions.length - 1) {
      if (isCorrect) setScore(newScore);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = newScore;
      const stars = finalScore === currentLevelQuestions.length ? 3 : finalScore >= 1 ? 2 : 1;
      completeGameLevel(gameId, level, stars);
      setCompleted(true);
    }
  };

  if (completed) {
    const finalScore = score + (selectedAnswer === question.correct ? 1 : 0);
    const stars = finalScore === currentLevelQuestions.length ? 3 : finalScore >= 1 ? 2 : 1;
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={stars} 
        title="Pattern Pro! 🧩" 
        message={`${finalScore}/${currentLevelQuestions.length} correct!`}
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🧩 Pattern Match"
          subtitle={`Question ${currentQuestion + 1}/${currentLevelQuestions.length}`}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

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

        <div className="grid grid-cols-3 gap-4 mb-8">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? 'default' : 'outline'}
              size="lg"
              className="h-20 text-2xl"
              onClick={() => setSelectedAnswer(index)}
            >
              {option}
            </Button>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={handleAnswer} disabled={selectedAnswer === null}>
          {currentQuestion < currentLevelQuestions.length - 1 ? 'Next →' : 'Finish'}
        </Button>
      </div>
    </div>
  );
};

// Block Builder Game Component
const BlockBuilderGame = ({ onBack, level, onLevelSelect, gameId }: GameProps) => {
  const levelData = [
    {
      goal: 'Make the robot walk forward and stop.',
      correct: ['start', 'move', 'end'],
      blocks: [
        { id: 'start', label: '🚀 START', color: 'bg-success' },
        { id: 'move', label: '➡️ Move', color: 'bg-primary' },
        { id: 'end', label: '🏁 END', color: 'bg-warning' },
      ]
    },
    {
      goal: 'Make the robot walk in a square (move + turn, twice).',
      correct: ['start', 'repeat', 'move', 'turn', 'end'],
      blocks: [
        { id: 'start', label: '🚀 START', color: 'bg-success' },
        { id: 'move', label: '➡️ Move', color: 'bg-primary' },
        { id: 'turn', label: '↪️ Turn', color: 'bg-secondary' },
        { id: 'repeat', label: '🔄 Repeat 2x', color: 'bg-accent' },
        { id: 'end', label: '🏁 END', color: 'bg-warning' },
      ]
    },
    {
      goal: 'If there\'s a wall, turn. Otherwise move forward. Then stop.',
      correct: ['start', 'if-wall', 'turn', 'else', 'move', 'end'],
      blocks: [
        { id: 'start', label: '🚀 START', color: 'bg-success' },
        { id: 'if-wall', label: '❓ IF wall', color: 'bg-accent' },
        { id: 'turn', label: '↪️ Turn', color: 'bg-secondary' },
        { id: 'else', label: '➡️ ELSE', color: 'bg-accent' },
        { id: 'move', label: '🚶 Move', color: 'bg-primary' },
        { id: 'end', label: '🏁 END', color: 'bg-warning' },
      ]
    },
  ];

  const currentLevel = levelData[Math.min(level - 1, levelData.length - 1)];
  const [placedBlocks, setPlacedBlocks] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  const addBlock = (blockId: string) => {
    if (placedBlocks.length < currentLevel.correct.length + 2) {
      setPlacedBlocks([...placedBlocks, blockId]);
    }
  };

  const removeBlock = (index: number) => {
    setPlacedBlocks(placedBlocks.filter((_, i) => i !== index));
  };

  const checkSolution = () => {
    const isCorrect = 
      placedBlocks.length === currentLevel.correct.length &&
      placedBlocks.every((block, index) => block === currentLevel.correct[index]);
    
    if (isCorrect) {
      const stars = 3;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
    }
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title="Master Builder! 🧱" 
        message="Perfect program!"
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title="🧱 Block Builder"
          subtitle="Build the program!"
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <Card variant="lesson" className="mb-6">
          <CardContent className="p-4">
            <p className="text-lg font-semibold">🎯 {currentLevel.goal}</p>
          </CardContent>
        </Card>

        <Card variant="game" className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Your Program
              <Button variant="ghost" size="sm" onClick={() => setPlacedBlocks([])}>
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[150px] bg-muted/50 rounded-2xl p-4 border-2 border-dashed border-primary/30">
              {placedBlocks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Tap blocks below to add them!
                </p>
              ) : (
                <div className="space-y-2">
                  {placedBlocks.map((blockId, index) => {
                    const block = currentLevel.blocks.find(b => b.id === blockId);
                    return (
                      <motion.div
                        key={`${blockId}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`${block?.color} text-card-foreground p-3 rounded-xl flex items-center justify-between cursor-pointer shadow-md`}
                        onClick={() => removeBlock(index)}
                      >
                        <span className="font-bold">{block?.label}</span>
                        <span className="text-xs opacity-70">×</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="text-lg font-semibold mb-3">Blocks:</p>
          <div className="grid grid-cols-2 gap-3">
            {currentLevel.blocks.map((block) => (
              <motion.div
                key={block.id}
                className={`${block.color} text-card-foreground p-4 rounded-xl cursor-pointer shadow-md text-center font-bold`}
                onClick={() => addBlock(block.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {block.label}
              </motion.div>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={checkSolution} disabled={placedBlocks.length === 0}>
          Run ▶️
        </Button>
      </div>
    </div>
  );
};

export default Play;
