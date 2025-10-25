import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
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

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="universe-name">Название вселенной *</Label>
          <Input 
            id="universe-name" 
            placeholder="Новый Эдем" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="universe-description">Краткое описание *</Label>
          <Input
            id="universe-description" 
            placeholder="Мир после апокалипсиса..." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="universe-genre">Жанр</Label>
        <Input
          id="universe-genre" 
          placeholder="Например: фэнтези, sci-fi, киберпанк..." 
          value={formData.genre}
          onChange={(e) => setFormData({...formData, genre: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label>Теги (по желанию)</Label>
        <div className="flex flex-wrap gap-2">
          {plotGenres.slice(0, 8).map((genre) => (
            <Button
              key={genre.value}
              variant={formData.tags.includes(genre.label) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleTag(genre.label)}
              className="gap-2"
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