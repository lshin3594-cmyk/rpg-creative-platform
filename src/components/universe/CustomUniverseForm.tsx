import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { plotGenres } from '../plot/plotGenres';
import { UniverseFormData } from './universeTypes';

interface CustomUniverseFormProps {
  formData: UniverseFormData;
  setFormData: (data: UniverseFormData) => void;
  toggleGenre: (genre: string) => void;
  handleGeneratePlot: () => void;
  isGeneratingPlot: boolean;
  handleCreate: () => void;
  isCreating: boolean;
}

export const CustomUniverseForm = ({
  formData,
  setFormData,
  toggleGenre,
  handleGeneratePlot,
  isGeneratingPlot,
  handleCreate,
  isCreating
}: CustomUniverseFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
        <Label>Жанры</Label>
        <div className="flex flex-wrap gap-2">
          {plotGenres.slice(0, 8).map((genre) => (
            <Button
              key={genre.value}
              variant={formData.genres.includes(genre.value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleGenre(genre.value)}
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
        type="submit"
        className="w-full gap-2"
        disabled={isCreating || !formData.name || !formData.description}
      >
        {isCreating ? (
          <Icon name="Loader2" size={20} className="animate-spin" />
        ) : (
          <Icon name="Plus" size={20} />
        )}
        {isCreating ? 'Создание...' : 'Создать вселенную'}
      </Button>
    </form>
  );
};