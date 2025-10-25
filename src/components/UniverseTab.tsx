import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lore: '',
    rules: '',
    characters: '',
    locations: '',
    timeline: '',
    canonSource: '',
    isCustom: true
  });

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
        isCustom: true
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
      isCustom: false
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-serif font-semibold">Библиотека вселенных</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Создайте свою вселенную или выберите каноническую
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={20} />
              Добавить вселенную
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Создание вселенной</DialogTitle>
              <DialogDescription>
                Выберите каноническую вселенную или создайте свою
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="canon" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="canon">Каноническая</TabsTrigger>
                <TabsTrigger value="custom">Своя вселенная</TabsTrigger>
              </TabsList>
              
              <TabsContent value="canon" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  ИИ изучит каноническую вселенную и будет следовать её правилам в историях
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
              
              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="universe-name">Название вселенной</Label>
                  <Input 
                    id="universe-name" 
                    placeholder="Новый Эдем" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value, isCustom: true, canonSource: ''})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="universe-description">Краткое описание</Label>
                  <Textarea 
                    id="universe-description" 
                    placeholder="Опишите основную концепцию вселенной..." 
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="universe-lore">История и лор</Label>
                    <Textarea 
                      id="universe-lore" 
                      placeholder="Ключевые исторические события..."
                      className="min-h-[120px]"
                      value={formData.lore}
                      onChange={(e) => setFormData({...formData, lore: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universe-rules">Правила и законы</Label>
                    <Textarea 
                      id="universe-rules" 
                      placeholder="Физические, магические, социальные правила..."
                      className="min-h-[120px]"
                      value={formData.rules}
                      onChange={(e) => setFormData({...formData, rules: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universe-characters">Ключевые персонажи</Label>
                    <Textarea 
                      id="universe-characters" 
                      placeholder="Главные герои, злодеи, важные NPC..."
                      className="min-h-[120px]"
                      value={formData.characters}
                      onChange={(e) => setFormData({...formData, characters: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universe-locations">Локации</Label>
                    <Textarea 
                      id="universe-locations" 
                      placeholder="Города, континенты, планеты..."
                      className="min-h-[120px]"
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
                    className="min-h-[100px]"
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  />
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
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {universes.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="inline-flex p-6 rounded-full bg-primary/10">
            <Icon name="Globe" size={48} className="text-primary" />
          </div>
          <h3 className="text-2xl font-serif font-semibold">Нет добавленных вселенных</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Создайте свою вселенную или выберите каноническую, чтобы ИИ следовал её правилам
          </p>
          <Button size="lg" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Icon name="Plus" size={20} />
            Добавить первую вселенную
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
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Globe" size={20} className="text-primary" />
                      {!universe.isCustom && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Icon name="BookOpen" size={12} />
                          Каноническая
                        </Badge>
                      )}
                      {universe.learnedAt && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Icon name="Check" size={12} />
                          Изучена
                        </Badge>
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
                
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {universe.lore && <Badge variant="outline" className="gap-1"><Icon name="Book" size={10} />Лор</Badge>}
                  {universe.rules && <Badge variant="outline" className="gap-1"><Icon name="Scale" size={10} />Правила</Badge>}
                  {universe.characters && <Badge variant="outline" className="gap-1"><Icon name="Users" size={10} />Персонажи</Badge>}
                  {universe.locations && <Badge variant="outline" className="gap-1"><Icon name="Map" size={10} />Локации</Badge>}
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
                        Изучаю вселенную...
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
