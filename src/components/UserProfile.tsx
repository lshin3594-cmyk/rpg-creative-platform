import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  personality?: string;
}

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isPlaying, toggle } = useBackgroundMusic();
  const [characters] = useState<Character[]>([
    {
      id: '1',
      name: 'Космический Рейнджер',
      role: 'Исследователь',
      avatar: 'https://cdn.poehali.dev/files/179eeb57-770d-43b9-b464-f8c287a1afbb.png',
      personality: 'Отважный защитник галактики'
    }
  ]);

  if (!user) return null;

  return (
    <div className="w-full space-y-6">
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

      <Card className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-purple-100">
            <Icon name="Users" size={20} />
            Мои персонажи
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Кнопка создания */}
            <Card 
              className="border-2 border-dashed border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-gradient-to-br from-purple-950/20 via-black/40 to-pink-950/20 relative group overflow-hidden min-h-[280px] flex items-center justify-center"
              onClick={() => navigate('/create-game')}
            >
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Icon name="Plus" size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-purple-100">Создать персонажа</p>
                  <p className="text-sm text-purple-300/70">Новый герой приключений</p>
                </div>
              </div>
            </Card>

            {/* Карточки персонажей */}
            {characters.map((character, index) => (
              <Card 
                key={character.id}
                className="border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm bg-gradient-to-br from-purple-950/40 via-black/60 to-pink-950/40 relative group overflow-hidden hover:shadow-[0_0_30px_rgba(168,85,247,0.4),0_0_60px_rgba(236,72,153,0.2)]"
                onClick={() => navigate('/create-game')}
              >
                {/* Звёзды на фоне */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-[25%] right-[20%] w-1.5 h-1.5 bg-pink-200 rounded-full animate-twinkle-slow" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-[45%] left-[25%] w-0.5 h-0.5 bg-purple-400 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-[30%] right-[15%] w-1 h-1 bg-pink-300 rounded-full animate-twinkle-slow" style={{ animationDelay: '1.5s' }}></div>
                  <div className="absolute bottom-[15%] left-[30%] w-1 h-1 bg-purple-200 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute top-[60%] right-[40%] w-0.5 h-0.5 bg-pink-400 rounded-full animate-twinkle-slow" style={{ animationDelay: '2.5s' }}></div>
                </div>

                <CardHeader className="text-center pb-2 relative z-10">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24 border-4 border-purple-500/40 shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-purple-400/50 group-hover:shadow-2xl">
                      <AvatarImage 
                        src={character.avatar} 
                        alt={character.name}
                        className="opacity-60 blur-[2px] grayscale-[30%] group-hover:opacity-100 group-hover:blur-0 group-hover:grayscale-0 transition-all duration-500"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl">{character.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-lg font-serif text-purple-100">{character.name}</CardTitle>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs bg-purple-600/30 text-purple-200 border-purple-500/40">{character.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  {character.personality && (
                    <div>
                      <p className="text-sm text-purple-300/70 mb-1">Характер:</p>
                      <p className="text-sm text-purple-100 line-clamp-2">{character.personality}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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