import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'dall-e-2' | 'dall-e-3'>('dall-e-3');
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите описание для генерации",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const translateResponse = await fetch(funcUrls['translate-prompt'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!translateResponse.ok) throw new Error('Ошибка перевода');

      const translateData = await translateResponse.json();
      setEnhancedPrompt(translateData.translated);
      
      toast({
        title: "Готово",
        description: "Промпт улучшен и переведен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось перевести промпт",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedPrompt.trim()) {
      toast({
        title: "Ошибка",
        description: "Сначала создайте улучшенный промпт",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const puter = (window as any).puter;
      
      if (!puter || !puter.ai || !puter.ai.txt2img) {
        throw new Error('Puter.js не загружен или недоступен');
      }

      const imageDataUrl = await puter.ai.txt2img(enhancedPrompt, selectedModel);
      
      if (!imageDataUrl) {
        throw new Error('Не удалось получить изображение');
      }
      
      onImageGenerated(imageDataUrl);
      setPrompt('');
      setEnhancedPrompt('');
      
      toast({
        title: "Успешно",
        description: `Изображение сгенерировано через ${selectedModel === 'dall-e-3' ? 'DALL-E 3' : 'DALL-E 2'}`,
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Ошибка генерации",
        description: error instanceof Error ? error.message : "Не удалось сгенерировать изображение",
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
          {selectedModel === 'dall-e-3' ? 'DALL-E 3' : 'DALL-E 2'}
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
        <Label>Модель генерации</Label>
        <Select value={selectedModel} onValueChange={(value: 'dall-e-2' | 'dall-e-3') => setSelectedModel(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dall-e-3">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={14} />
                DALL-E 3 (лучшее качество)
              </div>
            </SelectItem>
            <SelectItem value="dall-e-2">
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={14} />
                DALL-E 2 (быстрее)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Ваше описание</Label>
        <Textarea
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px]"
        />
        <Button 
          onClick={handleTranslate} 
          disabled={isTranslating || !prompt.trim()}
          className="w-full gap-2"
          variant="secondary"
          size="sm"
        >
          {isTranslating ? (
            <>
              <Icon name="Loader2" size={16} className="animate-spin" />
              Перевод...
            </>
          ) : (
            <>
              <Icon name="Languages" size={16} />
              Улучшить и перевести
            </>
          )}
        </Button>
      </div>

      {enhancedPrompt && (
        <div className="space-y-2 p-3 border-2 border-primary/30 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <Label className="text-sm font-semibold">Улучшенный промпт для DALL-E</Label>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{enhancedPrompt}</p>
        </div>
      )}

      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !enhancedPrompt.trim()}
        className="w-full gap-2"
        variant="outline"
      >
        {isGenerating ? (
          <>
            <Icon name="Loader2" size={20} className="animate-spin" />
            Генерация через {selectedModel === 'dall-e-3' ? 'DALL-E 3' : 'DALL-E 2'}...
          </>
        ) : (
          <>
            <Icon name="Wand2" size={20} />
            Сгенерировать изображение
          </>
        )}
      </Button>
    </div>
  );
};