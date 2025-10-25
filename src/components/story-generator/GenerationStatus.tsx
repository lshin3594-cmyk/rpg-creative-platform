import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface GenerationStatusProps {
  isGenerating: boolean;
  generatedStory: string;
  onGenerate: () => void;
  onStartStory?: () => void;
}

export const GenerationStatus = ({
  isGenerating,
  generatedStory,
  onGenerate,
  onStartStory
}: GenerationStatusProps) => {
  return (
    <>
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="w-full gap-2"
        size="lg"
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
      
      {isGenerating && (
        <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Sparkles" size={16} className="text-primary animate-pulse" />
            <span className="font-medium">DeepSeek создаёт вашу историю...</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Анализирую персонажей и мир</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-100" />
              <span>Строю сюжет и диалоги</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-200" />
              <span>Добавляю детали и атмосферу</span>
            </div>
          </div>
        </div>
      )}
      
      {generatedStory && (
        <div className="space-y-4 mt-6">
          <Label>Сгенерированная история</Label>
          <div className="p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedStory}</p>
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
    </>
  );
};
