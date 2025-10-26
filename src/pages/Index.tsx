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
  settings: {
    name: string;
    genre: string;
    rating: string;
  };
  history: any[];
  currentStory: string;
  episodeCount: number;
  savedAt: string;
  lastAction: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [saves, setSaves] = useState<GameSave[]>([]);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('saved-games') || '[]');
    setSaves(savedGames.sort((a: GameSave, b: GameSave) => 
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    ).slice(0, 3)); // Показываем только 3 последних
  }, []);

  const menuItems = [
    {
      title: 'НАЧАТЬ ИГРУ',
      description: 'Создайте игру с нуля',
      icon: 'Play',
      onClick: () => navigate('/create-game'),
    },
    {
      title: 'ВЫБРАТЬ ИГРУ',
      description: 'Продолжите свои предыдущие игры',
      icon: 'BookMarked',
      onClick: () => navigate('/library'),
    },
    {
      title: 'СОЗДАТЬ ПЕРСОНАЖА',
      description: 'Настройте идеального героя',
      icon: 'UserPlus',
      onClick: () => navigate('/profile'),
    },
  ];

  const handleContinue = (save: GameSave) => {
    navigate('/play-game', { state: { gameSettings: save.settings, existingSave: save } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl space-y-8">
        <PreviewCarousel />
        
        <div className="grid gap-4 max-w-2xl mx-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="group relative w-full p-6 rounded-xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 rounded-xl transition-all duration-300" />
              
              <div className="relative flex items-center justify-between blur-[1px] group-hover:blur-0 brightness-75 group-hover:brightness-100 transition-all duration-300">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-purple-200/80">
                    {item.description}
                  </p>
                </div>
                
                <div className="ml-4 p-3 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/40 transition-all duration-300">
                  <Icon name={item.icon} size={28} className="text-purple-300" />
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
                <Card key={save.id} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 line-clamp-1 text-base">
                      <Icon name="Gamepad2" size={16} className="flex-shrink-0 text-primary" />
                      <span className="truncate">{save.settings.name}</span>
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {save.settings.genre}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {save.settings.rating}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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