import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { resetProgress } from '@/lib/progress';
import { t } from '@/lib/i18n';
import { useState } from 'react';
import { Mascot } from '@/components/Mascot';

const Settings = () => {
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetProgress();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-foreground">{t('settings')}</h1>
        </div>

        {/* About */}
        <Card variant="lesson" className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t('aboutThisApp')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Mascot mood="happy" size="sm" />
              <div>
                <p className="text-lg font-semibold mb-2">{t('programmingForKids')}</p>
                <p className="text-muted-foreground">
                  {t('appDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Progress */}
        <Card variant="warning" className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              {t('resetProgress')}
            </CardTitle>
            <CardDescription>
              {t('resetWarning')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResetConfirm ? (
              <Button variant="destructive" onClick={() => setShowResetConfirm(true)}>
                {t('resetAllProgress')}
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-lg font-semibold text-destructive">
                  {t('areYouSure')}
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                    {t('cancel')}
                  </Button>
                  <Button variant="destructive" onClick={handleReset}>
                    {t('yesResetEverything')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {t('madeWithLove')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('version')} 1.0.0
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
