import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import funcUrls from '../../backend/func2url.json';

interface ImageGeneratorProps {
  onImageGenerated: (url: string) => void;
  currentImage?: string;
  placeholder?: string;
  label?: string;
}

export const ImageGenerator = ({ 
  onImageGenerated, 
  currentImage, 
  placeholder = "Опиши изображение, которое хочешь создать...",
  label = "Генерация изображения"
}: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите описание для генерации",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const translateResponse = await fetch(funcUrls['translate-prompt'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!translateResponse.ok) throw new Error('Ошибка перевода');

      const translateData = await translateResponse.json();
      const enhancedPrompt = translateData.translated;

      const response = await fetch(funcUrls['generate-image'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt })
      });

      if (!response.ok) throw new Error('Ошибка генерации');

      const data = await response.json();
      onImageGenerated(data.url);
      setPrompt('');
      
      toast({
        title: "Успешно",
        description: "Изображение сгенерировано через FLUX",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать изображение",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-card/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Wand2" size={20} className="text-primary" />
          <Label className="text-base font-semibold">{label}</Label>
        </div>
        <Badge variant="outline" className="gap-1">
          <Icon name="Sparkles" size={12} />
          FLUX AI
        </Badge>
      </div>
      
      {currentImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-primary/30">
          <img 
            src={currentImage} 
            alt="Generated" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="gap-1">
              <Icon name="Check" size={14} />
              Готово
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Icon name="Languages" size={12} />
          Автоперевод на английский для лучшего качества
        </p>
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !prompt.trim()}
        className="w-full gap-2"
        variant="outline"
      >
        {isGenerating ? (
          <>
            <Icon name="Loader2" size={20} className="animate-spin" />
            Генерация через FLUX...
          </>
        ) : (
          <>
            <Icon name="Sparkles" size={20} />
            Сгенерировать через FLUX
          </>
        )}
      </Button>
    </div>
  );
};