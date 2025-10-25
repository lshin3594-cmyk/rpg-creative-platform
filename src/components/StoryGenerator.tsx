import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string;
}

interface StoryGeneratorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storyPrompt: string;
  setStoryPrompt: (prompt: string) => void;
  selectedCharacter: string;
  setSelectedCharacter: (id: string) => void;
  selectedWorld: string;
  setSelectedWorld: (id: string) => void;
  isGenerating: boolean;
  generatedStory: string;
  onGenerate: () => void;
  characters: Character[];
  worlds: World[];
  episodeLength?: number;
  setEpisodeLength?: (value: number) => void;
  imagesPerEpisode?: number;
  setImagesPerEpisode?: (value: number) => void;
  playerInstructions?: string;
  setPlayerInstructions?: (value: string) => void;
  autoGenerateNPCs?: boolean;
  setAutoGenerateNPCs?: (value: boolean) => void;
}

export const StoryGenerator = ({
  isOpen,
  onOpenChange,
  storyPrompt,
  setStoryPrompt,
  selectedCharacter,
  setSelectedCharacter,
  selectedWorld,
  setSelectedWorld,
  isGenerating,
  generatedStory,
  onGenerate,
  characters,
  worlds,
  episodeLength = 1500,
  setEpisodeLength,
  imagesPerEpisode = 2,
  setImagesPerEpisode,
  playerInstructions = '',
  setPlayerInstructions,
  autoGenerateNPCs = true,
  setAutoGenerateNPCs
}: StoryGeneratorProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <div className="flex justify-center mb-8">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-3 text-lg py-6 px-8">
            <Icon name="Sparkles" size={24} />
            Создать историю с ИИ
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Генератор историй</DialogTitle>
            <DialogDescription>
              Опиши сюжет, и DeepSeek создаст уникальную историю без цензуры
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="character-select">Персонаж (опционально)</Label>
                <select
                  id="character-select"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                >
                  <option value="">Без персонажа</option>
                  {characters.map((char) => (
                    <option key={char.id} value={char.id}>{char.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="world-select">Мир (опционально)</Label>
                <select
                  id="world-select"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  value={selectedWorld}
                  onChange={(e) => setSelectedWorld(e.target.value)}
                >
                  <option value="">Без мира</option>
                  {worlds.map((world) => (
                    <option key={world.id} value={world.id}>{world.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story-prompt">Сюжет истории</Label>
              <Textarea
                id="story-prompt"
                placeholder="Напиши о тёмном страже, который встречает загадочную эльфийку в заброшенном замке..."
                className="min-h-[120px]"
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Icon name={showAdvanced ? "ChevronUp" : "ChevronDown"} size={16} />
              {showAdvanced ? 'Скрыть' : 'Показать'} дополнительные настройки
            </Button>

            {showAdvanced && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Settings" size={18} />
                    Настройки генерации
                  </CardTitle>
                  <CardDescription>
                    Управляйте деталями создания истории
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="episode-length">Размер эпизода (символы)</Label>
                      <span className="text-sm text-muted-foreground font-mono">{episodeLength}</span>
                    </div>
                    <Slider
                      id="episode-length"
                      min={500}
                      max={3000}
                      step={100}
                      value={[episodeLength]}
                      onValueChange={(value) => setEpisodeLength?.(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Короткие эпизоды (500-1000) — быстрое действие. Длинные (2000-3000) — подробное повествование.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="images-count">Картинок на эпизод</Label>
                      <span className="text-sm text-muted-foreground font-mono">{imagesPerEpisode}</span>
                    </div>
                    <Slider
                      id="images-count"
                      min={0}
                      max={5}
                      step={1}
                      value={[imagesPerEpisode]}
                      onValueChange={(value) => setImagesPerEpisode?.(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Иллюстрации ключевых моментов. 0 — без картинок, 3-5 — богатая визуализация.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-npcs">Автогенерация NPC</Label>
                        <p className="text-xs text-muted-foreground">
                          AI создаст второстепенных персонажей на свое усмотрение
                        </p>
                      </div>
                      <Switch
                        id="auto-npcs"
                        checked={autoGenerateNPCs}
                        onCheckedChange={setAutoGenerateNPCs}
                      />
                    </div>
                    {!autoGenerateNPCs && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                          <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
                          <span>
                            В истории будут участвовать только ваши созданные персонажи. Если их нет — создайте в разделе "Персонажи".
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="player-instructions">Дополнительные пожелания</Label>
                    <Textarea
                      id="player-instructions"
                      placeholder="Например: 'Больше диалогов', 'Добавь неожиданный поворот', 'Фокус на романтике'"
                      className="min-h-[80px] resize-none"
                      value={playerInstructions}
                      onChange={(e) => setPlayerInstructions?.(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Укажите предпочтения по стилю, темпу, фокусу нарратива и другие пожелания.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            <Button 
              onClick={onGenerate} 
              disabled={isGenerating || !storyPrompt.trim()}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" size={20} className="animate-spin" />
                  Генерирую историю...
                </>
              ) : (
                <>
                  <Icon name="Wand2" size={20} />
                  Сгенерировать
                </>
              )}
            </Button>
            {generatedStory && (
              <div className="space-y-2 mt-6">
                <Label>Сгенерированная история</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedStory}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};