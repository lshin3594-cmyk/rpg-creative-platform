import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PlotCreateDialog } from './plot/PlotCreateDialog';
import { PlotEditDialog } from './plot/PlotEditDialog';
import { PlotPreviewDialog } from './plot/PlotPreviewDialog';
import { PlotCard } from './plot/PlotCard';
import { plotGenres } from './plot/plotGenres';

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
  const [previewPlot, setPreviewPlot] = useState<Plot | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
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
    if (!onCreate || !formData.name) return;
    
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
    if (!onUpdate || !editingPlot || !formData.name) return;
    
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

  const handlePreview = (e: React.MouseEvent, plot: Plot) => {
    e.stopPropagation();
    setPreviewPlot(plot);
    setIsPreviewDialogOpen(true);
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
        <PlotCreateDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          plotGenres={plotGenres}
          toggleGenre={toggleGenre}
          onGeneratePlot={handleGeneratePlot}
          isGenerating={isGenerating}
          onCreate={handleCreate}
          isCreating={isCreating}
        />
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
            <PlotCard
              key={plot.id}
              plot={plot}
              index={index}
              onPreview={handlePreview}
              onEdit={onUpdate ? handleEdit : undefined}
              onDelete={onDelete ? handleDelete : undefined}
              deletingId={deletingId}
              getGenreIcon={getGenreIcon}
              getGenreLabel={getGenreLabel}
            />
          ))}
        </div>
      )}

      <PlotEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        plotGenres={plotGenres}
        toggleGenre={toggleGenre}
        onGeneratePlot={handleGeneratePlot}
        isGenerating={isGenerating}
        onUpdate={handleUpdate}
        isCreating={isCreating}
      />

      <PlotPreviewDialog
        plot={previewPlot}
        isOpen={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        getGenreIcon={getGenreIcon}
        getGenreLabel={getGenreLabel}
      />
    </div>
  );
};