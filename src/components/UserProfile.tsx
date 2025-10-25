import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isPlaying, toggle } = useBackgroundMusic();

  if (!user) return null;

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-purple-100">
            <Icon name="User" size={24} />
            Анкета игрока
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-200">Никнейм</Label>
              <Input 
                id="username"
                value={user.username} 
                readOnly
                className="bg-black/30 border-purple-500/30 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">Email</Label>
              <Input 
                id="email"
                value={user.email} 
                readOnly
                className="bg-black/30 border-purple-500/30 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-purple-200">Имя персонажа</Label>
            <Input 
              id="display_name"
              placeholder="Как вас называть в игре?"
              defaultValue={user.display_name}
              className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-purple-200">О себе</Label>
            <Textarea 
              id="bio"
              placeholder="Расскажите немного о себе..."
              className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-purple-100">
            <Icon name="Settings" size={20} />
            Настройки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Icon name={isPlaying ? 'Volume2' : 'VolumeX'} size={20} className="text-purple-300" />
              <div>
                <p className="font-medium text-purple-100">Фоновая музыка</p>
                <p className="text-sm text-purple-300/70">Атмосферные звуки</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggle}
              className="border-purple-500/40 hover:bg-purple-500/20 text-purple-200"
            >
              {isPlaying ? 'Выключить' : 'Включить'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Icon name="Save" size={20} className="text-purple-300" />
              <div>
                <p className="font-medium text-purple-100">Мои сохранения</p>
                <p className="text-sm text-purple-300/70">История игр</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/my-saves')}
              className="border-purple-500/40 hover:bg-purple-500/20 text-purple-200"
            >
              Открыть
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Icon name="Library" size={20} className="text-purple-300" />
              <div>
                <p className="font-medium text-purple-100">Библиотека</p>
                <p className="text-sm text-purple-300/70">Все приключения</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/library')}
              className="border-purple-500/40 hover:bg-purple-500/20 text-purple-200"
            >
              Открыть
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1 gap-2 border-purple-500/40 hover:bg-purple-500/20 text-purple-200"
          onClick={() => navigate('/')}
        >
          <Icon name="Home" size={16} />
          На главную
        </Button>
        <Button 
          variant="destructive" 
          className="gap-2"
          onClick={logout}
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </Button>
      </div>
    </div>
  );
};