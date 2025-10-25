import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { plotGenres } from './plot/plotGenres';

interface Universe {
  id: string;
  name: string;
  description: string;
  lore: string;
  rules: string;
  characters: string;
  locations: string;
  timeline: string;
  canonSource: string;
  isCustom: boolean;
  mainConflict?: string;
  keyEvents?: string;
  resolution?: string;
  genres?: string[];
  learnedAt?: Date;
}

interface UniverseTabProps {
  universes: Universe[];
  onCardClick: () => void;
  onDelete?: (id: string) => void;
  onCreate?: (data: Omit<Universe, 'id'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Universe>) => Promise<void>;
  onLearnCanon?: (id: string) => Promise<void>;
}

export const UniverseTab = ({ 
  universes, 
  onCardClick,
  onDelete,
  onCreate,
  onUpdate,
  onLearnCanon
}: UniverseTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLearning, setIsLearning] = useState<string | null>(null);
  const [isGeneratingPlot, setIsGeneratingPlot] = useState(false);
  const [formData, setFormData] = useState({
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
    genres: [] as string[]
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
          console.error('Failed to parse plot data:', e);
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
      await onCreate(formData);
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

  const canonUniverses = [
    { 
      name: 'Гарри Поттер', 
      description: 'Магический мир волшебников и магглов',
      icon: 'Wand2',
      source: 'Книги Дж. К. Роулинг, фильмы Warner Bros'
    },
    { 
      name: 'Властелин колец', 
      description: 'Средиземье, мир эльфов, гномов и хоббитов',
      icon: 'Castle',
      source: 'Книги Дж. Р. Р. Толкина'
    },
    { 
      name: 'Звёздные войны', 
      description: 'Галактика далеко-далеко, джедаи и ситхи',
      icon: 'Rocket',
      source: 'Фильмы Lucasfilm, расширенная вселенная'
    },
    { 
      name: 'Marvel', 
      description: 'Вселенная супергероев и злодеев',
      icon: 'Zap',
      source: 'Комиксы Marvel, фильмы MCU'
    },
    { 
      name: 'Игра престолов', 
      description: 'Вестерос, мир интриг и драконов',
      icon: 'Crown',
      source: 'Книги Джорджа Мартина, сериал HBO'
    },
    { 
      name: 'Ведьмак', 
      description: 'Континент, мир монстров и магии',
      icon: 'Sword',
      source: 'Книги Анджея Сапковского, игры CD Projekt Red'
    }
  ];

  const handleCanonSelect = async (canon: typeof canonUniverses[0]) => {
    setFormData({
      name: canon.name,
      description: canon.description,
      lore: '',
      rules: '',
      characters: '',
      locations: '',
      timeline: '',
      canonSource: canon.source,
      isCustom: false,
      mainConflict: '',
      keyEvents: '',
      resolution: '',
      genres: []
    });
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={20} />
              Создать вселенную
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Создание вселенной</DialogTitle>
              <DialogDescription>
                Выберите каноническую вселенную или создайте свою со всеми деталями
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="custom" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="custom">Своя вселенная</TabsTrigger>
                <TabsTrigger value="canon">Каноническая</TabsTrigger>
              </TabsList>
              
              <TabsContent value="custom" className="space-y-6 py-4">
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
              </TabsContent>
              
              <TabsContent value="canon" className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  ИИ изучит каноническую вселенную и будет следовать её правилам
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {canonUniverses.map((canon, idx) => (
                    <Card 
                      key={idx}
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => handleCanonSelect(canon)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Icon name={canon.icon as any} size={20} />
                          {canon.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {canon.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Источник: {canon.source}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {formData.canonSource && (
                  <div className="space-y-4 pt-4 border-t animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" size={20} className="text-primary" />
                      <h3 className="font-semibold">Выбрано: {formData.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="canon-description">Дополнительное описание (опционально)</Label>
                      <Textarea 
                        id="canon-description"
                        placeholder="Укажите конкретный период или аспект вселенной..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="min-h-[80px]"
                      />
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      onClick={handleCreate}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <Icon name="Loader2" size={20} className="animate-spin" />
                      ) : (
                        <Icon name="Download" size={20} />
                      )}
                      {isCreating ? 'Изучаю вселенную...' : 'Добавить и изучить'}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
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
            <Card 
              key={universe.id}
              className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 overflow-hidden relative group"
              onClick={onCardClick}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in 0.5s ease-out forwards'
              }}
            >
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => handleDelete(e, universe.id)}
                    disabled={deletingId === universe.id}
                  >
                    {deletingId === universe.id ? (
                      <Icon name="Loader2" size={14} className="animate-spin" />
                    ) : (
                      <Icon name="Trash2" size={14} />
                    )}
                  </Button>
                )}
              </div>

              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-transparent" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Icon name="Globe" size={20} className="text-primary" />
                      {!universe.isCustom && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Icon name="BookOpen" size={12} />
                          Канон
                        </Badge>
                      )}
                      {universe.learnedAt && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Icon name="Check" size={12} />
                          Изучена
                        </Badge>
                      )}
                      {universe.genres && universe.genres.length > 0 && (
                        universe.genres.slice(0, 2).map(genre => (
                          <Badge key={genre} variant="outline" className="text-xs gap-1">
                            <Icon name={getGenreIcon(genre) as any} size={10} />
                            {getGenreLabel(genre)}
                          </Badge>
                        ))
                      )}
                    </div>
                    <CardTitle className="text-xl font-serif mb-2">{universe.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {universe.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {universe.canonSource && (
                  <div className="text-xs text-muted-foreground border-t pt-3">
                    <strong>Источник:</strong> {universe.canonSource}
                  </div>
                )}

                {universe.mainConflict && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Icon name="Flame" size={12} />
                      Конфликт:
                    </p>
                    <p className="text-sm line-clamp-2">{universe.mainConflict}</p>
                  </div>
                )}
                
                <div className="flex gap-2 text-xs flex-wrap">
                  {universe.lore && <Badge variant="outline" className="gap-1"><Icon name="Book" size={10} />Лор</Badge>}
                  {universe.rules && <Badge variant="outline" className="gap-1"><Icon name="Scale" size={10} />Правила</Badge>}
                  {universe.characters && <Badge variant="outline" className="gap-1"><Icon name="Users" size={10} />Персонажи</Badge>}
                  {universe.locations && <Badge variant="outline" className="gap-1"><Icon name="Map" size={10} />Локации</Badge>}
                  {universe.keyEvents && <Badge variant="outline" className="gap-1"><Icon name="ListChecks" size={10} />События</Badge>}
                </div>

                {!universe.learnedAt && onLearnCanon && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={(e) => handleLearnCanon(e, universe.id)}
                    disabled={isLearning === universe.id}
                  >
                    {isLearning === universe.id ? (
                      <>
                        <Icon name="Loader2" size={14} className="animate-spin" />
                        Изучаю...
                      </>
                    ) : (
                      <>
                        <Icon name="Download" size={14} />
                        Изучить канон
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
