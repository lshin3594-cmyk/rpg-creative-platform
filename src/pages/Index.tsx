import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { PreviewCarousel } from '@/components/PreviewCarousel';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
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

const Index = () => {
  const navigate = useNavigate();
  const [saves, setSaves] = useState<GameSave[]>([]);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('game-saves') || '[]');
    const normalizedSaves = savedGames.map((save: any) => ({
      ...save,
      gameSettings: save.gameSettings || save.settings || {},
      episodeCount: save.episodeCount || save.history?.length || 0,
      lastAction: save.lastAction || 'Начало игры'
    }));
    setSaves(normalizedSaves.sort((a: GameSave, b: GameSave) => 
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    ).slice(0, 3));
  }, []);

  const menuItems = [
    {
      title: 'НАЧАТЬ ИГРУ',
      description: 'Создайте игру с нуля',
      icon: 'Play',
      onClick: () => navigate('/create-game'),
    },
    {
      title: 'МОИ ИГРЫ',
      description: 'Продолжите свои предыдущие игры',
      icon: 'BookMarked',
      onClick: () => navigate('/game-saves'),
    },
    {
      title: 'СОЗДАТЬ ПЕРСОНАЖА',
      description: 'Настройте идеального героя',
      icon: 'UserPlus',
      onClick: () => navigate('/profile'),
    },
  ];

  const handleContinue = (save: GameSave) => {
    navigate('/play-game', { state: { gameSettings: save.gameSettings, existingSave: save } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl space-y-8">
        <PreviewCarousel />
        
        <div className="grid gap-4 md:gap-6 max-w-2xl mx-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="group relative w-full p-6 md:p-8 rounded-xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20 min-h-[100px] md:min-h-[120px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 rounded-xl transition-all duration-300" />
              
              <div className="relative flex items-center justify-between blur-[1px] group-hover:blur-0 brightness-75 group-hover:brightness-100 transition-all duration-300">
                <div className="flex-1 text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p className="text-base md:text-lg text-purple-200/80">
                    {item.description}
                  </p>
                </div>
                
                <div className="ml-4 p-4 md:p-5 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/40 transition-all duration-300">
                  <Icon name={item.icon} size={36} className="text-purple-300" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Мои игры */}
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
                      {save.gameSettings.initialCharacters && save.gameSettings.initialCharacters.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {save.gameSettings.initialCharacters.slice(0, 2).map((char, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Icon name="User" size={10} className="mr-1" />
                              {char.name}
                            </Badge>
                          ))}
                          {save.gameSettings.initialCharacters.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{save.gameSettings.initialCharacters.length - 2}
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
  );
};

export default Index;