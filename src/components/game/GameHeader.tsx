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
      <div className="relative p-4 border-b border-primary/30 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSettings(true)}
            className="border border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
          >
            <Icon name="FileText" size={16} className="mr-2" />
            Саммари партии
          </Button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl" />
              <div className="relative flex items-center gap-4 px-8 py-3 bg-black/60 border-2 border-primary/60 clip-hexagon">
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <Icon name="ChevronLeft" size={24} />
                </button>
                
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={20} className="text-primary" />
                  <span className="text-lg font-bold text-foreground">Ход: {currentEpisode}</span>
                </div>

                <button className="text-primary hover:text-primary/80 transition-colors">
                  <Icon name="ChevronRight" size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <div className="text-xs text-muted-foreground">{gameSettings.role === 'author' ? 'Автор' : 'Герой'}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-primary/10">
              <Icon name="X" size={20} />
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
