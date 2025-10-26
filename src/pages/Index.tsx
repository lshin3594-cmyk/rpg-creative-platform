import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { PreviewCarousel } from '@/components/PreviewCarousel';

const Index = () => {
  const navigate = useNavigate();



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


      </div>
    </div>
  );
};

export default Index;