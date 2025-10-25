import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

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
  onStartStory?: () => void;
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
  isGenerating,
  generatedStory,
  onGenerate,
  onStartStory
}: StoryGeneratorProps) => {
  return (
    <div className="flex justify-center mb-8">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-3 text-lg py-7 px-10 bg-primary hover:bg-primary/90 shadow-2xl hover:scale-105 transition-all">
            <Icon name="Sparkles" size={28} className="animate-pulse" />
            Начать приключение
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Создать историю</DialogTitle>
            <DialogDescription>
              Опиши, что хочешь — ИИ сгенерирует интерактивную историю
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="story-prompt" className="text-base">Опиши идею истории</Label>
              <Textarea
                id="story-prompt"
                placeholder="Например: Я — детектив в киберпанк-городе, расследую убийство. Мрачная атмосфера, опасные районы..."
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
                className="min-h-[150px] text-base"
              />
              <p className="text-sm text-muted-foreground">
                💡 Укажи жанр, главного героя, сеттинг — остальное ИИ додумает сам
              </p>
            </div>

            <Button 
              onClick={onGenerate} 
              disabled={isGenerating || !storyPrompt.trim()}
              className="w-full gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" size={20} className="animate-spin" />
                  Создаю историю...
                </>
              ) : (
                <>
                  <Icon name="Wand2" size={20} />
                  Создать историю
                </>
              )}
            </Button>
            
            {isGenerating && (
              <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Sparkles" size={16} className="text-primary animate-pulse" />
                  <span className="font-medium">ИИ создаёт твою историю...</span>
                </div>
              </div>
            )}
            
            {generatedStory && (
              <div className="space-y-4 mt-6 p-4 bg-muted/50 rounded-lg border-2 border-primary/20">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={20} className="text-green-500" />
                    <Label className="text-base font-semibold">История готова!</Label>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto p-3 bg-background rounded border">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedStory}</p>
                  </div>
                </div>
                <Button 
                  onClick={onStartStory} 
                  className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                  size="lg"
                >
                  <Icon name="Play" size={20} />
                  Начать играть
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
