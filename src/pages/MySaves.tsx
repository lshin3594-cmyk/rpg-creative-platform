import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { storyStorage, type SavedStory } from '@/lib/storyStorage';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const MySaves = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<SavedStory[]>([]);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    const savedStories = storyStorage.getAll();
    setStories(savedStories.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту историю? Действие необратимо.')) {
      storyStorage.delete(id);
      loadStories();
      toast({
        title: 'Удалено',
        description: 'История удалена из библиотеки'
      });
    }
  };

  const handlePlay = (id: string) => {
    navigate(`/story/${id}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Icon name="Library" size={32} />
              Мои истории
            </h1>
            <p className="text-muted-foreground mt-1">
              Все сохранённые приключения
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Icon name="Plus" size={16} />
            Новая история
          </Button>
        </div>

        {stories.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Icon name="BookX" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Пока нет историй</h3>
              <p className="text-muted-foreground mb-6">Начните новое приключение!</p>
              <Button onClick={() => navigate('/')} size="lg" className="gap-2">
                <Icon name="Play" size={20} />
                Начать историю
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-all group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 line-clamp-1">
                    <Icon name="BookOpen" size={18} className="flex-shrink-0" />
                    <span className="truncate">{story.title}</span>
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-1">
                    <span>{story.messages.length} сообщений</span>
                    <span className="text-xs">
                      {formatDistanceToNow(story.updatedAt, { addSuffix: true, locale: ru })}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                      {story.messages[0]?.content || 'Нет содержимого'}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handlePlay(story.id)}
                        size="sm" 
                        className="flex-1 gap-2"
                      >
                        <Icon name="Play" size={16} />
                        Продолжить
                      </Button>
                      <Button
                        onClick={() => handleDelete(story.id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySaves;
