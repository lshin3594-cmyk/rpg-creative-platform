import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { DELETE_STORY_URL } from '@/components/game/types';

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

  const deleteStory = async (storyId: number) => {
    if (!confirm('Точно удалить эту игру? Это действие нельзя отменить.')) return;
    
    try {
      const response = await fetch(`${DELETE_STORY_URL}?story_id=${storyId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setStories(prev => prev.filter(s => s.id !== storyId));
        toast({
          title: "Удалено",
          description: "Игра удалена из библиотеки"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить игру",
        variant: "destructive"
      });
    }
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

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const displayedStories = showOnlyFavorites 
    ? filteredStories.filter(s => s.is_favorite)
    : filteredStories;

  return (
    <div className="min-h-screen p-4 py-12 relative">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 gap-2 text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 z-10 text-base md:text-sm h-12 md:h-10 px-4"
      >
        <Icon name="Home" size={24} className="md:w-[18px] md:h-[18px]" />
        <span className="hidden sm:inline">На главную</span>
      </Button>

      <Button
        variant="ghost"
        onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
        className="absolute top-4 right-4 gap-2 text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 z-10 text-base md:text-sm h-12 md:h-10 px-4"
      >
        <Icon name={showOnlyFavorites ? "Star" : "Star"} size={24} className={`md:w-[18px] md:h-[18px] ${showOnlyFavorites ? "fill-yellow-400 text-yellow-400" : ""}`} />
        <span className="hidden sm:inline">{showOnlyFavorites ? 'Все игры' : 'Избранное'}</span>
      </Button>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3 pt-8 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-100 uppercase flex items-center justify-center gap-3">
            <Icon name="Library" size={36} className="md:w-9 md:h-9" />
            Библиотека игр
          </h1>
          <p className="text-base md:text-lg text-purple-200/70">
            Все ваши сгенерированные игры
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <Icon name="Search" size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-purple-300/70 md:w-5 md:h-5" />
            <Input
              placeholder="Поиск по названию или содержанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50 h-14 md:h-10 text-base md:text-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={48} className="mx-auto animate-spin text-purple-400" />
              <p className="text-purple-200/70 mt-4">Загрузка игр...</p>
            </div>
          ) : displayedStories.length === 0 ? (
            <div className="p-12 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md text-center">
              <Icon name="BookOpen" size={64} className="mx-auto text-purple-300/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-purple-100">
                {showOnlyFavorites ? 'Нет избранных игр' : 'Пока нет игр'}
              </h3>
              <p className="text-purple-200/70 mb-4">
                {showOnlyFavorites 
                  ? 'Добавьте игры в избранное, нажав на звёздочку' 
                  : searchQuery 
                    ? 'Ничего не найдено. Попробуйте изменить запрос.' 
                    : 'Создайте свою первую игру!'}
              </p>
              {!searchQuery && !showOnlyFavorites && (
                <Button
                  onClick={() => navigate('/create-game')}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                >
                  <Icon name="Plus" size={18} />
                  Создать игру
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {displayedStories.map((story) => (
                <div 
                  key={story.id} 
                  className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md hover:border-purple-400/60 transition-all"
                >
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-xl font-bold text-purple-100 flex items-center gap-2">
                          {story.title}
                          {story.is_favorite && (
                            <Icon name="Star" size={20} className="fill-yellow-400 text-yellow-400 md:w-4 md:h-4" />
                          )}
                        </h3>
                        <p className="text-base md:text-sm text-purple-300/70 mt-1">
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
                        className="h-12 w-12 md:h-8 md:w-8 p-0 hover:bg-purple-500/20"
                      >
                        <Icon
                          name="Star"
                          size={24}
                          className={`md:w-[18px] md:h-[18px] ${story.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-purple-300/70'}`}
                        />
                      </Button>
                    </div>

                    <p className="text-base md:text-sm text-purple-200/80 line-clamp-3">
                      {story.content}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-500/30 text-purple-100 border-purple-400/30 text-sm md:text-xs py-1 px-3 md:py-0.5 md:px-2">
                        {getLengthBadge(story.length)}
                      </Badge>
                      <Badge className="bg-pink-500/30 text-pink-100 border-pink-400/30 text-sm md:text-xs py-1 px-3 md:py-0.5 md:px-2">
                        {getStyleBadge(story.style)}
                      </Badge>
                      <Badge className="bg-purple-600/30 text-purple-100 border-purple-400/30 text-sm md:text-xs py-1 px-3 md:py-0.5 md:px-2">
                        {getRatingBadge(story.rating)}
                      </Badge>
                      {story.tags?.slice(0, 2).map((tag, i) => (
                        <Badge key={i} className="bg-purple-500/20 text-purple-200 border-purple-400/20 text-sm md:text-xs py-1 px-3 md:py-0.5 md:px-2">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 md:gap-3">
                      <Button
                        onClick={() => openStory(story)}
                        className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none h-12 md:h-10 text-base md:text-sm"
                      >
                        <Icon name="BookOpen" size={20} className="md:w-4 md:h-4" />
                        Читать
                      </Button>
                      <Button
                        onClick={() => deleteStory(story.id)}
                        variant="ghost"
                        className="gap-2 text-red-300 hover:text-red-100 hover:bg-red-500/20 h-12 md:h-10 px-4 md:px-3"
                      >
                        <Icon name="Trash2" size={20} className="md:w-4 md:h-4" />
                      </Button>
                    </div>
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