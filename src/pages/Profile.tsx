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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Icon name="UserX" size={48} className="mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Профиль недоступен</h2>
          <p className="text-muted-foreground">Войдите в аккаунт для доступа к профилю</p>
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
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-6xl mx-auto">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;