import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';

export const Navigation = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const navItems = [
    { path: '/create-fanfic', label: 'Генерация', icon: 'Sparkles' },
  ];

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
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  asChild
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <Icon name={item.icon as any} size={18} />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </Button>
              ))}

              {!isLoading && (
                user ? (
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/profile" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} alt={user.username} />
                        <AvatarFallback className="text-xs">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">{user.username}</span>
                    </Link>
                  </Button>
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