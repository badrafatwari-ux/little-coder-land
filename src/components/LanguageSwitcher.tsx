import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getLanguage, setLanguage, Language } from '@/lib/i18n';
import { motion } from 'framer-motion';

export const LanguageSwitcher = () => {
  const [lang, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'id' : 'en';
    setLanguage(newLang);
    setLang(newLang);
    window.location.reload(); // Reload to apply translations
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="font-bold gap-2 px-3 py-2"
      >
        <span className="text-lg">{lang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
        <span>{lang === 'id' ? 'ID' : 'EN'}</span>
      </Button>
    </motion.div>
  );
};
