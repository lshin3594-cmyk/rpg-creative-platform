import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface GameSave {
  id: string;
  gameSettings: {
    name: string;
    genre: string;
    rating: string;
    setting?: string;
    initialCharacters?: Array<{
      name: string;
      role?: string;
    }>;
  };
  history: any[];
  currentStory: string;
  episodeCount: number;
  savedAt: string;
  lastAction: string;
  coverUrl?: string;
}

export default function GameSaves() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saves, setSaves] = useState<GameSave[]>([]);

  useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = () => {
    const savedGames = JSON.parse(localStorage.getItem('saved-games') || '[]');
    setSaves(savedGames.sort((a: GameSave, b: GameSave) => 
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    ));
  };

  const handleDelete = (id: string) => {
    const savedGames = JSON.parse(localStorage.getItem('saved-games') || '[]');
    const updated = savedGames.filter((g: GameSave) => g.id !== id);
    localStorage.setItem('saved-games', JSON.stringify(updated));
    loadSaves();
    toast({
      title: 'Удалено',
      description: 'Сохранение игры удалено'
    });
  };

  const handleContinue = (save: GameSave) => {
    navigate('/play-game', { state: { gameSettings: save.gameSettings, existingSave: save } });
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

        {saves.length === 0 ? (
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
            {saves.map((save) => (
              <Card key={save.id} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all group overflow-hidden">
                {save.coverUrl && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img 
                      src={save.coverUrl} 
                      alt={save.gameSettings.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 line-clamp-1">
                    <Icon name="Gamepad2" size={18} className="flex-shrink-0 text-primary" />
                    <span className="truncate">{save.gameSettings.name}</span>
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {save.gameSettings.genre}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {save.gameSettings.rating}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {save.gameSettings.setting && (
                      <div className="text-xs text-muted-foreground bg-primary/5 p-2 rounded border border-primary/10">
                        <Icon name="Map" size={12} className="inline mr-1" />
                        {save.gameSettings.setting.slice(0, 80)}{save.gameSettings.setting.length > 80 ? '...' : ''}
                      </div>
                    )}
                    
                    {save.gameSettings.initialCharacters && save.gameSettings.initialCharacters.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {save.gameSettings.initialCharacters.slice(0, 3).map((char, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Icon name="User" size={10} className="mr-1" />
                            {char.name}
                          </Badge>
                        ))}
                        {save.gameSettings.initialCharacters.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{save.gameSettings.initialCharacters.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="BookMarked" size={14} />
                        <span>Эпизод {save.episodeCount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(save.savedAt), { addSuffix: true, locale: ru })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {save.lastAction}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleContinue(save)}
                        size="sm" 
                        className="flex-1 gap-2"
                      >
                        <Icon name="Play" size={16} />
                        Продолжить
                      </Button>
                      <Button
                        onClick={() => handleDelete(save.id)}
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