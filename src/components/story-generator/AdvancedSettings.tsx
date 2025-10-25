import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface AdvancedSettingsProps {
  episodeLength: number;
  setEpisodeLength?: (value: number) => void;
  imagesPerEpisode: number;
  setImagesPerEpisode?: (value: number) => void;
  playerInstructions: string;
  setPlayerInstructions?: (value: string) => void;
}

export const AdvancedSettings = ({
  episodeLength,
  setEpisodeLength,
  imagesPerEpisode,
  setImagesPerEpisode,
  playerInstructions,
  setPlayerInstructions
}: AdvancedSettingsProps) => {
  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm flex items-center gap-2">
            <Icon name="FileText" size={16} className="text-primary" />
            Длина эпизода
          </Label>
          <span className="text-xs font-semibold text-primary">{episodeLength} символов</span>
        </div>
        <Slider
          value={[episodeLength]}
          onValueChange={(value) => setEpisodeLength?.(value[0])}
          min={500}
          max={3000}
          step={100}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Оптимально: 1000-2000 символов
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm flex items-center gap-2">
            <Icon name="Image" size={16} className="text-primary" />
            Изображений на эпизод
          </Label>
          <span className="text-xs font-semibold text-primary">{imagesPerEpisode}</span>
        </div>
        <Slider
          value={[imagesPerEpisode]}
          onValueChange={(value) => setImagesPerEpisode?.(value[0])}
          min={0}
          max={5}
          step={1}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          0 = без изображений, 5 = максимум визуализации
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="player-instructions" className="text-sm flex items-center gap-2">
          <Icon name="Scroll" size={16} className="text-primary" />
          Инструкции для игрока
        </Label>
        <Textarea
          id="player-instructions"
          placeholder="Опциональные подсказки: цели, правила, механики игры..."
          value={playerInstructions}
          onChange={(e) => setPlayerInstructions?.(e.target.value)}
          className="min-h-[80px] text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Это поможет ИИ создать лучший игровой опыт
        </p>
      </div>
    </div>
  );
};
