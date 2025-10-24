import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState, useRef } from 'react';

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    title: string;
    content: string;
    illustration?: string;
  };
}

export const StoryViewer = ({ isOpen, onClose, story }: StoryViewerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoadingAudio(true);
    try {
      const response = await fetch('https://functions.poehali.dev/YOUR_TTS_FUNCTION_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: story.content.substring(0, 5000)
        })
      });

      const data = await response.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        audioRef.current = audio;
        
        audio.onended = () => setIsPlaying(false);
        audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif">{story.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {story.illustration && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <img 
                src={story.illustration} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handlePlayAudio}
              disabled={isLoadingAudio}
            >
              {isLoadingAudio ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : isPlaying ? (
                <Icon name="Pause" size={18} />
              ) : (
                <Icon name="Play" size={18} />
              )}
              {isLoadingAudio ? 'Генерация...' : isPlaying ? 'Пауза' : 'Озвучить историю'}
            </Button>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {story.content}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
