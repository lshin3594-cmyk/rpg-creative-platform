import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Character {
  id: number;
  name: string;
  age?: string;
  gender?: string;
  personality?: string;
  created_at: string;
}

interface World {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

interface Story {
  id: number;
  title?: string;
  genre?: string;
  status?: string;
  message_count?: number;
  created_at: string;
}

const MySaves = () => {
  const { user, isLoading } = useAuth();
  const { fetchWithAuth } = useAuthenticatedFetch();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setLoadingData(false);
    }
  }, [user]);

  const loadUserData = async () => {
    setLoadingData(true);
    try {
      const [charsRes, storiesRes] = await Promise.all([
        fetchWithAuth('https://functions.poehali.dev/bdf99cda-0137-4587-8760-d89f239695a5'),
        fetchWithAuth('https://functions.poehali.dev/a28e6e4e-e49d-4a08-8e5f-b7bff0a0d6da')
      ]);

      if (charsRes.ok) {
        const charsData = await charsRes.json();
        setCharacters(charsData.characters || []);
      }

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        setStories(storiesData.stories || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить сохранения',
        variant: 'destructive'
      });
    } finally {
      setLoadingData(false);
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Icon name="Lock" size={48} className="mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Требуется авторизация</h2>
          <p className="text-muted-foreground">Войдите для просмотра своих сохранений</p>
          <Button onClick={() => setShowAuthModal(true)} className="gap-2">
            <Icon name="LogIn" size={16} />
            Войти
          </Button>
        </div>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Icon name="Save" size={32} />
              Мои сохранения
            </h1>
            <p className="text-muted-foreground mt-1">
              Все ваши персонажи, миры и истории
            </p>
          </div>
          <Button onClick={loadUserData} variant="outline" size="sm" className="gap-2">
            <Icon name="RefreshCw" size={16} />
            Обновить
          </Button>
        </div>

        <Tabs defaultValue="characters" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="characters" className="gap-2">
              <Icon name="Users" size={16} />
              Персонажи ({characters.length})
            </TabsTrigger>
            <TabsTrigger value="worlds" className="gap-2">
              <Icon name="Globe" size={16} />
              Миры ({worlds.length})
            </TabsTrigger>
            <TabsTrigger value="stories" className="gap-2">
              <Icon name="BookOpen" size={16} />
              Истории ({stories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="space-y-4 mt-4">
            {characters.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="UserX" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Персонажи не созданы</p>
                  <Button asChild variant="outline" className="mt-4">
                    <a href="/create-fanfic">Создать персонажа</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {characters.map((char) => (
                  <Card key={char.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="User" size={18} />
                        {char.name}
                      </CardTitle>
                      <CardDescription>
                        {char.age && `${char.age} лет`}
                        {char.age && char.gender && ' • '}
                        {char.gender}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {char.personality || 'Без описания'}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>ID: {char.id}</span>
                        <span>{new Date(char.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="worlds" className="space-y-4 mt-4">
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="Construction" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Раздел в разработке</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-4 mt-4">
            {stories.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="BookX" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Истории не созданы</p>
                  <Button asChild variant="outline" className="mt-4">
                    <a href="/create-fanfic">Создать историю</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {stories.map((story) => (
                  <Card key={story.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="BookOpen" size={18} />
                        {story.title || `История #${story.id}`}
                      </CardTitle>
                      <CardDescription className="flex gap-2 flex-wrap">
                        {story.genre && <Badge variant="secondary">{story.genre}</Badge>}
                        {story.status && (
                          <Badge variant={story.status === 'active' ? 'default' : 'outline'}>
                            {story.status === 'active' ? 'Активна' : story.status}
                          </Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{story.message_count || 0} сообщений</span>
                        <span>{new Date(story.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MySaves;
