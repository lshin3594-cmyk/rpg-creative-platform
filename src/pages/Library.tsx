import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
    <div className="min-h-screen p-4 py-12 relative">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 gap-2 text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 z-10"
      >
        <Icon name="Home" size={18} />
        На главную
      </Button>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-purple-100 uppercase flex items-center justify-center gap-3">
            <Icon name="Library" size={36} />
            Библиотека историй
          </h1>
          <p className="text-purple-200/70">
            Все ваши сгенерированные истории
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <Icon name="Search" size={20} className="absolute left-7 top-1/2 -translate-y-1/2 text-purple-300/70" />
            <Input
              placeholder="Поиск по названию или содержанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={48} className="mx-auto animate-spin text-purple-400" />
              <p className="text-purple-200/70 mt-4">Загрузка историй...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="p-12 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md text-center">
              <Icon name="BookOpen" size={64} className="mx-auto text-purple-300/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-purple-100">Пока нет историй</h3>
              <p className="text-purple-200/70 mb-4">
                {searchQuery ? 'Ничего не найдено. Попробуйте изменить запрос.' : 'Создайте свою первую историю!'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate('/create-game')}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                >
                  <Icon name="Plus" size={18} />
                  Создать историю
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStories.map((story) => (
                <div 
                  key={story.id} 
                  className="p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md hover:border-purple-400/60 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-purple-100 flex items-center gap-2">
                          {story.title}
                          {story.is_favorite && (
                            <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                          )}
                        </h3>
                        <p className="text-sm text-purple-300/70 mt-1">
                          {new Date(story.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(story.id)}
                        className="h-8 w-8 p-0 hover:bg-purple-500/20"
                      >
                        <Icon
                          name="Star"
                          size={18}
                          className={story.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-purple-300/70'}
                        />
                      </Button>
                    </div>

                    <p className="text-sm text-purple-200/80 line-clamp-3">
                      {story.content}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-500/30 text-purple-100 border-purple-400/30">
                        {getLengthBadge(story.length)}
                      </Badge>
                      <Badge className="bg-pink-500/30 text-pink-100 border-pink-400/30">
                        {getStyleBadge(story.style)}
                      </Badge>
                      <Badge className="bg-purple-600/30 text-purple-100 border-purple-400/30">
                        {getRatingBadge(story.rating)}
                      </Badge>
                      {story.tags?.slice(0, 2).map((tag, i) => (
                        <Badge key={i} className="bg-purple-500/20 text-purple-200 border-purple-400/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => openStory(story)}
                      className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                    >
                      <Icon name="BookOpen" size={16} />
                      Читать полностью
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-purple-900/95 border-purple-500/40 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-100">
              {selectedStory?.title}
            </DialogTitle>
            <DialogDescription className="text-purple-200/70">
              {selectedStory && new Date(selectedStory.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedStory && (
                <>
                  <Badge className="bg-purple-500/30 text-purple-100 border-purple-400/30">
                    {getLengthBadge(selectedStory.length)}
                  </Badge>
                  <Badge className="bg-pink-500/30 text-pink-100 border-pink-400/30">
                    {getStyleBadge(selectedStory.style)}
                  </Badge>
                  <Badge className="bg-purple-600/30 text-purple-100 border-purple-400/30">
                    {getRatingBadge(selectedStory.rating)}
                  </Badge>
                  {selectedStory.tags?.map((tag, i) => (
                    <Badge key={i} className="bg-purple-500/20 text-purple-200 border-purple-400/20">
                      {tag}
                    </Badge>
                  ))}
                </>
              )}
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-purple-100 whitespace-pre-wrap">{selectedStory?.content}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Library;
