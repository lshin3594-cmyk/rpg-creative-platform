export const useSoundEffects = () => {
  const playSound = (frequency: number, duration: number = 0.3) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playCardSound = () => {
    playSound(1000, 0.2);
  };

  const playNavigationSound = (direction: 'next' | 'prev') => {
    playSound(direction === 'next' ? 900 : 600);
  };

  const playCreateSound = () => {
    playSound(1200, 0.4);
  };

  const playDeleteSound = () => {
    playSound(400, 0.3);
  };

  const playStorySound = () => {
    playSound(1200, 0.5);
  };

  const playSaveSound = () => {
    playSound(1500, 0.4);
  };

  return {
    playSound,
    playCardSound,
    playNavigationSound,
    playCreateSound,
    playDeleteSound,
    playStorySound,
    playSaveSound
  };
};
