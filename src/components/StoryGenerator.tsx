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
  worlds
}: StoryGeneratorProps) => {
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
