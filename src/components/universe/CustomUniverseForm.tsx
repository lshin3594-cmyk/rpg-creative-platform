import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { InputWithAI } from '@/components/ui/input-with-ai';
import { plotGenres } from '../plot/plotGenres';

interface CustomUniverseFormProps {
  onSubmit: (data: any) => void;
  isCreating: boolean;
}

export const CustomUniverseForm = ({
  onSubmit,
  isCreating
}: CustomUniverseFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: '',
    tags: [] as string[]
  });
  
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      name: formData.name,
      description: formData.description,
      canonSource: '',
      sourceType: 'custom' as const,
      genre: formData.genre || 'фэнтези',
      tags: formData.tags
    });
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const generateUniverseField = async (field: 'name' | 'description' | 'genre') => {
    const context = `Вселенная: ${formData.name || 'новая'}, ${formData.description || ''}`;
    const prompts = {
      name: `Придумай оригинальное название для фэнтези/фантастической вселенной. Только название, без описаний.`,
      description: `Создай краткое интригующее описание фэнтези/фантастической вселенной. 1-2 предложения.`,
      genre: `Предложи подходящий жанр для вселенной: ${context}. Только название жанра (1-2 слова).`
    };

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompts[field] }],
          max_tokens: 100
        })
      });

      if (!response.ok) throw new Error('Ошибка генерации');
      
      const data = await response.json();
      const generated = data.choices[0]?.message?.content?.trim() || '';
      setFormData(prev => ({ ...prev, [field]: generated }));
    } catch (error) {
      console.error('Ошибка генерации:', error);
    }
  };

  const generateTags = async () => {
    if (!formData.name && !formData.description) return;
    
    setIsGeneratingTags(true);
    try {
      const availableTags = plotGenres.slice(0, 8).map(g => g.label).join(', ');
      const prompt = `На основе вселенной "${formData.name || 'без названия'}" (${formData.description || 'без описания'}), выбери 2-3 подходящих тега из списка: ${availableTags}. Ответь только названиями тегов через запятую.`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 50
        })
      });

      if (!response.ok) throw new Error('Ошибка генерации');
      
      const data = await response.json();
      const tagsText = data.choices[0]?.message?.content?.trim() || '';
      const suggestedTags = tagsText.split(',').map((t: string) => t.trim()).filter((t: string) => 
        plotGenres.slice(0, 8).some(g => g.label.toLowerCase() === t.toLowerCase())
      );
      
      setFormData(prev => ({ ...prev, tags: suggestedTags }));
    } catch (error) {
      console.error('Ошибка генерации тегов:', error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWithAI
          label="Название вселенной"
          id="universe-name"
          value={formData.name}
          onChange={(value) => setFormData({...formData, name: value})}
          onGenerate={() => generateUniverseField('name')}
          placeholder="Новый Эдем"
          required
        />
        <InputWithAI
          label="Краткое описание"
          id="universe-description"
          value={formData.description}
          onChange={(value) => setFormData({...formData, description: value})}
          onGenerate={() => generateUniverseField('description')}
          placeholder="Мир после апокалипсиса..."
          required
        />
      </div>

      <InputWithAI
        label="Жанр"
        id="universe-genre"
        value={formData.genre}
        onChange={(value) => setFormData({...formData, genre: value})}
        onGenerate={() => generateUniverseField('genre')}
        placeholder="Например: фэнтези, sci-fi, киберпанк..."
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Теги (по желанию)</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={generateTags}
            disabled={isGeneratingTags || (!formData.name && !formData.description)}
            className="h-7 gap-1.5 text-xs"
          >
            <Icon 
              name={isGeneratingTags ? "Loader2" : "Sparkles"} 
              size={14} 
              className={isGeneratingTags ? "animate-spin" : ""} 
            />
            {isGeneratingTags ? 'Подбор...' : 'Подобрать ИИ'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {plotGenres.slice(0, 8).map((genre) => (
            <Button
              key={genre.value}
              variant={formData.tags.includes(genre.label) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleTag(genre.label)}
              className="gap-2"
              type="button"
            >
              <Icon name={genre.icon as any} size={14} />
              {genre.label}
            </Button>
          ))}
        </div>
      </div>

      <Button 
        className="w-full gap-2" 
        onClick={handleSubmit}
        disabled={isCreating || !formData.name || !formData.description}
      >
        {isCreating ? (
          <Icon name="Loader2" size={20} className="animate-spin" />
        ) : (
          <Icon name="Plus" size={20} />
        )}
        {isCreating ? 'Создание...' : 'Создать вселенную'}
      </Button>
    </div>
  );
};