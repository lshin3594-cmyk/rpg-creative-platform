import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { plotGenres } from './plot/plotGenres';
import { Universe, UniverseFormData } from './universe/universeTypes';
import { UniverseCreateDialog } from './universe/UniverseCreateDialog';
import { UniverseCard } from './universe/UniverseCard';

interface UniverseTabProps {
  universes: Universe[];
  onCardClick: () => void;
  onDelete?: (id: string) => void;
  onCreate?: (data: Omit<Universe, 'id'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Universe>) => Promise<void>;
  onLearnCanon?: (id: string) => Promise<void>;
}

export const UniverseTab = ({ 
  universes: worldsInput, 
  onCardClick,
  onDelete,
  onCreate,
  onUpdate,
  onLearnCanon
}: UniverseTabProps) => {
  const universes: Universe[] = worldsInput.map((world: any) => ({
    id: world.id,
    name: world.name,
    description: world.description,
    lore: world.magic || '',
    rules: world.laws || '',
    characters: '',
    locations: '',
    timeline: '',
    canonSource: '',
    isCustom: true,
    genres: world.genre ? world.genre.split(',').map((g: string) => g.trim()) : []
  }));

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLearning, setIsLearning] = useState<string | null>(null);
  const [isGeneratingPlot, setIsGeneratingPlot] = useState(false);
  const [formData, setFormData] = useState<UniverseFormData>({
    name: '',
    description: '',
    lore: '',
    rules: '',
    characters: '',
    locations: '',
    timeline: '',
    canonSource: '',
    isCustom: true,
    mainConflict: '',
    keyEvents: '',
    resolution: '',
    genres: []
  });

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
    
    setIsGeneratingPlot(true);
    try {
      const genresText = formData.genres.length > 0 
        ? formData.genres.map(g => plotGenres.find(pg => pg.value === g)?.label).join(', ')
        : 'универсальный';
      
      const prompt = `Создай сюжет для вселенной "${formData.name}".
Жанры: ${genresText}
Описание мира: ${formData.description}
${formData.lore ? `История: ${formData.lore}` : ''}

Верни JSON:
{
  "mainConflict": "основной конфликт 1-2 предложения",
  "keyEvents": "ключевые события через новую строку",
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
          // Failed to parse plot data
        }
      }
    } finally {
      setIsGeneratingPlot(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (!confirm('Удалить эту вселенную?')) return;
    
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const handleCreate = async () => {
    if (!onCreate || !formData.name || !formData.description) return;
    
    setIsCreating(true);
    try {
      const worldData = {
        name: formData.name,
        description: formData.description,
        image: '',
        genre: formData.genres.join(', ') || 'фэнтези',
        laws: formData.rules,
        physics: '',
        magic: formData.lore,
        technology: ''
      };
      
      await onCreate(worldData as any);
      setFormData({
        name: '',
        description: '',
        lore: '',
        rules: '',
        characters: '',
        locations: '',
        timeline: '',
        canonSource: '',
        isCustom: true,
        mainConflict: '',
        keyEvents: '',
        resolution: '',
        genres: []
      });
      setIsCreateDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleLearnCanon = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onLearnCanon) return;
    
    setIsLearning(id);
    await onLearnCanon(id);
    setIsLearning(null);
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
          <h2 className="text-3xl font-serif font-semibold">Вселенные</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Создайте мир со своими правилами и сюжетом, или выберите каноническую вселенную
          </p>
        </div>
        <UniverseCreateDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          toggleGenre={toggleGenre}
          handleGeneratePlot={handleGeneratePlot}
          isGeneratingPlot={isGeneratingPlot}
          handleCreate={handleCreate}
          isCreating={isCreating}
        />
      </div>

      {universes.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="inline-flex p-6 rounded-full bg-primary/10">
            <Icon name="Globe" size={48} className="text-primary" />
          </div>
          <h3 className="text-2xl font-serif font-semibold">Нет созданных вселенных</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Создайте свою вселенную с уникальными правилами и сюжетом
          </p>
          <Button size="lg" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Icon name="Plus" size={20} />
            Создать первую вселенную
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universes.map((universe, index) => (
            <UniverseCard
              key={universe.id}
              universe={universe}
              index={index}
              onCardClick={onCardClick}
              onDelete={onDelete ? handleDelete : undefined}
              onLearnCanon={onLearnCanon ? handleLearnCanon : undefined}
              deletingId={deletingId}
              isLearning={isLearning}
              getGenreIcon={getGenreIcon}
              getGenreLabel={getGenreLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
};