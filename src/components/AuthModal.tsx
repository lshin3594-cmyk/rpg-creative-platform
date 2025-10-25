import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', username: '', password: '', confirmPassword: '' });

  const handleVkLogin = () => {
    const redirectUri = `${window.location.origin}/auth/vk/callback`;
    window.location.href = `https://oauth.vk.com/authorize?client_id=54268186&display=page&redirect_uri=${redirectUri}&response_type=code&v=5.131`;
  };

  const handleTelegramLogin = (user: any) => {
    fetch('https://functions.poehali.dev/cd68042f-5d2d-437d-83a5-6139b999a084', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'telegram', auth_data: user })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        window.location.reload();
      }
    })
    .catch(err => {
      toast({ title: 'Ошибка входа через Telegram', variant: 'destructive' });
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.login, loginData.password);
      toast({ title: 'Вы успешно вошли!' });
      onClose();
      setLoginData({ login: '', password: '' });
    } catch (error) {
      toast({ 
        title: 'Ошибка входа', 
        description: error instanceof Error ? error.message : 'Попробуйте снова',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({ title: 'Пароли не совпадают', variant: 'destructive' });
      return;
    }

    if (registerData.password.length < 6) {
      toast({ title: 'Пароль должен быть минимум 6 символов', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      await register(registerData.email, registerData.username, registerData.password);
      toast({ title: 'Аккаунт создан!' });
      onClose();
      setRegisterData({ email: '', username: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast({ 
        title: 'Ошибка регистрации', 
        description: error instanceof Error ? error.message : 'Попробуйте снова',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добро пожаловать!</DialogTitle>
          <DialogDescription>
            Войдите или создайте аккаунт для сохранения прогресса
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Email или имя пользователя</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="admin или admin@example.com"
                  value={loginData.login}
                  onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" className="mr-2" size={16} />
                    Войти
                  </>
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Или войти через
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVkLogin}
                  className="gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.51c-.19.52-.95 1.09-1.6 1.24-.33.08-.7.12-1.11.12-1.07 0-2.42-.37-4.01-1.37-2.34-1.47-4.23-4.12-5.28-6.6-.33-.77-.12-1.4.24-1.8.41-.47 1.02-.71 1.7-.71.31 0 .64.06.96.17.75.26 1.27.97 1.62 1.59.32.55.6 1.27.77 1.97.09.37.04.68-.13.92-.18.26-.48.42-.85.48-.13.02-.25.04-.36.08.32.76.79 1.48 1.37 2.09.58.61 1.28 1.12 2.02 1.47.04-.11.08-.24.11-.38.08-.37.26-.66.54-.84.26-.17.58-.25.93-.15.7.2 1.4.51 1.91.87.58.4 1.23.93 1.46 1.68z"/>
                  </svg>
                  ВКонтакте
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast({ title: 'Telegram Login в разработке' })}
                  className="gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.82-.27-1.47-.42-1.42-.88.03-.24.37-.48 1.02-.73 4-1.74 6.68-2.88 8.03-3.44 3.82-1.59 4.62-1.87 5.14-1.88.11 0 .37.03.54.17.14.11.18.26.2.37.01.06.03.21.01.33z"/>
                  </svg>
                  Telegram
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Уникальное имя"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Подтвердите пароль</Label>
                <Input
                  id="reg-confirm"
                  type="password"
                  placeholder="Повторите пароль"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                    Создание...
                  </>
                ) : (
                  <>
                    <Icon name="UserPlus" className="mr-2" size={16} />
                    Создать аккаунт
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};