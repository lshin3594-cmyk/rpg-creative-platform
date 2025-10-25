import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { PreviewCarousel } from '@/components/PreviewCarousel';

const Index = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'НАЧАТЬ ПРИКЛЮЧЕНИЕ',
      description: 'Создайте игру с нуля',
      icon: 'Play',
      onClick: () => navigate('/create-game'),
    },
    {
      title: 'ВЫБРАТЬ ПРИКЛЮЧЕНИЕ',
      description: 'Продолжите свои предыдущие приключения',
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl space-y-8">
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
      </div>
    </div>
  );
};

export default Index;