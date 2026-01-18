export type Language = 'en' | 'id';

const LANGUAGE_KEY = 'app_language';

export const getLanguage = (): Language => {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === 'en' || stored === 'id') return stored;
  return 'id'; // Default to Indonesian
};

export const setLanguage = (lang: Language) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};

export const translations = {
  en: {
    // Homepage
    programming: 'Programming',
    forKids: 'for Kids',
    tagline: 'Learn to code through fun games! 🎮',
    learn: 'Learn',
    play: 'Play',
    quiz: 'Quiz',
    progress: 'Progress',
    
    // Learn page
    learnProgramming: 'Learn Programming',
    tapLessonToStart: 'Tap a lesson to start learning! 📚',
    whatIsIt: 'What is it?',
    example: 'Example',
    tryIt: 'Try it!',
    back: 'Back',
    next: 'Next →',
    complete: 'Complete! ⭐',
    
    // Lessons
    lessonProgram: 'What is a Program?',
    lessonProgramDesc: 'Learn what programs are and how they work',
    lessonProgramExplanation: 'A program is like a recipe for a computer! Just like a recipe tells you step by step how to make a cake, a program tells the computer what to do.',
    lessonProgramExample: 'When you play a game, a program tells the computer to show pictures, play sounds, and respond when you press buttons!',
    lessonProgramInteractive: 'Think of your morning routine as a program: Wake up → Brush teeth → Eat breakfast → Get dressed → Go to school!',
    
    lessonSequence: 'Sequence',
    lessonSequenceDesc: 'Steps that happen one after another',
    lessonSequenceExplanation: 'A sequence is when things happen in order, one step at a time. The computer follows instructions from top to bottom!',
    lessonSequenceExample: 'Making a sandwich: 1. Get bread 2. Add peanut butter 3. Add jelly 4. Put bread on top',
    lessonSequenceInteractive: "The order matters! You can't eat the sandwich before you make it!",
    
    lessonLoops: 'Loops',
    lessonLoopsDesc: 'Repeating actions over and over',
    lessonLoopsExplanation: 'A loop repeats the same actions multiple times. Instead of writing the same thing 10 times, we use a loop!',
    lessonLoopsExample: 'Brushing teeth: Repeat 30 times → Move brush up and down',
    lessonLoopsInteractive: 'Imagine drawing 100 stars. With a loop, you just say "draw a star, repeat 100 times"!',
    
    lessonConditions: 'If / Else',
    lessonConditionsDesc: 'Making decisions in code',
    lessonConditionsExplanation: 'Conditions let the computer make choices. IF something is true, do one thing. ELSE, do something different!',
    lessonConditionsExample: 'IF it is raining → Take umbrella, ELSE → Wear sunglasses',
    lessonConditionsInteractive: 'Games use conditions: IF player touches coin → Add points, ELSE IF player touches enemy → Lose life',
    
    lessonVariables: 'Variables',
    lessonVariablesDesc: 'Boxes that store information',
    lessonVariablesExplanation: "A variable is like a labeled box that holds something. You can put things in, take things out, and change what's inside!",
    lessonVariablesExample: 'score = 0 (a box called "score" with 0 inside). When you get a point: score = score + 1',
    lessonVariablesInteractive: 'Your name is stored in a variable! playerName = "Alex"',
    
    // Play page
    playGames: 'Play Games',
    completeLevelsToUnlock: 'Complete levels to unlock more! 🎮',
    chooseLevel: 'Choose a level',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    backToGames: 'Back to Games',
    nextLevel: 'Next Level →',
    levelComplete: 'Level {level} complete!',
    amazing: 'Amazing! 🎉',
    
    // Games
    gameSequenceRobot: 'Robot Sequence',
    gameSequenceRobotDesc: 'Put the steps in order!',
    gamePatternMatch: 'Pattern Match',
    gamePatternMatchDesc: 'Match code to output!',
    gameMemoryMatch: 'Memory Match',
    gameMemoryMatchDesc: 'Match code symbols!',
    gameLoopPatterns: 'Loop Patterns',
    gameLoopPatternsDesc: 'Complete the pattern!',
    gameDecisionPath: 'Decision Path',
    gameDecisionPathDesc: 'Choose the right path!',
    gameNumberSort: 'Number Sort',
    gameNumberSortDesc: 'Sort numbers in order!',
    gameBugHunter: 'Bug Hunter',
    gameBugHunterDesc: 'Find the bug in the code!',
    gameVariableVault: 'Variable Vault',
    gameVariableVaultDesc: 'Track variable values!',
    gameColorCode: 'Color Code',
    gameColorCodeDesc: 'Remember the sequence!',
    gameBlockBuilder: 'Block Builder',
    gameBlockBuilderDesc: 'Build with visual blocks!',
    gameArrayAdventure: 'Array Adventure',
    gameArrayAdventureDesc: 'Learn array indexing!',
    gameFunctionFactory: 'Function Factory',
    gameFunctionFactoryDesc: 'Predict function output!',
    
    // Quiz page
    quizTime: 'Quiz Time!',
    question: 'Question',
    of: 'of',
    pts: 'pts',
    checkAnswer: 'Check Answer',
    nextQuestion: 'Next Question →',
    seeResults: 'See Results',
    correct: 'Correct! Great job! 🎉',
    notQuite: 'Not quite! Keep trying! 💪',
    tryAgain: 'Try Again',
    home: 'Home',
    
    // Quiz questions
    q1Question: 'What is a program?',
    q1Option1: 'A TV show',
    q1Option2: 'Instructions for a computer',
    q1Option3: 'A type of food',
    q1Option4: 'A game controller',
    
    q2Question: 'What does a LOOP do?',
    q2Option1: 'Makes things disappear',
    q2Option2: 'Repeats actions',
    q2Option3: 'Stops the program',
    q2Option4: 'Plays music',
    
    q3Question: 'IF it is raining, what should you do?',
    q3Option1: 'Take umbrella',
    q3Option2: 'Wear sunglasses',
    q3Option3: 'Go swimming',
    q3Option4: 'Fly a kite',
    
    q4Question: 'What is a VARIABLE?',
    q4Option1: 'A type of robot',
    q4Option2: 'A box that stores information',
    q4Option3: 'A loud sound',
    q4Option4: 'A dance move',
    
    q5Question: 'What is SEQUENCE in coding?',
    q5Option1: 'Random order',
    q5Option2: 'Steps in order',
    q5Option3: 'Backwards steps',
    q5Option4: 'Skip steps',
    
    // Progress page
    yourProgress: 'Your Progress',
    seeHowFar: "See how far you've come! 📈",
    level: 'Level',
    xpProgress: 'XP Progress',
    xpUntilLevel: 'XP until Level',
    maxLevelReached: '🎉 MAX LEVEL REACHED!',
    comingSoon: '🔓 Coming Soon',
    unlocksAtLevel: 'Unlocks at Level',
    lessons: 'Lessons',
    levels: 'Levels',
    badges: 'Badges',
    
    // Badges
    badgeFirstSteps: 'First Steps',
    badgeFirstStepsDesc: 'Complete your first lesson',
    badgeScholar: 'Scholar',
    badgeScholarDesc: 'Complete all lessons',
    badgePlayerOne: 'Player One',
    badgePlayerOneDesc: 'Complete your first game level',
    badgeQuizMaster: 'Quiz Master',
    badgeQuizMasterDesc: 'Score 80% or higher on quiz',
    badgeStarCollector: 'Star Collector',
    badgeStarCollectorDesc: 'Earn 20 stars',
    badgeRisingStar: 'Rising Star',
    badgeRisingStarDesc: 'Reach Level 5',
    badgeExplorer: 'Explorer',
    badgeExplorerDesc: 'Unlock all games',
    badgeSuperCoder: 'Super Coder',
    badgeSuperCoderDesc: 'Reach max level',
    
    // Motivation messages
    motivation1: "You're doing amazing! Keep it up! 🚀",
    motivation2: 'Every expert was once a beginner! 💪',
    motivation3: 'Learning to code is like a superpower! ⚡',
    motivation4: "You're on your way to becoming a coder! 🌟",
    
    // Settings page
    settings: 'Settings',
    aboutThisApp: 'About This App',
    programmingForKids: 'Programming for Kids',
    appDescription: 'Learn the basics of programming through fun games and lessons! This app works completely offline - no internet needed.',
    resetProgress: 'Reset Progress',
    resetWarning: 'This will delete all your stars, badges, and completed lessons.',
    resetAllProgress: 'Reset All Progress',
    areYouSure: 'Are you sure? This cannot be undone!',
    cancel: 'Cancel',
    yesResetEverything: 'Yes, Reset Everything',
    madeWithLove: 'Made with ❤️ for young coders everywhere!',
    version: 'Version',
    
    // Game UI
    dragStepsInOrder: 'Drag the steps into the correct order!',
    checkOrder: 'Check Order ✓',
    difficulty: 'difficulty',
  },
  id: {
    // Homepage
    programming: 'Pemrograman',
    forKids: 'untuk Anak',
    tagline: 'Belajar coding dengan permainan seru! 🎮',
    learn: 'Belajar',
    play: 'Main',
    quiz: 'Kuis',
    progress: 'Kemajuan',
    
    // Learn page
    learnProgramming: 'Belajar Pemrograman',
    tapLessonToStart: 'Ketuk pelajaran untuk mulai belajar! 📚',
    whatIsIt: 'Apa itu?',
    example: 'Contoh',
    tryIt: 'Coba!',
    back: 'Kembali',
    next: 'Lanjut →',
    complete: 'Selesai! ⭐',
    
    // Lessons
    lessonProgram: 'Apa itu Program?',
    lessonProgramDesc: 'Pelajari apa itu program dan cara kerjanya',
    lessonProgramExplanation: 'Program itu seperti resep untuk komputer! Sama seperti resep yang memberi tahu langkah demi langkah cara membuat kue, program memberi tahu komputer apa yang harus dilakukan.',
    lessonProgramExample: 'Saat kamu bermain game, program memberi tahu komputer untuk menampilkan gambar, memutar suara, dan merespons saat kamu menekan tombol!',
    lessonProgramInteractive: 'Bayangkan rutinitas pagi sebagai program: Bangun tidur → Sikat gigi → Sarapan → Berpakaian → Pergi sekolah!',
    
    lessonSequence: 'Urutan',
    lessonSequenceDesc: 'Langkah yang terjadi satu per satu',
    lessonSequenceExplanation: 'Urutan adalah ketika hal-hal terjadi secara berurutan, satu langkah pada satu waktu. Komputer mengikuti instruksi dari atas ke bawah!',
    lessonSequenceExample: 'Membuat roti lapis: 1. Ambil roti 2. Tambah selai kacang 3. Tambah jeli 4. Tutup dengan roti',
    lessonSequenceInteractive: 'Urutan itu penting! Kamu tidak bisa makan roti lapis sebelum membuatnya!',
    
    lessonLoops: 'Perulangan',
    lessonLoopsDesc: 'Mengulang aksi berulang kali',
    lessonLoopsExplanation: 'Perulangan mengulang aksi yang sama berkali-kali. Daripada menulis hal yang sama 10 kali, kita pakai perulangan!',
    lessonLoopsExample: 'Sikat gigi: Ulangi 30 kali → Gerakkan sikat naik turun',
    lessonLoopsInteractive: 'Bayangkan menggambar 100 bintang. Dengan perulangan, cukup bilang "gambar bintang, ulangi 100 kali"!',
    
    lessonConditions: 'Jika / Lainnya',
    lessonConditionsDesc: 'Membuat keputusan dalam kode',
    lessonConditionsExplanation: 'Kondisi memungkinkan komputer membuat pilihan. JIKA sesuatu benar, lakukan satu hal. LAINNYA, lakukan hal berbeda!',
    lessonConditionsExample: 'JIKA hujan → Bawa payung, LAINNYA → Pakai kacamata hitam',
    lessonConditionsInteractive: 'Game pakai kondisi: JIKA pemain menyentuh koin → Tambah poin, JIKA pemain menyentuh musuh → Kurangi nyawa',
    
    lessonVariables: 'Variabel',
    lessonVariablesDesc: 'Kotak yang menyimpan informasi',
    lessonVariablesExplanation: 'Variabel seperti kotak berlabel yang menyimpan sesuatu. Kamu bisa memasukkan, mengeluarkan, dan mengubah isinya!',
    lessonVariablesExample: 'skor = 0 (kotak bernama "skor" berisi 0). Saat dapat poin: skor = skor + 1',
    lessonVariablesInteractive: 'Namamu disimpan dalam variabel! namaPemain = "Budi"',
    
    // Play page
    playGames: 'Main Game',
    completeLevelsToUnlock: 'Selesaikan level untuk membuka lebih banyak! 🎮',
    chooseLevel: 'Pilih level',
    easy: 'Mudah',
    medium: 'Sedang',
    hard: 'Sulit',
    backToGames: 'Kembali ke Game',
    nextLevel: 'Level Berikutnya →',
    levelComplete: 'Level {level} selesai!',
    amazing: 'Luar Biasa! 🎉',
    
    // Games
    gameSequenceRobot: 'Robot Berurutan',
    gameSequenceRobotDesc: 'Susun langkah-langkah dengan benar!',
    gamePatternMatch: 'Cocokkan Pola',
    gamePatternMatchDesc: 'Cocokkan kode dengan output!',
    gameMemoryMatch: 'Cocokkan Memori',
    gameMemoryMatchDesc: 'Cocokkan simbol kode!',
    gameLoopPatterns: 'Pola Perulangan',
    gameLoopPatternsDesc: 'Lengkapi polanya!',
    gameDecisionPath: 'Jalur Keputusan',
    gameDecisionPathDesc: 'Pilih jalur yang benar!',
    gameNumberSort: 'Urutkan Angka',
    gameNumberSortDesc: 'Urutkan angka dengan benar!',
    gameBugHunter: 'Pemburu Bug',
    gameBugHunterDesc: 'Temukan bug di kode!',
    gameVariableVault: 'Brankas Variabel',
    gameVariableVaultDesc: 'Lacak nilai variabel!',
    gameColorCode: 'Kode Warna',
    gameColorCodeDesc: 'Ingat urutannya!',
    gameBlockBuilder: 'Pembangun Blok',
    gameBlockBuilderDesc: 'Bangun dengan blok visual!',
    gameArrayAdventure: 'Petualangan Array',
    gameArrayAdventureDesc: 'Pelajari indeks array!',
    gameFunctionFactory: 'Pabrik Fungsi',
    gameFunctionFactoryDesc: 'Prediksi output fungsi!',
    
    // Quiz page
    quizTime: 'Waktu Kuis!',
    question: 'Pertanyaan',
    of: 'dari',
    pts: 'poin',
    checkAnswer: 'Periksa Jawaban',
    nextQuestion: 'Pertanyaan Berikutnya →',
    seeResults: 'Lihat Hasil',
    correct: 'Benar! Bagus sekali! 🎉',
    notQuite: 'Belum tepat! Terus coba! 💪',
    tryAgain: 'Coba Lagi',
    home: 'Beranda',
    
    // Quiz questions
    q1Question: 'Apa itu program?',
    q1Option1: 'Acara TV',
    q1Option2: 'Instruksi untuk komputer',
    q1Option3: 'Jenis makanan',
    q1Option4: 'Pengontrol game',
    
    q2Question: 'Apa fungsi PERULANGAN?',
    q2Option1: 'Membuat hilang',
    q2Option2: 'Mengulang aksi',
    q2Option3: 'Menghentikan program',
    q2Option4: 'Memutar musik',
    
    q3Question: 'JIKA hujan, apa yang harus kamu lakukan?',
    q3Option1: 'Bawa payung',
    q3Option2: 'Pakai kacamata hitam',
    q3Option3: 'Pergi berenang',
    q3Option4: 'Main layang-layang',
    
    q4Question: 'Apa itu VARIABEL?',
    q4Option1: 'Jenis robot',
    q4Option2: 'Kotak penyimpan informasi',
    q4Option3: 'Suara keras',
    q4Option4: 'Gerakan tari',
    
    q5Question: 'Apa itu URUTAN dalam coding?',
    q5Option1: 'Urutan acak',
    q5Option2: 'Langkah berurutan',
    q5Option3: 'Langkah mundur',
    q5Option4: 'Melewati langkah',
    
    // Progress page
    yourProgress: 'Kemajuanmu',
    seeHowFar: 'Lihat seberapa jauh kamu sudah belajar! 📈',
    level: 'Level',
    xpProgress: 'Kemajuan XP',
    xpUntilLevel: 'XP menuju Level',
    maxLevelReached: '🎉 LEVEL MAKSIMAL TERCAPAI!',
    comingSoon: '🔓 Segera Hadir',
    unlocksAtLevel: 'Terbuka di Level',
    lessons: 'Pelajaran',
    levels: 'Level',
    badges: 'Lencana',
    
    // Badges
    badgeFirstSteps: 'Langkah Pertama',
    badgeFirstStepsDesc: 'Selesaikan pelajaran pertamamu',
    badgeScholar: 'Cendekia',
    badgeScholarDesc: 'Selesaikan semua pelajaran',
    badgePlayerOne: 'Pemain Satu',
    badgePlayerOneDesc: 'Selesaikan level game pertamamu',
    badgeQuizMaster: 'Master Kuis',
    badgeQuizMasterDesc: 'Dapatkan skor 80% atau lebih',
    badgeStarCollector: 'Kolektor Bintang',
    badgeStarCollectorDesc: 'Kumpulkan 20 bintang',
    badgeRisingStar: 'Bintang Baru',
    badgeRisingStarDesc: 'Capai Level 5',
    badgeExplorer: 'Penjelajah',
    badgeExplorerDesc: 'Buka semua game',
    badgeSuperCoder: 'Super Coder',
    badgeSuperCoderDesc: 'Capai level maksimal',
    
    // Motivation messages
    motivation1: 'Kamu luar biasa! Terus semangat! 🚀',
    motivation2: 'Setiap ahli pernah menjadi pemula! 💪',
    motivation3: 'Belajar coding seperti punya kekuatan super! ⚡',
    motivation4: 'Kamu sedang menuju menjadi programmer! 🌟',
    
    // Settings page
    settings: 'Pengaturan',
    aboutThisApp: 'Tentang Aplikasi',
    programmingForKids: 'Pemrograman untuk Anak',
    appDescription: 'Belajar dasar-dasar pemrograman melalui permainan dan pelajaran yang menyenangkan! Aplikasi ini bekerja sepenuhnya offline - tidak perlu internet.',
    resetProgress: 'Reset Kemajuan',
    resetWarning: 'Ini akan menghapus semua bintang, lencana, dan pelajaran yang sudah selesai.',
    resetAllProgress: 'Reset Semua Kemajuan',
    areYouSure: 'Apakah kamu yakin? Ini tidak bisa dibatalkan!',
    cancel: 'Batal',
    yesResetEverything: 'Ya, Reset Semuanya',
    madeWithLove: 'Dibuat dengan ❤️ untuk coder muda di seluruh dunia!',
    version: 'Versi',
    
    // Game UI
    dragStepsInOrder: 'Seret langkah-langkah ke urutan yang benar!',
    checkOrder: 'Periksa Urutan ✓',
    difficulty: 'kesulitan',
  }
};

export const t = (key: keyof typeof translations.en): string => {
  const lang = getLanguage();
  return translations[lang][key] || translations.en[key] || key;
};

export const useTranslation = () => {
  return { t, getLanguage, setLanguage };
};
