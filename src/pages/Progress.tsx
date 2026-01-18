import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, BookOpen, Gamepad2, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProgress, getXPProgress, XP_PER_LEVEL, MAX_PLAYER_LEVEL, GAME_UNLOCK_LEVELS } from '@/lib/progress';
import { t, getLanguage } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { Mascot } from '@/components/Mascot';
import { StarDisplay } from '@/components/StarDisplay';
import { LevelBadge } from '@/components/LevelSystem';

interface Badge {
  id: string;
  nameKey: keyof typeof import('@/lib/i18n').translations.en;
  icon: string;
  descKey: keyof typeof import('@/lib/i18n').translations.en;
  unlocked: boolean;
}

const Progress = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getProgress());
  const xpProgress = getXPProgress();

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  // Count completed game levels
  const totalGameLevels = Object.values(progress.gameLevels).reduce((acc, game) => {
    return acc + game.starsEarned.filter(s => s > 0).length;
  }, 0);

  const badges: Badge[] = [
    {
      id: 'first-lesson',
      nameKey: 'badgeFirstSteps',
      icon: '🎓',
      descKey: 'badgeFirstStepsDesc',
      unlocked: progress.completedLessons.length >= 1
    },
    {
      id: 'all-lessons',
      nameKey: 'badgeScholar',
      icon: '📚',
      descKey: 'badgeScholarDesc',
      unlocked: progress.completedLessons.length >= 5
    },
    {
      id: 'first-game',
      nameKey: 'badgePlayerOne',
      icon: '🎮',
      descKey: 'badgePlayerOneDesc',
      unlocked: totalGameLevels >= 1
    },
    {
      id: 'quiz-master',
      nameKey: 'badgeQuizMaster',
      icon: '🏆',
      descKey: 'badgeQuizMasterDesc',
      unlocked: Object.values(progress.quizScores).some(score => score >= 80)
    },
    {
      id: 'star-collector',
      nameKey: 'badgeStarCollector',
      icon: '⭐',
      descKey: 'badgeStarCollectorDesc',
      unlocked: progress.totalStars >= 20
    },
    {
      id: 'level-5',
      nameKey: 'badgeRisingStar',
      icon: '🌟',
      descKey: 'badgeRisingStarDesc',
      unlocked: progress.playerLevel >= 5
    },
    {
      id: 'all-unlocked',
      nameKey: 'badgeExplorer',
      icon: '🗺️',
      descKey: 'badgeExplorerDesc',
      unlocked: progress.playerLevel >= 4
    },
    {
      id: 'super-coder',
      nameKey: 'badgeSuperCoder',
      icon: '💻',
      descKey: 'badgeSuperCoderDesc',
      unlocked: progress.playerLevel >= MAX_PLAYER_LEVEL
    }
  ];

  const motivationKeys: (keyof typeof import('@/lib/i18n').translations.en)[] = [
    'motivation1',
    'motivation2',
    'motivation3',
    'motivation4'
  ];

  const randomMessage = t(motivationKeys[Math.floor(Math.random() * motivationKeys.length)]);

  // Games that will unlock at next levels
  const upcomingUnlocks = Object.entries(GAME_UNLOCK_LEVELS)
    .filter(([_, level]) => level > progress.playerLevel)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2);

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
            <h1 className="text-3xl font-black text-foreground">{t('yourProgress')}</h1>
            <p className="text-muted-foreground">{t('seeHowFar')}</p>
          </div>
        </div>

        {/* Level Progress Card */}
        <Card variant="game" className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Mascot mood={progress.playerLevel >= 5 ? 'celebrating' : 'happy'} size="md" />
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <LevelBadge level={progress.playerLevel} size="lg" />
                  <div>
                    <p className="text-2xl font-black text-foreground">{t('level')} {progress.playerLevel}</p>
                    <p className="text-muted-foreground">{randomMessage}</p>
                  </div>
                </div>
                
                {/* XP Progress Bar */}
                {progress.playerLevel < MAX_PLAYER_LEVEL ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold flex items-center gap-1">
                        <Zap className="w-4 h-4 text-warning" />
                        {t('xpProgress')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {xpProgress.current} / {xpProgress.needed} XP
                      </span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress.percent}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {XP_PER_LEVEL - xpProgress.current} {t('xpUntilLevel')} {progress.playerLevel + 1}
                    </p>
                  </div>
                ) : (
                  <div className="bg-success/20 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-success">{t('maxLevelReached')}</p>
                  </div>
                )}

                <StarDisplay count={progress.stars} size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Unlocks */}
        {upcomingUnlocks.length > 0 && (
          <Card variant="lesson" className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t('comingSoon')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {upcomingUnlocks.map(([gameId, level]) => (
                  <div
                    key={gameId}
                    className="bg-muted/50 px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <span className="text-2xl">
                      {gameId === 'bug-hunter' ? '🐛' : gameId === 'block-builder' ? '🧱' : '🎮'}
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{gameId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                      <p className="text-xs text-muted-foreground">{t('unlocksAtLevel')} {level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center p-6">
              <BookOpen className="w-10 h-10 mx-auto text-primary mb-2" />
              <p className="text-3xl font-black text-foreground">{progress.completedLessons.length}</p>
              <p className="text-sm text-muted-foreground">{t('lessons')}</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center p-6">
              <Gamepad2 className="w-10 h-10 mx-auto text-secondary mb-2" />
              <p className="text-3xl font-black text-foreground">{totalGameLevels}</p>
              <p className="text-sm text-muted-foreground">{t('levels')}</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center p-6">
              <Trophy className="w-10 h-10 mx-auto text-warning mb-2" />
              <p className="text-3xl font-black text-foreground">{badges.filter(b => b.unlocked).length}</p>
              <p className="text-sm text-muted-foreground">{t('badges')}</p>
            </Card>
          </motion.div>
        </div>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-accent" />
              {t('badges')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-warning/20 to-secondary/20 border-2 border-warning/30'
                      : 'bg-muted/50 opacity-60'
                  }`}
                >
                  <span className={`text-4xl ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </span>
                  <p className="font-bold mt-2 text-sm">{t(badge.nameKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(badge.descKey)}</p>
                  {badge.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <Star className="w-5 h-5 mx-auto text-warning fill-warning" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Progress;
