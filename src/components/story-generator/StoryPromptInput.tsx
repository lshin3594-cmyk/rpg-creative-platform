import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StoryPromptInputProps {
  storyPrompt: string;
  setStoryPrompt: (prompt: string) => void;
  selectedPlot: string;
}

export const StoryPromptInput = ({
  storyPrompt,
  setStoryPrompt,
  selectedPlot
}: StoryPromptInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="story-prompt">
        {selectedPlot ? 'Дополнительные детали' : 'Опишите начало истории'}
      </Label>
      <Textarea
        id="story-prompt"
        placeholder={
          selectedPlot
            ? 'Добавьте детали к выбранному сюжету (опционально)...'
            : 'Начало фэнтези-истории о молодом маге, впервые попадающем в академию...'
        }
        value={storyPrompt}
        onChange={(e) => setStoryPrompt(e.target.value)}
        className="min-h-[120px]"
      />
      <p className="text-xs text-muted-foreground">
        {selectedPlot
          ? 'Уточните детали выбранного сюжета или оставьте пустым'
          : 'Опишите завязку, атмосферу и ключевых персонажей'}
      </p>
    </div>
  );
};
