import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { GameSettings } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GameHeaderProps {
  gameSettings: GameSettings;
  currentEpisode: number;
  onBack: () => void;
}

export const GameHeader = ({ gameSettings, currentEpisode, onBack }: GameHeaderProps) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-background flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="BookOpen" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{gameSettings.name}</h2>
            <p className="text-sm text-muted-foreground">
              Эпизод {currentEpisode} • {gameSettings.role === 'author' ? 'Автор' : 'Герой'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
            <Icon name="Info" size={16} className="mr-2" />
            Сеттинг
          </Button>
          <Button variant="ghost" size="icon" onClick={onBack}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="BookOpen" size={24} className="text-primary" />
              Сеттинг игры
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="font-semibold mb-2">Название</h3>
              <p className="text-muted-foreground">{gameSettings.name}</p>
            </div>
            {gameSettings.setting && (
              <div>
                <h3 className="font-semibold mb-2">Описание мира</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{gameSettings.setting}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Ваша роль</h3>
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