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
