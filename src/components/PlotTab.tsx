import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface Plot {
  id: string;
  name: string;
  description: string;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  genres: string[];
}

interface PlotTabProps {
  plots: Plot[];
  onCardClick: () => void;
  onDelete?: (id: string) => void;
  onCreate?: (data: Omit<Plot, 'id'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Plot>) => Promise<void>;
}

const plotGenres = [
  { value: 'hero', label: 'Путь героя', icon: 'Sword' },
  { value: 'mystery', label: 'Детектив', icon: 'Search' },
  { value: 'romance', label: 'Романтика', icon: 'Heart' },
  { value: 'tragedy', label: 'Трагедия', icon: 'CloudRain' },
  { value: 'comedy', label: 'Комедия', icon: 'Smile' },
  { value: 'adventure', label: 'Приключение', icon: 'Compass' },
  { value: 'revenge', label: 'Месть', icon: 'Flame' },
  { value: 'thriller', label: 'Триллер', icon: 'Zap' },
  { value: 'horror', label: 'Хоррор', icon: 'Ghost' },
  { value: 'drama', label: 'Драма', icon: 'Theater' }
];

export const PlotTab = ({ 
  plots, 
  onCardClick,
  onDelete,
  onCreate,
  onUpdate
}: PlotTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mainConflict: '',
    keyEvents: '',
    resolution: '',
    genres: [] as string[]
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleGeneratePlot = async () => {
    if (!formData.name) return;
    
    setIsGenerating(true);
    try {
      const genresText = formData.genres.length > 0 
        ? formData.genres.map(g => plotGenres.find(pg => pg.value === g)?.label).join(', ')
        : 'универсальный';
      
      const prompt = `Создай сюжет для истории "${formData.name}".
Жанры: ${genresText}
${formData.description ? `Краткое описание: ${formData.description}` : ''}

Верни JSON:
{
  "mainConflict": "основной конфликт 1-2 предложения",
  "keyEvents": "ключевые события через запятую или с новой строки",
  "resolution": "развязка 1-2 предложения"
}`;

      const response = await fetch('https://functions.poehali.dev/25ab42fa-62e6-42e0-9d90-8e0a40bd65a1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (data.content) {
        try {
          const jsonMatch = data.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const plotData = JSON.parse(jsonMatch[0]);
            setFormData(prev => ({
              ...prev,
              mainConflict: plotData.mainConflict || '',
              keyEvents: plotData.keyEvents || '',
              resolution: plotData.resolution || ''
            }));
          }
        } catch (e) {
          console.error('Failed to parse plot data:', e);
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (!confirm('Удалить этот сюжет?')) return;
    
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const handleCreate = async () => {
    if (!onCreate || !formData.name || !formData.description) return;
    
    setIsCreating(true);
    try {
      await onCreate(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        mainConflict: '',
        keyEvents: '',
        resolution: '',
        genres: []
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, plot: Plot) => {
    e.stopPropagation();
    setEditingPlot(plot);
    setFormData({
      name: plot.name,
      description: plot.description,
      mainConflict: plot.mainConflict || '',
      keyEvents: plot.keyEvents || '',
      resolution: plot.resolution || '',
      genres: plot.genres || []
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!onUpdate || !editingPlot || !formData.name || !formData.description) return;
    
    setIsCreating(true);
    try {
      await onUpdate(editingPlot.id, formData);
      setIsEditDialogOpen(false);
      setEditingPlot(null);
      setFormData({
        name: '',
        description: '',
        mainConflict: '',
        keyEvents: '',
        resolution: '',
        genres: []
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getGenreIcon = (genre: string) => {
    return plotGenres.find(g => g.value === genre)?.icon || 'Sparkles';
  };

  const getGenreLabel = (genre: string) => {
    return plotGenres.find(g => g.value === genre)?.label || genre;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-serif font-semibold">Библиотека сюжетов</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Опишите события и историю, которая будет разворачиваться
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={20} />
              Создать сюжет
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Создание сюжета</DialogTitle>
              <DialogDescription>
                Опишите сюжетную линию для будущих историй
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plot-name">Название сюжета</Label>
                <Input 
                  id="plot-name" 
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
                <Label htmlFor="plot-description">Краткое описание (опционально)</Label>
                <Textarea 
                  id="plot-description" 
                  placeholder="Герои отправляются на поиски древнего артефакта..." 
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <Button 
                variant="outline"
                className="w-full gap-2" 
                onClick={handleGeneratePlot}
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
                  <Label htmlFor="plot-conflict">Основной конфликт</Label>
                  <Textarea 
                    id="plot-conflict" 
                    placeholder="Противостояние сил света и тьмы, личная месть, спасение мира..." 
                    className="min-h-[80px]"
                    value={formData.mainConflict}
                    onChange={(e) => setFormData({...formData, mainConflict: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plot-events">Ключевые события (через запятую или с новой строки)</Label>
                  <Textarea 
                    id="plot-events" 
                    placeholder="Встреча с наставником, получение задания, первая битва, предательство..." 
                    className="min-h-[100px]"
                    value={formData.keyEvents}
                    onChange={(e) => setFormData({...formData, keyEvents: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plot-resolution">Развязка</Label>
                  <Textarea 
                    id="plot-resolution" 
                    placeholder="Как должна завершиться история? Победа, трагедия, открытый финал..." 
                    className="min-h-[80px]"
                    value={formData.resolution}
                    onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                className="w-full gap-2" 
                onClick={handleCreate}
                disabled={isCreating || !formData.name}
              >
                {isCreating ? (
                  <Icon name="Loader2" size={20} className="animate-spin" />
                ) : (
                  <Icon name="Plus" size={20} />
                )}
                {isCreating ? 'Создание...' : 'Создать сюжет'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {plots.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="inline-flex p-6 rounded-full bg-primary/10">
            <Icon name="BookOpen" size={48} className="text-primary" />
          </div>
          <h3 className="text-2xl font-serif font-semibold">Пока нет сюжетов</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Создайте сюжетную основу для ваших историй. Опишите конфликт, ключевые события и развязку.
          </p>
          <Button size="lg" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Icon name="Plus" size={20} />
            Создать первый сюжет
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plots.map((plot, index) => (
            <Card 
              key={plot.id}
              className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 overflow-hidden relative group"
              onClick={onCardClick}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in 0.5s ease-out forwards'
              }}
            >
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {onUpdate && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 backdrop-blur-sm bg-background/80"
                    onClick={(e) => handleEdit(e, plot)}
                  >
                    <Icon name="Pencil" size={16} />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 backdrop-blur-sm"
                    onClick={(e) => handleDelete(e, plot.id)}
                    disabled={deletingId === plot.id}
                  >
                    {deletingId === plot.id ? (
                      <Icon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      <Icon name="Trash2" size={16} />
                    )}
                  </Button>
                )}
              </div>
              <CardHeader>
                {plot.genres && plot.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {plot.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="gap-1 text-xs">
                        <Icon name={getGenreIcon(genre) as any} size={12} />
                        {getGenreLabel(genre)}
                      </Badge>
                    ))}
                    {plot.genres.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{plot.genres.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <CardTitle className="text-2xl font-serif">{plot.name}</CardTitle>
                {plot.description && (
                  <CardDescription className="text-base leading-relaxed">
                    {plot.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {plot.mainConflict && (
                  <div className="flex gap-2">
                    <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground line-clamp-2">{plot.mainConflict}</p>
                  </div>
                )}
                {plot.keyEvents && (
                  <div className="flex gap-2">
                    <Icon name="List" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground line-clamp-2">{plot.keyEvents}</p>
                  </div>
                )}
                {plot.resolution && (
                  <div className="flex gap-2">
                    <Icon name="Flag" size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground line-clamp-2">{plot.resolution}</p>
                  </div>
                )}
                <Button variant="outline" className="w-full gap-2 mt-4">
                  <Icon name="Sparkles" size={18} />
                  Использовать сюжет
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Редактирование сюжета</DialogTitle>
            <DialogDescription>
              Обнови описание и структуру сюжета
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-plot-name">Название сюжета</Label>
              <Input 
                id="edit-plot-name" 
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
              <Label htmlFor="edit-plot-description">Краткое описание (опционально)</Label>
              <Textarea 
                id="edit-plot-description" 
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <Button 
              variant="outline"
              className="w-full gap-2" 
              onClick={handleGeneratePlot}
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
              <div className="space-y-2">
                <Label htmlFor="edit-plot-conflict">Основной конфликт</Label>
                <Textarea 
                  id="edit-plot-conflict" 
                  className="min-h-[80px]"
                  value={formData.mainConflict}
                  onChange={(e) => setFormData({...formData, mainConflict: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-plot-events">Ключевые события</Label>
                <Textarea 
                  id="edit-plot-events" 
                  className="min-h-[100px]"
                  value={formData.keyEvents}
                  onChange={(e) => setFormData({...formData, keyEvents: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-plot-resolution">Развязка</Label>
                <Textarea 
                  id="edit-plot-resolution" 
                  className="min-h-[80px]"
                  value={formData.resolution}
                  onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                />
              </div>
            </div>

            <Button 
              className="w-full gap-2" 
              onClick={handleUpdate}
              disabled={isCreating || !formData.name}
            >
              {isCreating ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <Icon name="Save" size={20} />
              )}
              {isCreating ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};