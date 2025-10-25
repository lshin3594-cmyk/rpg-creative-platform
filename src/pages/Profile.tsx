import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/components/UserProfile';
import { AuthModal } from '@/components/AuthModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-purple-300 rounded-full animate-twinkle"></div>
          <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-pink-200 rounded-full animate-twinkle-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-[50%] left-[20%] w-1 h-1 bg-purple-400 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-[35%] right-[25%] w-2 h-2 bg-pink-300 rounded-full animate-twinkle-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-[20%] left-[35%] w-1.5 h-1.5 bg-purple-200 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[70%] right-[40%] w-1 h-1 bg-pink-400 rounded-full animate-twinkle-slow" style={{ animationDelay: '2.5s' }}></div>
        </div>
        
        <div className="text-center space-y-6 relative z-10 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center border-2 border-purple-500/30">
            <Icon name="UserX" size={48} className="text-purple-300" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Профиль недоступен</h2>
            <p className="text-purple-200/70">Войдите в аккаунт, чтобы создавать персонажей и сохранять прогресс приключений</p>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)} 
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg shadow-purple-500/50"
            size="lg"
          >
            <Icon name="LogIn" size={18} />
            Войти в систему
          </Button>
          <p className="text-sm text-purple-300/50">или</p>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="gap-2 border-purple-500/40 hover:bg-purple-500/20 text-purple-200"
          >
            <Icon name="Home" size={16} />
            Вернуться на главную
          </Button>
        </div>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-6xl mx-auto">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;