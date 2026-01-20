import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getGameLevel, completeGameLevel } from '@/lib/progress';
import { StarDisplay } from '@/components/StarDisplay';
import { Mascot } from '@/components/Mascot';
import { playTap, playCorrect, playWrong, playGameComplete, playStar } from '@/lib/sounds';
import { t } from '@/lib/i18n';

interface MemoryMatchGameProps {
  onBack: () => void;
  level: number;
  onLevelSelect: () => void;
  gameId: string;
}

interface MemoryCard {
  id: number;
  symbol: string;
  code: string;
  isFlipped: boolean;
  isMatched: boolean;
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
        <Button variant="outline" size="lg" onClick={onBack}>{t('backToGames')}</Button>
        {hasNextLevel && onNextLevel && (
          <Button size="lg" onClick={onNextLevel}>{t('nextLevel')}</Button>
        )}
      </div>
    </motion.div>
  </div>
);

export const MemoryMatchGame = ({ onBack, level, onLevelSelect, gameId }: MemoryMatchGameProps) => {
  const levelData = [
    [
      { symbol: '🔄', code: 'LOOP' },
      { symbol: '❓', code: 'IF' },
      { symbol: '📦', code: 'VAR' },
    ],
    [
      { symbol: '🔄', code: 'LOOP' },
      { symbol: '❓', code: 'IF' },
      { symbol: '📦', code: 'VAR' },
      { symbol: '➡️', code: 'FUNC' },
    ],
    [
      { symbol: '🔄', code: 'LOOP' },
      { symbol: '❓', code: 'IF' },
      { symbol: '📦', code: 'VAR' },
      { symbol: '➡️', code: 'FUNC' },
      { symbol: '📋', code: 'ARRAY' },
      { symbol: '🎯', code: 'RETURN' },
    ],
  ];

  const currentLevelPairs = levelData[Math.min(level - 1, levelData.length - 1)];
  
  const createCards = (): MemoryCard[] => {
    const cards: MemoryCard[] = [];
    currentLevelPairs.forEach((pair, index) => {
      cards.push(
        { id: index * 2, symbol: pair.symbol, code: pair.symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol: pair.code, code: pair.symbol, isFlipped: false, isMatched: false }
      );
    });
    return cards.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<MemoryCard[]>(() => createCards());
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.code === secondCard.code) {
        playCorrect();
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ));
          setSelectedCards([]);
        }, 500);
      } else {
        playWrong();
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setSelectedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [selectedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      const maxMoves = currentLevelPairs.length * 2;
      const stars = moves <= maxMoves ? 3 : moves <= maxMoves + 3 ? 2 : 1;
      setEarned(stars);
      setCompleted(true);
      completeGameLevel(gameId, level, stars);
      playGameComplete();
      setTimeout(() => playStar(), 300);
    }
  }, [cards, moves, gameId, level, currentLevelPairs.length]);

  const handleCardClick = (cardId: number) => {
    if (selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playTap();
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setSelectedCards(prev => [...prev, cardId]);
  };

  if (completed) {
    const gameProgress = getGameLevel(gameId);
    return (
      <CompletionScreen 
        onBack={onBack} 
        stars={earned} 
        title={t('memoryMaster')}
        message={`${t('completedIn')} ${moves} ${t('moves')}!`}
        hasNextLevel={level < gameProgress.maxLevel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={`🧠 ${t('memoryMatch')}`}
          subtitle={t('matchSymbols')}
          level={level}
          onBack={onBack}
          onLevelSelect={onLevelSelect}
        />

        <div className="text-center mb-4">
          <span className="text-lg font-semibold">{t('movesCount')} {moves}</span>
        </div>

        <div className={`grid gap-3 ${currentLevelPairs.length <= 3 ? 'grid-cols-3' : currentLevelPairs.length <= 4 ? 'grid-cols-4' : 'grid-cols-4'}`}>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className={`aspect-square rounded-2xl cursor-pointer flex items-center justify-center text-2xl font-bold ${
                card.isFlipped || card.isMatched 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              } ${card.isMatched ? 'opacity-60' : ''}`}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {(card.isFlipped || card.isMatched) ? card.symbol : '?'}
            </motion.div>
          ))}
        </div>

        <Button 
          variant="outline" 
          size="lg" 
          className="w-full mt-6" 
          onClick={() => {
            setCards(createCards());
            setSelectedCards([]);
            setMoves(0);
          }}
        >
          {t('restart')}
        </Button>
      </div>
    </div>
  );
};
