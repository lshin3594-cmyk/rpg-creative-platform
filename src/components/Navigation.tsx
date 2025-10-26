import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import Icon from '@/components/ui/icon';

export const Navigation = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isPlaying, toggle } = useBackgroundMusic();
  
  // Скрываем навигацию в игре
  if (location.pathname.startsWith('/story/')) {
    return null;
  }

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Icon name="Moon" size={24} className="text-primary" />
              <span>Midnight Chronicles</span>
            </Link>

            <div className="flex items-center gap-2">
              {!isLoading && (
                user ? (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/game-saves" className="flex items-center gap-2">
                        <Icon name="Save" size={18} />
                        <span className="hidden md:inline">Мои игры</span>
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/profile" className="flex items-center gap-2">
                        <Icon name="User" size={18} />
                        <span className="hidden md:inline">Профиль</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {/* TODO: logout */}}
                      className="gap-2"
                    >
                      <Icon name="LogOut" size={18} />
                      <span className="hidden md:inline">Выход</span>
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAuthModal(true)}
                    className="gap-1"
                  >
                    <Icon name="LogIn" size={16} />
                    <span className="hidden md:inline">Вход</span>
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};