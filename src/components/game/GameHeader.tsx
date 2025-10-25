import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { GameSettings } from './types';

interface GameHeaderProps {
  gameSettings: GameSettings;
  currentEpisode: number;
  onBack: () => void;
}

export const GameHeader = ({ gameSettings, currentEpisode, onBack }: GameHeaderProps) => {
  return (
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
        <Button variant="ghost" size="icon" onClick={onBack}>
          <Icon name="X" size={20} />
        </Button>
      </div>
    </div>
  );
};
