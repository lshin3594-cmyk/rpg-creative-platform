import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { PreviewCarousel } from '@/components/PreviewCarousel';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

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

const Index = () => {
  const navigate = useNavigate();
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [gameName, setGameName] = useState('');

  useEffect(() => {
    try {
      const savedGames = JSON.parse(localStorage.getItem('game-saves') || '[]');
      const normalizedSaves = savedGames
        .map((save: any) => ({
          ...save,
          gameSettings: save.gameSettings || save.settings || {},
          episodeCount: save.episodeCount || save.history?.length || 0,
          lastAction: save.lastAction || 'Начало игры',
          savedAt: save.savedAt || new Date().toISOString()
        }))
        .filter((save: any) => save.gameSettings?.name);
      
      setSaves(normalizedSaves.sort((a: GameSave, b: GameSave) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      ).slice(0, 3));
    } catch (error) {
      console.error('Error loading saves:', error);
      setSaves([]);
    }
  }, []);



  const handleContinue = (save: GameSave) => {
    navigate('/play-game', { state: { gameSettings: save.gameSettings, existingSave: save } });
  };

  const handleStartGame = () => {
    if (gameName.trim()) {
      navigate('/create-game', { state: { gameName } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-purple-500/20 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Icon name="Sparkles" size={24} className="text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              РОЛЕВИК
            </h1>
          </div>
          <Button 
            onClick={() => navigate('/game-saves')} 
            variant="outline" 
            size="sm"
            className="gap-2 border-purple-500/30 hover:bg-purple-500/10"
          >
            <Icon name="BookMarked" size={16} />
            Мои игры
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-6xl space-y-8">
          <PreviewCarousel />
          
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-900/20 via-background/50 to-pink-900/20 border-purple-500/30">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Создать новую игру
              </CardTitle>
              <CardDescription className="text-center">
                Введите название вашей истории
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Например: Подземелья Драконов"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
                  className="flex-1 bg-background/50 border-purple-500/30 focus-visible:ring-purple-500"
                />
                <Button 
                  onClick={handleStartGame}
                  disabled={!gameName.trim()}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Icon name="Play" size={16} />
                  Начать
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {saves.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-purple-100 flex items-center gap-2">
                <Icon name="Save" size={24} />
                Мои игры
              </h2>
              <Button 
                onClick={() => navigate('/game-saves')} 
                variant="ghost" 
                size="sm"
                className="text-purple-300 hover:text-purple-100"
              >
                Все игры
                <Icon name="ArrowRight" size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {saves.map((save) => (
                <Card key={save.id} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all group overflow-hidden">
                  {save.coverUrl && (
                    <div className="relative w-full h-32 overflow-hidden">
                      <img 
                        src={save.coverUrl} 
                        alt={save.gameSettings.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 line-clamp-1 text-base">
                      <Icon name="Gamepad2" size={16} className="flex-shrink-0 text-primary" />
                      <span className="truncate">{save.gameSettings?.name || 'Игра'}</span>
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {save.gameSettings?.genre || 'Фэнтези'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {save.gameSettings?.rating || '18+'}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {save.gameSettings?.initialCharacters && Array.isArray(save.gameSettings.initialCharacters) && save.gameSettings.initialCharacters.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {save.gameSettings.initialCharacters.filter(char => char && char.name).slice(0, 2).map((char, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Icon name="User" size={10} className="mr-1" />
                              {char.name}
                            </Badge>
                          ))}
                          {save.gameSettings.initialCharacters.filter(char => char && char.name).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{save.gameSettings.initialCharacters.filter(char => char && char.name).length - 2}
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
                            {(() => {
                              try {
                                return formatDistanceToNow(new Date(save.savedAt), { addSuffix: true, locale: ru });
                              } catch {
                                return 'недавно';
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {save.lastAction}
                      </p>
                      
                      <Button 
                        onClick={() => handleContinue(save)}
                        size="sm" 
                        className="w-full gap-2"
                      >
                        <Icon name="Play" size={16} />
                        Продолжить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;