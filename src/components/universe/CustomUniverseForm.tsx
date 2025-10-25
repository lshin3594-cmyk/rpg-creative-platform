import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="universe-name">Название вселенной *</Label>
          <Input 
            id="universe-name" 
            placeholder="Новый Эдем" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value, isCustom: true, canonSource: ''})}
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

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="font-semibold text-lg">Детали мира</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="universe-lore">История и лор</Label>
            <Textarea 
              id="universe-lore" 
              placeholder="Ключевые исторические события..."
              className="min-h-[100px]"
              value={formData.lore}
              onChange={(e) => setFormData({...formData, lore: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universe-rules">Правила и законы</Label>
            <Textarea 
              id="universe-rules" 
              placeholder="Физические, магические, социальные правила..."
              className="min-h-[100px]"
              value={formData.rules}
              onChange={(e) => setFormData({...formData, rules: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universe-characters">Ключевые персонажи</Label>
            <Textarea 
              id="universe-characters" 
              placeholder="Главные герои, злодеи, важные NPC..."
              className="min-h-[100px]"
              value={formData.characters}
              onChange={(e) => setFormData({...formData, characters: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universe-locations">Локации</Label>
            <Textarea 
              id="universe-locations" 
              placeholder="Города, континенты, планеты..."
              className="min-h-[100px]"
              value={formData.locations}
              onChange={(e) => setFormData({...formData, locations: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="universe-timeline">Хронология</Label>
          <Textarea 
            id="universe-timeline" 
            placeholder="Временная линия, эпохи, важные даты..."
            className="min-h-[80px]"
            value={formData.timeline}
            onChange={(e) => setFormData({...formData, timeline: e.target.value})}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="BookOpen" size={20} className="text-primary" />
            <h3 className="font-semibold text-lg">Сюжет вселенной</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeneratePlot}
            disabled={isGeneratingPlot || !formData.name}
            className="gap-2"
          >
            {isGeneratingPlot ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Wand2" size={16} />
            )}
            {isGeneratingPlot ? 'Генерация...' : 'Сгенерировать сюжет'}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Жанры сюжета</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {plotGenres.map((genre) => (
              <Button
                key={genre.value}
                variant={formData.genres.includes(genre.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleGenre(genre.value)}
                className="justify-start gap-2"
              >
                <Icon name={genre.icon as any} size={14} />
                {genre.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="universe-conflict">Основной конфликт</Label>
          <Textarea 
            id="universe-conflict" 
            placeholder="Опишите главный конфликт или проблему..."
            className="min-h-[80px]"
            value={formData.mainConflict}
            onChange={(e) => setFormData({...formData, mainConflict: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="universe-events">Ключевые события</Label>
          <Textarea 
            id="universe-events" 
            placeholder="Перечислите важные события (каждое с новой строки)..."
            className="min-h-[80px]"
            value={formData.keyEvents}
            onChange={(e) => setFormData({...formData, keyEvents: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="universe-resolution">Возможная развязка</Label>
          <Textarea 
            id="universe-resolution" 
            placeholder="Как может развиваться история..."
            className="min-h-[80px]"
            value={formData.resolution}
            onChange={(e) => setFormData({...formData, resolution: e.target.value})}
          />
        </div>
      </div>

      <Button 
        className="w-full gap-2" 
        onClick={handleCreate}
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
