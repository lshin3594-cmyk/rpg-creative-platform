import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Story {
  id: number;
  title: string;
  content: string;
  universe_id: number;
  character_ids: number[];
  length: string;
  style: string;
  rating: string;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
}

const Library = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const carouselImages = [
    'https://cdn.poehali.dev/files/11a64f46-796a-4ce6-9051-28d80e0c7bdd.jpg',
    'https://cdn.poehali.dev/files/b8e36227-587c-4816-8a2b-9039de9a03b1.jpeg',
    'https://cdn.poehali.dev/files/7b8ad11e-21c5-441e-99ca-9c54c2c89171.jpg',
  ];

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = stories.filter(story =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStories(filtered);
    } else {
      setFilteredStories(stories);
    }
  }, [searchQuery, stories]);

  const loadStories = async () => {
    setIsLoading(true);
    const mockStories: Story[] = [
      {
        id: 1,
        title: 'Битва в Хогвартсе',
        content: 'Эпическая история о последней битве...',
        universe_id: 1,
        character_ids: [1, 2],
        length: 'long',
        style: 'narrative',
        rating: 'teen',
        is_favorite: false,
        tags: ['магия', 'приключения'],
        created_at: new Date().toISOString()
      }
    ];
    setStories(mockStories);
    setFilteredStories(mockStories);
    setIsLoading(false);
  };

  const openStory = (story: Story) => {
    setSelectedStory(story);
    setIsDialogOpen(true);
  };

  const toggleFavorite = async (storyId: number) => {
    setStories(prev => prev.map(s => 
      s.id === storyId ? { ...s, is_favorite: !s.is_favorite } : s
    ));
    toast({
      title: "Успешно",
      description: "Статус избранного обновлён"
    });
  };

  const getLengthBadge = (length: string) => {
    const labels: Record<string, string> = {
      short: 'Короткий',
      medium: 'Средний',
      long: 'Длинный'
    };
    return labels[length] || length;
  };

  const getStyleBadge = (style: string) => {
    const labels: Record<string, string> = {
      narrative: 'Повествование',
      dialogue: 'Диалоги',
      descriptive: 'Описательный',
      poetic: 'Поэтичный'
    };
    return labels[style] || style;
  };

  const getRatingBadge = (rating: string) => {
    const labels: Record<string, string> = {
      general: 'Для всех',
      teen: 'Подростки',
      mature: 'Взрослые'
    };
    return labels[rating] || rating;
  };

  return (
    <PageLayout
      carouselImages={carouselImages}
      currentImageIndex={0}
      onNextImage={() => {}}
      onPrevImage={() => {}}
      onSelectIndex={() => {}}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Icon name="Library" size={32} />
              Библиотека историй
            </h1>
            <p className="text-muted-foreground mt-1">
              Все ваши сгенерированные фанфики
            </p>
          </div>
          <Button variant="outline" onClick={loadStories}>
            <Icon name="RefreshCw" size={18} className="mr-2" />
            Обновить
          </Button>
        </div>

        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или содержанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Загрузка историй...</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Icon name="BookOpen" size={64} className="mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Пока нет историй</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Ничего не найдено. Попробуйте изменить запрос.' : 'Создайте свою первую историю!'}
              </p>
              {!searchQuery && (
                <Button>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать историю
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStories.map((story) => (
              <Card key={story.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {story.title}
                        {story.is_favorite && (
                          <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(story.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(story.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon
                        name="Star"
                        size={18}
                        className={story.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {story.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{getLengthBadge(story.length)}</Badge>
                    <Badge variant="secondary">{getStyleBadge(story.style)}</Badge>
                    <Badge variant="outline">{getRatingBadge(story.rating)}</Badge>
                    {story.tags?.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <Button
                    onClick={() => openStory(story)}
                    className="w-full"
                    variant="outline"
                  >
                    <Icon name="BookOpen" size={16} className="mr-2" />
                    Читать полностью
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="BookOpen" size={24} />
                  {selectedStory.title}
                </DialogTitle>
                <DialogDescription>
                  {new Date(selectedStory.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>{getLengthBadge(selectedStory.length)}</Badge>
                  <Badge>{getStyleBadge(selectedStory.style)}</Badge>
                  <Badge variant="outline">{getRatingBadge(selectedStory.rating)}</Badge>
                  {selectedStory.tags?.map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-base leading-relaxed">
                    {selectedStory.content}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Library;
