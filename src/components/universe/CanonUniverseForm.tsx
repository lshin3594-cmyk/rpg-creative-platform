import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { canonUniverses, UniverseFormData } from './universeTypes';
import { UniversePreviewDialog } from './UniversePreviewDialog';

const categories = [
  { value: 'all', label: 'Все', icon: 'Globe' },
  { value: 'favorites', label: 'Избранное', icon: 'Star' },
  { value: 'fantasy', label: 'Фэнтези', icon: 'Sparkles', tags: ['фэнтези', 'магия', 'эльфы', 'драконы'] },
  { value: 'scifi', label: 'Sci-Fi', icon: 'Rocket', tags: ['sci-fi', 'космос', 'фантастика'] },
  { value: 'modern', label: 'Современное', icon: 'Building', tags: ['современность', 'городское фэнтези', 'детектив'] },
  { value: 'eastern', label: 'Восточное', icon: 'Cloud', tags: ['уся', 'культивация', 'китайское фэнтези', 'восточная философия', 'аниме', 'donghua'] },
  { value: 'superhero', label: 'Супергерои', icon: 'Zap', tags: ['супергерои', 'комиксы'] },
  { value: 'dark', label: 'Тёмное', icon: 'Moon', tags: ['grimdark', 'тёмное фэнтези', 'мистика', 'демоны', 'хаос'] }
];

const FAVORITES_KEY = 'canon-universes-favorites';

interface CanonUniverseFormProps {
  formData: UniverseFormData;
  setFormData: (data: UniverseFormData) => void;
  handleCanonSelect: (canon: typeof canonUniverses[0]) => void;
  handleCreate: () => void;
  isCreating: boolean;
}

export const CanonUniverseForm = ({
  formData,
  setFormData,
  handleCanonSelect: handleCanonSelectProp,
  handleCreate,
  isCreating
}: CanonUniverseFormProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [previewUniverse, setPreviewUniverse] = useState<typeof canonUniverses[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  const toggleFavorite = (e: React.MouseEvent, universeName: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(universeName)
      ? favorites.filter(f => f !== universeName)
      : [...favorites, universeName];
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const openPreview = (e: React.MouseEvent, canon: typeof canonUniverses[0]) => {
    e.stopPropagation();
    setPreviewUniverse(canon);
    setIsPreviewOpen(true);
  };

  const handleCanonSelect = (canon: typeof canonUniverses[0]) => {
    handleCanonSelectProp(canon);
  };

  const handlePreviewSelect = () => {
    if (previewUniverse) {
      handleCanonSelect(previewUniverse);
      setIsPreviewOpen(false);
    }
  };

  const handlePreviewToggleFavorite = () => {
    if (previewUniverse) {
      toggleFavorite({ stopPropagation: () => {} } as React.MouseEvent, previewUniverse.name);
    }
  };

  const filteredUniverses = canonUniverses.filter(canon => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      canon.name.toLowerCase().includes(query) ||
      canon.description.toLowerCase().includes(query) ||
      canon.source.toLowerCase().includes(query) ||
      canon.tags.some(tag => tag.toLowerCase().includes(query))
    );

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return favorites.includes(canon.name);

    const category = categories.find(c => c.value === selectedCategory);
    if (!category || !category.tags) return true;

    return canon.tags.some(tag => 
      category.tags!.some(catTag => 
        tag.toLowerCase().includes(catTag.toLowerCase())
      )
    );
  });

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          ИИ изучит каноническую вселенную и будет следовать её правилам
        </p>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const count = cat.value === 'favorites' ? favorites.length : undefined;
            return (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="gap-2"
              >
                <Icon name={cat.icon as any} size={14} />
                {cat.label}
                {count !== undefined && count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, описанию или тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Найдено: {filteredUniverses.length}</span>
        {(searchQuery || selectedCategory !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="h-auto py-1 px-2 gap-1"
          >
            <Icon name="X" size={14} />
            Сбросить
          </Button>
        )}
      </div>

      {filteredUniverses.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Ничего не найдено</p>
          <p className="text-sm text-muted-foreground">Попробуйте другую категорию или запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
          {filteredUniverses.map((canon, idx) => {
            const isFavorite = favorites.includes(canon.name);
            return (
              <Card 
                key={idx}
                className="cursor-pointer hover:border-primary/50 transition-colors relative group"
              >
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => openPreview(e, canon)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Предпросмотр"
                  >
                    <Icon name="Eye" size={16} className="text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => toggleFavorite(e, canon.name)}
                    className="h-8 w-8 p-0"
                    title="Избранное"
                  >
                    <Icon 
                      name="Star" 
                      size={16} 
                      className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'} 
                    />
                  </Button>
                </div>
                <div onClick={() => handleCanonSelect(canon)}>
                  <CardHeader className="pb-3 pr-20">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon name={canon.icon as any} size={20} />
                      {canon.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {canon.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Источник: {canon.source}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {canon.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                      {canon.tags.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          +{canon.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <UniversePreviewDialog
        universe={previewUniverse}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onSelect={handlePreviewSelect}
        isFavorite={previewUniverse ? favorites.includes(previewUniverse.name) : false}
        onToggleFavorite={handlePreviewToggleFavorite}
      />
    </div>
  );
};