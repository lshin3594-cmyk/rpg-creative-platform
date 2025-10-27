import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useRpgGames } from '@/hooks/useRpgGames';
import { useAuth } from '@/contexts/AuthContext';
import { migrateLocalStorageToDb } from '@/utils/migrateLocalStorageToDb';

export default function GameSaves() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { games, loading, deleteGame, loadGames, createGame } = useRpgGames();
  const { token, user } = useAuth();
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    const runMigration = async () => {
      if (user && token && !migrating) {
        const oldSaves = localStorage.getItem('game-saves');
        if (oldSaves) {
          setMigrating(true);
          toast({
            title: 'Миграция данных',
            description: 'Переносим старые игры в облако...'
          });
          await migrateLocalStorageToDb(createGame, token);
          setMigrating(false);
          toast({
            title: 'Готово!',
            description: 'Все игры перенесены в облако'
          });
          loadGames();
        } else {
          loadGames();
        }
      }
    };
    runMigration();
  }, [user, token]);

  const handleDelete = async (id: number) => {
    const success = await deleteGame(id);
    if (success) {
      toast({
        title: 'Удалено',
        description: 'Игра удалена'
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить игру',
        variant: 'destructive'
      });
    }
  };

  const handleContinue = (game: any) => {
    navigate('/play-game', { state: { gameId: game.id } });
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-purple-100">
              <Icon name="Save" size={32} />
              Мои игры
            </h1>
            <p className="text-purple-300/70 mt-1">
              Все сохранённые игровые сессии
            </p>
          </div>
          <Button onClick={() => navigate('/create-game')} className="gap-2">
            <Icon name="Plus" size={16} />
            Новая игра
          </Button>
        </div>

        {loading ? (
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="py-16 text-center">
              <Icon name="Loader2" size={64} className="mx-auto text-muted-foreground mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Загрузка...</h3>
            </CardContent>
          </Card>
        ) : games.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="py-16 text-center">
              <Icon name="GamepadIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Пока нет сохранений</h3>
              <p className="text-muted-foreground mb-6">Начните новую игру!</p>
              <Button onClick={() => navigate('/create-game')} size="lg" className="gap-2">
                <Icon name="Rocket" size={20} />
                Создать игру
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Card key={game.id} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all group overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 line-clamp-1">
                    <Icon name="Gamepad2" size={18} className="flex-shrink-0 text-primary" />
                    <span className="truncate">{game.title || 'Игра'}</span>
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2">
                    {game.genre && (
                      <Badge variant="secondary" className="text-xs">
                        {game.genre}
                      </Badge>
                    )}
                    {game.difficulty && (
                      <Badge variant="outline" className="text-xs">
                        {game.difficulty}
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {game.setting && (
                      <div className="text-xs text-muted-foreground bg-primary/5 p-2 rounded border border-primary/10">
                        <Icon name="Map" size={12} className="inline mr-1" />
                        {game.setting.slice(0, 80)}{game.setting.length > 80 ? '...' : ''}
                      </div>
                    )}
                    
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="BookMarked" size={14} />
                        <span>Эпизодов: {game.actions_log?.length || 0}</span>
                      </div>
                      {game.last_played && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name="Clock" size={14} />
                          <span className="text-xs">
                            {formatDistanceToNow(new Date(game.last_played), { addSuffix: true, locale: ru })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {game.current_chapter && (
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {game.current_chapter}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleContinue(game)}
                        size="sm" 
                        className="flex-1 gap-2"
                      >
                        <Icon name="Play" size={16} />
                        Продолжить
                      </Button>
                      <Button
                        onClick={() => handleDelete(game.id)}
                        variant="destructive"
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
}