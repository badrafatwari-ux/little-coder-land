// Web Audio API sound effects generator
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Resume audio context on user interaction (required by browsers)
export const initAudio = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};

// Button click - short pop sound
export const playClick = () => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
};

// Correct answer - happy ascending chime
export const playCorrect = () => {
  const ctx = getAudioContext();
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    const startTime = ctx.currentTime + i * 0.1;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
};

// Wrong answer - descending buzz
export const playWrong = () => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(300, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.2);
};

// Star earned - sparkling sound
export const playStar = () => {
  const ctx = getAudioContext();
  const frequencies = [987.77, 1318.51, 1567.98, 1975.53]; // B5, E6, G6, B6
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    const startTime = ctx.currentTime + i * 0.08;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.25);
  });
};

// Level up - triumphant fanfare
export const playLevelUp = () => {
  const ctx = getAudioContext();
  const notes = [
    { freq: 523.25, time: 0 },      // C5
    { freq: 659.25, time: 0.15 },   // E5
    { freq: 783.99, time: 0.3 },    // G5
    { freq: 1046.5, time: 0.45 },   // C6
  ];
  
  notes.forEach(({ freq, time }) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime + time);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime + time);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.4);
    
    oscillator.start(ctx.currentTime + time);
    oscillator.stop(ctx.currentTime + time + 0.4);
  });
};

// Badge earned - achievement unlock sound
export const playBadge = () => {
  const ctx = getAudioContext();
  
  // First part: ascending arpeggio
  const arpeggio = [392, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
  arpeggio.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    const t = ctx.currentTime + i * 0.06;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);
  });
  
  // Second part: final chord
  const chord = [783.99, 987.77, 1174.66]; // G5, B5, D6
  chord.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    const t = ctx.currentTime + 0.3;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    osc.start(t);
    osc.stop(t + 0.6);
  });
};

// Game complete - celebration melody
export const playGameComplete = () => {
  const ctx = getAudioContext();
  const melody = [
    { freq: 523.25, time: 0, dur: 0.15 },
    { freq: 587.33, time: 0.15, dur: 0.15 },
    { freq: 659.25, time: 0.3, dur: 0.15 },
    { freq: 783.99, time: 0.45, dur: 0.15 },
    { freq: 659.25, time: 0.6, dur: 0.15 },
    { freq: 783.99, time: 0.75, dur: 0.15 },
    { freq: 1046.5, time: 0.9, dur: 0.4 },
  ];
  
  melody.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + time + 0.02);
    gain.gain.setValueAtTime(0.35, ctx.currentTime + time + dur - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + dur);
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur);
  });
};

// Navigation/tap sound
export const playTap = () => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};
