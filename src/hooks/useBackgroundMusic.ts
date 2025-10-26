import { useEffect, useRef, useState } from 'react';

const MUSIC_TRACKS = [
  'https://cdn.poehali.dev/audio/ambient-1.mp3',
  'https://cdn.poehali.dev/audio/lofi-1.mp3'
];

export const useBackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_TRACKS[currentTrack]);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    const savedState = localStorage.getItem('background-music-enabled');
    if (savedState === 'true') {
      play();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrack]);

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        localStorage.setItem('background-music-enabled', 'true');
      } catch (error) {
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('background-music-enabled', 'false');
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % MUSIC_TRACKS.length);
  };

  return {
    isPlaying,
    toggle,
    nextTrack,
    currentTrack: currentTrack + 1,
    totalTracks: MUSIC_TRACKS.length
  };
};