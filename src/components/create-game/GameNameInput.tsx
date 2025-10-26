import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface GameNameInputProps {
  gameName: string;
  setGameName: (name: string) => void;
  onGenerateRandom: () => void;
}

export const GameNameInput = ({ gameName, setGameName, onGenerateRandom }: GameNameInputProps) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="gameName" className="text-purple-100 text-base">
          Введите название игры
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGenerateRandom}
          className="gap-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
        >
          <Icon name="Sparkles" size={16} />
          Случайно
        </Button>
      </div>
      <Input
        id="gameName"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        placeholder="Введите название игры"
        className="text-lg bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
      />
    </div>
  );
};
