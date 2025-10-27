import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { GameSettings, SAVE_STORY_URL } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface GameHeaderProps {
  gameSettings: GameSettings;
  currentEpisode: number;
  messages?: Array<{ type: string; content: string }>;
  onBack: () => void;
}

export const GameHeader = ({ gameSettings, currentEpisode, messages = [], onBack }: GameHeaderProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const handleSaveToLibrary = async () => {
    try {
      const storyContent = messages.map(m => `[${m.type === 'user' ? 'Игрок' : 'ИИ'}]: ${m.content}`).join('\n\n');
      const response = await fetch(SAVE_STORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: gameSettings.name,
          content: storyContent,
          genre: gameSettings.genre || 'Фэнтези',
          story_context: storyContent
        })
      });

      if (response.ok) {
        toast({
          title: "Сохранено!",
          description: "Игра добавлена в библиотеку"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить игру",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="relative p-2 md:p-4 border-b border-primary/30 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSettings(true)}
            className="border border-primary/50 hover:border-primary hover:bg-primary/10 transition-all text-xs md:text-sm px-2 md:px-4"
          >
            <Icon name="FileText" size={14} className="md:mr-2" />
            <span className="hidden md:inline">Саммари партии</span>
          </Button>

          <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-black/60 border border-primary/60 rounded-lg">
            <Icon name="Zap" size={16} className="text-primary md:w-5 md:h-5" />
            <span className="text-sm md:text-lg font-bold text-foreground">Эп. {currentEpisode}</span>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSaveToLibrary}
              className="border border-green-500/50 hover:border-green-500 hover:bg-green-500/10 transition-all text-xs md:text-sm px-2 md:px-4"
            >
              <Icon name="Save" size={14} className="md:mr-2" />
              <span className="hidden md:inline">Сохранить</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-primary/10 w-8 h-8 md:w-10 md:h-10">
              <Icon name="X" size={16} className="md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl bg-black/95 border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Icon name="BookOpen" size={24} />
              {gameSettings.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {gameSettings.setting && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-primary/80">Описание мира</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{gameSettings.setting}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-primary/80">Ваша роль</h3>
              <p className="text-muted-foreground">
                {gameSettings.role === 'author' ? 'Автор — вы управляете историей и персонажами' : 'Герой — вы играете за главного героя'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};