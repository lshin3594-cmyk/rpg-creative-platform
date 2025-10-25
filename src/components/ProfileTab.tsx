import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActionsSettings } from './settings/ActionsSettings';

interface ProfileStats {
  charactersCreated: number;
  worldsCreated: number;
  storiesGenerated: number;
  totalWords: number;
}

interface Action {
  id: string;
  icon: string;
  text: string;
  description: string;
}

interface ProfileTabProps {
  stats: ProfileStats;
  onPlaySound?: () => void;
  actions?: Action[];
  onActionsChange?: (actions: Action[]) => void;
}

export const ProfileTab = ({ stats, onPlaySound, actions = [], onActionsChange }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Мастер Историй',
    bio: 'Создатель миров и персонажей',
    avatar: 'https://cdn.poehali.dev/files/11a64f46-796a-4ce6-9051-28d80e0c7bdd.jpg'
  });

  const defaultActions: Action[] = [
    { id: '1', icon: 'Swords', text: 'Атаковать', description: 'Я атакую' },
    { id: '2', icon: 'Shield', text: 'Защититься', description: 'Я принимаю оборонительную позицию' },
    { id: '3', icon: 'MessageCircle', text: 'Поговорить', description: 'Я начинаю диалог' },
    { id: '4', icon: 'Eye', text: 'Осмотреться', description: 'Я внимательно осматриваюсь' },
    { id: '5', icon: 'Search', text: 'Исследовать', description: 'Я исследую окружение' },
    { id: '6', icon: 'Footprints', text: 'Отступить', description: 'Я осторожно отступаю' },
    { id: '7', icon: 'EyeOff', text: 'Спрятаться', description: 'Я прячусь' },
    { id: '8', icon: 'Zap', text: 'Бежать', description: 'Я бегу' },
    { id: '9', icon: 'Heart', text: 'Помочь', description: 'Я предлагаю помощь' },
    { id: '10', icon: 'Brain', text: 'Подумать', description: 'Я обдумываю ситуацию' },
    { id: '11', icon: 'Package', text: 'Использовать предмет', description: 'Я использую предмет' },
    { id: '12', icon: 'Wand2', text: 'Сотворить заклинание', description: 'Я творю заклинание' }
  ];

  const currentActions = actions.length > 0 ? actions : defaultActions;

  const handleSave = () => {
    setIsEditing(false);
    onPlaySound?.();
  };

  return (
    <Tabs defaultValue="profile" className="animate-fade-in max-w-6xl mx-auto">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="profile">Профиль</TabsTrigger>
        <TabsTrigger value="settings">Настройки</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="Users" size={16} />
              Персонажи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.charactersCreated}</div>
            <p className="text-xs text-muted-foreground mt-1">создано</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="Globe" size={16} />
              Миры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.worldsCreated}</div>
            <p className="text-xs text-muted-foreground mt-1">создано</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="BookOpen" size={16} />
              Истории
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.storiesGenerated}</div>
            <p className="text-xs text-muted-foreground mt-1">создано</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20 backdrop-blur-sm bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-serif">Профиль</CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              <Icon name={isEditing ? "Check" : "Pencil"} size={16} className="mr-2" />
              {isEditing ? 'Сохранить' : 'Редактировать'}
            </Button>
          </div>
          <CardDescription>
            Управляй своим творческим профилем
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary/30">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-2xl bg-primary/10">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="flex-1">
                <Label htmlFor="avatar">URL аватара</Label>
                <Input
                  id="avatar"
                  value={profile.avatar}
                  onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Ваше имя"
                />
              ) : (
                <p className="text-lg font-medium">{profile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">О себе</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Расскажите о себе..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-muted-foreground">{profile.bio}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Icon name="Award" size={16} />
              Достижения
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.charactersCreated >= 1 && (
                <Badge variant="secondary" className="gap-1">
                  <Icon name="Users" size={12} />
                  Первый персонаж
                </Badge>
              )}
              {stats.worldsCreated >= 1 && (
                <Badge variant="secondary" className="gap-1">
                  <Icon name="Globe" size={12} />
                  Первый мир
                </Badge>
              )}
              {stats.storiesGenerated >= 1 && (
                <Badge variant="secondary" className="gap-1">
                  <Icon name="BookOpen" size={12} />
                  Первая история
                </Badge>
              )}
              {stats.storiesGenerated >= 10 && (
                <Badge variant="secondary" className="gap-1">
                  <Icon name="Sparkles" size={12} />
                  Опытный рассказчик
                </Badge>
              )}
              {stats.charactersCreated >= 5 && (
                <Badge variant="secondary" className="gap-1">
                  <Icon name="Crown" size={12} />
                  Создатель персонажей
                </Badge>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Звуковые эффекты</p>
                  <p className="text-sm text-muted-foreground">Воспроизводить звуки при действиях</p>
                </div>
                <Button variant="outline" size="sm">
                  Включено
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Тема оформления</p>
                  <p className="text-sm text-muted-foreground">Тёмная тема</p>
                </div>
                <Button variant="outline" size="sm">
                  <Icon name="Moon" size={16} className="mr-2" />
                  Тёмная
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="settings">
        {onActionsChange && (
          <ActionsSettings
            actions={currentActions}
            onChange={onActionsChange}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};