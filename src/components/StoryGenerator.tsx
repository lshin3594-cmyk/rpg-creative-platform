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
import { NarrativeSettings } from '@/components/NarrativeSettings';

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

interface Plot {
  id: string;
  name: string;
  description: string;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  genres: string[];
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
  plots: Plot[];
  episodeLength?: number;
  setEpisodeLength?: (value: number) => void;
  imagesPerEpisode?: number;
  setImagesPerEpisode?: (value: number) => void;
  playerInstructions?: string;
  setPlayerInstructions?: (value: string) => void;
  autoGenerateNPCs?: boolean;
  setAutoGenerateNPCs?: (value: boolean) => void;
  npcCount?: number;
  setNpcCount?: (value: number) => void;
  npcTypes?: string[];
  setNpcTypes?: (value: string[]) => void;
  selectedPlot?: string;
  setSelectedPlot?: (id: string) => void;
  narrativeMode?: string;
  setNarrativeMode?: (mode: string) => void;
  playerCharacterId?: string;
  setPlayerCharacterId?: (id: string) => void;
  selectedNarrativeCharacters?: string[];
  setSelectedNarrativeCharacters?: (ids: string[]) => void;
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
  plots,
  episodeLength = 1500,
  setEpisodeLength,
  imagesPerEpisode = 2,
  setImagesPerEpisode,
  playerInstructions = '',
  setPlayerInstructions,
  autoGenerateNPCs = true,
  setAutoGenerateNPCs,
  npcCount = 2,
  setNpcCount,
  npcTypes = [],
  setNpcTypes,
  selectedPlot = '',
  setSelectedPlot,
  narrativeMode = 'story',
  setNarrativeMode,
  playerCharacterId = '',
  setPlayerCharacterId,
  selectedNarrativeCharacters = [],
  setSelectedNarrativeCharacters
}: StoryGeneratorProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPlotDetails, setShowPlotDetails] = useState(false);
  
  const selectedPlotData = plots.find(p => p.id === selectedPlot);
  
  const availableNpcTypes = [
    { value: 'ally', label: 'Союзник', icon: 'Users', description: 'Помогает главному герою' },
    { value: 'rival', label: 'Соперник', icon: 'Swords', description: 'Конкурирует за цели' },
    { value: 'mentor', label: 'Наставник', icon: 'GraduationCap', description: 'Обучает и направляет' },
    { value: 'love_interest', label: 'Любовный интерес', icon: 'Heart', description: 'Романтический персонаж' },
    { value: 'antagonist', label: 'Антагонист', icon: 'Skull', description: 'Противостоит герою' },
    { value: 'comic_relief', label: 'Комический', icon: 'Laugh', description: 'Разряжает обстановку' },
    { value: 'mysterious', label: 'Загадочный', icon: 'Eye', description: 'Скрывает тайны' },
    { value: 'merchant', label: 'Торговец', icon: 'ShoppingBag', description: 'Продает товары/услуги' },
  ];
  
  const toggleNpcType = (type: string) => {
    if (!setNpcTypes) return;
    if (npcTypes.includes(type)) {
      setNpcTypes(npcTypes.filter(t => t !== type));
    } else {
      setNpcTypes([...npcTypes, type]);
    }
  };
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
            <NarrativeSettings
              narrativeMode={narrativeMode}
              setNarrativeMode={setNarrativeMode!}
              playerCharacterId={playerCharacterId}
              setPlayerCharacterId={setPlayerCharacterId!}
              characters={characters}
              selectedNarrativeCharacters={selectedNarrativeCharacters}
              setSelectedNarrativeCharacters={setSelectedNarrativeCharacters}
            />
            
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
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Выберите готовый сюжет или опишите свой</Label>
                {plots.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlot?.('')}
                      className={`p-2 rounded-lg border-2 transition-all text-left text-sm ${
                        !selectedPlot
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon name="Sparkles" size={14} className="inline mr-2" />
                      Свободное описание
                    </button>
                    {plots.map((plot) => (
                      <button
                        key={plot.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlot?.(plot.id);
                          setShowPlotDetails(true);
                        }}
                        className={`p-2 rounded-lg border-2 transition-all text-left hover:scale-[1.01] ${
                          selectedPlot === plot.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{plot.name}</span>
                          {plot.genres && plot.genres.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded bg-muted">
                              {plot.genres[0]}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedPlotData && showPlotDetails && (
                <div className="p-3 bg-muted/50 rounded-lg space-y-2 border border-border text-sm">
                  <div className="flex items-start justify-between">
                    <span className="font-semibold flex items-center gap-1">
                      <Icon name="Info" size={14} />
                      Детали
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowPlotDetails(false)}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                  {selectedPlotData.description && (
                    <p className="text-xs text-muted-foreground">{selectedPlotData.description}</p>
                  )}
                  {selectedPlotData.mainConflict && (
                    <div>
                      <p className="text-xs font-medium">Конфликт:</p>
                      <p className="text-xs text-muted-foreground">{selectedPlotData.mainConflict}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="story-prompt">
                  {selectedPlot ? 'Дополнительные пожелания (опционально)' : 'Опишите сюжет'}
                </Label>
                <Textarea
                  id="story-prompt"
                  placeholder={selectedPlot 
                    ? 'Добавьте детали, которые хотите включить в эту историю...'
                    : 'Напиши о тёмном страже, который встречает загадочную эльфийку...'
                  }
                  className="min-h-[100px]"
                  value={storyPrompt}
                  onChange={(e) => setStoryPrompt(e.target.value)}
                />
              </div>
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
                    {autoGenerateNPCs && (
                      <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="npc-count">Количество NPC</Label>
                            <span className="text-sm text-muted-foreground font-mono">{npcCount}</span>
                          </div>
                          <Slider
                            id="npc-count"
                            min={0}
                            max={5}
                            step={1}
                            value={[npcCount]}
                            onValueChange={(value) => setNpcCount?.(value[0])}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            Сколько второстепенных персонажей добавить в историю. 0 — только ваши персонажи.
                          </p>
                        </div>

                        {npcCount > 0 && (
                          <div className="space-y-2">
                            <Label>Типы персонажей (опционально)</Label>
                            <p className="text-xs text-muted-foreground mb-3">
                              Выберите желаемые архетипы. Если ничего не выбрано — AI решит сам.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {availableNpcTypes.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => toggleNpcType(type.value)}
                                  className={`p-3 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                                    npcTypes.includes(type.value)
                                      ? 'border-primary bg-primary/10'
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Icon name={type.icon as any} size={16} className="flex-shrink-0" />
                                    <span className="text-sm font-medium">{type.label}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{type.description}</p>
                                </button>
                              ))}
                            </div>
                            {npcTypes.length > 0 && (
                              <p className="text-xs text-primary mt-2 flex items-center gap-1">
                                <Icon name="Check" size={12} />
                                Выбрано: {npcTypes.length} тип(ов)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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