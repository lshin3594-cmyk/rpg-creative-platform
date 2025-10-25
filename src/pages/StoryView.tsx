import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  created_at: string;
}

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(
          `https://functions.poehali.dev/4edb076b-0c05-4d7c-853b-526d0c476653?id=${id}`
        );

        if (!response.ok) throw new Error('Failed to fetch story');

        const data = await response.json();
        if (data.stories && data.stories.length > 0) {
          setStory(data.stories[0]);
        } else {
          throw new Error('Story not found');
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить историю',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад к генератору
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-4">{story.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{story.length}</Badge>
                  <Badge variant="outline">{story.style}</Badge>
                  <Badge variant="outline">{story.rating}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-6">
              <Icon name="Calendar" size={14} className="inline mr-1" />
              {formatDate(story.created_at)}
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Icon name="PlusCircle" size={20} className="mr-2" />
            Создать новую историю
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
