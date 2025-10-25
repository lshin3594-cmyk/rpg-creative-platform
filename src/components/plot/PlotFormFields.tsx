import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PlotFormFieldsProps {
  formData: {
    name: string;
    description: string;
    mainConflict: string;
    keyEvents: string;
    resolution: string;
    genres: string[];
  };
  setFormData: (data: any) => void;
  plotGenres: Array<{ value: string; label: string; icon: string }>;
  toggleGenre: (genre: string) => void;
  onGeneratePlot: () => void;
  isGenerating: boolean;
  isEdit?: boolean;
}

export const PlotFormFields = ({
  formData,
  setFormData,
  plotGenres,
  toggleGenre,
  onGeneratePlot,
  isGenerating,
  isEdit = false
}: PlotFormFieldsProps) => {
  const nameId = isEdit ? 'edit-plot-name' : 'plot-name';
  const descriptionId = isEdit ? 'edit-plot-description' : 'plot-description';
  const conflictId = isEdit ? 'edit-plot-conflict' : 'plot-conflict';
  const eventsId = isEdit ? 'edit-plot-events' : 'plot-events';
  const resolutionId = isEdit ? 'edit-plot-resolution' : 'plot-resolution';

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={nameId}>Название сюжета</Label>
        <Input 
          id={nameId} 
          placeholder="Поиск артефакта" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Жанры сюжета</Label>
          {formData.genres.length > 0 && (
            <span className="text-xs text-primary">Выбрано: {formData.genres.length}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Можно выбрать несколько жанров</p>
        <div className="grid grid-cols-5 gap-2">
          {plotGenres.map((genre) => (
            <button
              key={genre.value}
              type="button"
              onClick={() => toggleGenre(genre.value)}
              className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                formData.genres.includes(genre.value)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon name={genre.icon as any} size={18} />
                <span className="text-xs font-medium text-center">{genre.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={descriptionId}>Краткое описание (опционально)</Label>
        <Textarea 
          id={descriptionId} 
          placeholder="Герои отправляются на поиски древнего артефакта..." 
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <Button 
        variant="outline"
        className="w-full gap-2" 
        onClick={onGeneratePlot}
        disabled={isGenerating || !formData.name}
      >
        {isGenerating ? (
          <Icon name="Loader2" size={20} className="animate-spin" />
        ) : (
          <Icon name="Sparkles" size={20} />
        )}
        {isGenerating ? 'Генерирую сюжет...' : 'Сгенерировать сюжет через AI'}
      </Button>

      <div className="border-t border-border pt-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="BookOpen" size={18} className="text-primary" />
          <h3 className="font-semibold text-lg">Структура сюжета</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor={conflictId}>Основной конфликт</Label>
          <Textarea 
            id={conflictId} 
            placeholder="Противостояние сил света и тьмы, личная месть, спасение мира..." 
            className="min-h-[80px]"
            value={formData.mainConflict}
            onChange={(e) => setFormData({...formData, mainConflict: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={eventsId}>Ключевые события (через запятую или с новой строки)</Label>
          <Textarea 
            id={eventsId} 
            placeholder="Встреча с наставником, получение задания, первая битва, предательство..." 
            className="min-h-[100px]"
            value={formData.keyEvents}
            onChange={(e) => setFormData({...formData, keyEvents: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={resolutionId}>Развязка</Label>
          <Textarea 
            id={resolutionId} 
            placeholder="Как должна завершиться история? Победа, трагедия, открытый финал..." 
            className="min-h-[80px]"
            value={formData.resolution}
            onChange={(e) => setFormData({...formData, resolution: e.target.value})}
          />
        </div>
      </div>
    </>
  );
};
