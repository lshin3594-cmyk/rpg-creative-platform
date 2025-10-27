import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { PreviewCarousel } from '@/components/PreviewCarousel';
import { TemplateLibrary } from '@/components/TemplateLibrary';
import { useRpgGames } from '@/hooks/useRpgGames';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { createGame } = useRpgGames();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quickStarting, setQuickStarting] = useState(false);



  const handleQuickStart = async () => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите, чтобы начать игру',
        variant: 'destructive'
      });
      return;
    }

    setQuickStarting(true);

    try {
      const quickGameSettings = {
        role: 'hero',
        narrativeMode: 'third',
        playerCount: 1,
        genre: 'Фэнтези',
        rating: '18+',
        aiModel: 'deepseek',
        aiInstructions: '',
        initialCharacters: [],
        storyMemory: {
          keyMoments: [],
          characterRelationships: {},
          worldChanges: []
        }
      };

      const newGame = await createGame({
        title: `Приключение ${new Date().toLocaleDateString('ru-RU')}`,
        genre: 'Фэнтези',
        setting: 'Средневековый мир, полный магии и опасностей',
        difficulty: '18+',
        story_context: JSON.stringify(quickGameSettings)
      });

      if (newGame) {
        toast({
          title: 'Поехали! 🚀',
          description: 'Начинаем приключение!'
        });
        navigate('/play-game', { state: { gameId: newGame.id } });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать игру',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать игру',
        variant: 'destructive'
      });
    } finally {
      setQuickStarting(false);
    }
  };

  const [showTemplates, setShowTemplates] = useState(false);

  const menuItems = [
    {
      title: 'БЫСТРЫЙ СТАРТ',
      description: 'Начать играть прямо сейчас',
      icon: quickStarting ? 'Loader2' : 'Zap',
      onClick: handleQuickStart,
      loading: quickStarting,
      highlight: true
    },
    {
      title: 'ГОТОВЫЕ ИСТОРИИ',
      description: 'Выберите из 8 уникальных сюжетов',
      icon: 'Library',
      onClick: () => setShowTemplates(!showTemplates),
      highlight: showTemplates
    },
    {
      title: 'НАСТРОИТЬ ИГРУ',
      description: 'Подробная настройка параметров',
      icon: 'Settings',
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



  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl space-y-8">
        <PreviewCarousel />
        
        <div className="grid gap-4 md:gap-6 max-w-2xl mx-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              disabled={item.loading}
              className={`group relative w-full p-6 md:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 min-h-[100px] md:min-h-[120px] ${
                item.highlight 
                  ? 'bg-gradient-to-r from-purple-600/50 via-pink-600/40 to-purple-600/50 border-purple-400/60 hover:border-purple-300/80 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02]'
                  : 'bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border-purple-500/30 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20'
              } ${item.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                  <Icon 
                    name={item.icon} 
                    size={36} 
                    className={`text-purple-300 ${item.loading ? 'animate-spin' : ''}`} 
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        {showTemplates && (
          <div className="animate-fade-in">
            <TemplateLibrary />
          </div>
        )}


      </div>
    </div>
  );
};

export default Index;