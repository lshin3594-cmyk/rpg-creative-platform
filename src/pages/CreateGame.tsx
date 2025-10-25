import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const CreateGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameName, setGameName] = useState('');
  const [setting, setSetting] = useState('');
  const [role, setRole] = useState<'author' | 'hero' | null>(null);
  const [narrativeMode, setNarrativeMode] = useState<'first' | 'third' | 'love-interest' | null>(null);
  const [playerCount, setPlayerCount] = useState(2);

  const generateRandomName = () => {
    const names = [
      'Тени прошлого',
      'Забытый город',
      'Охота на дракона',
      'Тайны старого особняка',
      'Космическая одиссея',
      'Проклятие некроманта',
      'Путь самурая',
      'Кибер-панк 2084',
      'Пираты Карибского моря',
      'Ведьмак из Ривии'
    ];
    setGameName(names[Math.floor(Math.random() * names.length)]);
  };

  const handleStart = () => {
    if (!gameName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название игры',
        variant: 'destructive'
      });
      return;
    }

    if (!role) {
      toast({
        title: 'Ошибка',
        description: 'Выберите свою роль',
        variant: 'destructive'
      });
      return;
    }

    if (!narrativeMode) {
      toast({
        title: 'Ошибка',
        description: 'Выберите вид повествования',
        variant: 'destructive'
      });
      return;
    }

    // Сохраняем настройки игры
    const gameSettings = {
      name: gameName,
      setting,
      role,
      narrativeMode,
      playerCount,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('current-game-settings', JSON.stringify(gameSettings));
    
    // Переходим в игру
    navigate('/story/new');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">СОЗДАНИЕ ИГРЫ</h1>
          <p className="text-muted-foreground">Нейросеть адаптируется к вашим действиям и создаёт уникальные сюжеты, героев, окружение и диалоги</p>
        </div>

        {/* Название игры */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Название игры</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateRandomName}
              className="gap-2 text-primary"
            >
              <Icon name="Sparkles" size={16} />
              Случайно
            </Button>
          </div>
          <Input
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Введите название игры"
            className="text-lg"
          />
        </Card>

        {/* Описание сеттинга */}
        <Card className="p-6 space-y-3">
          <label className="text-sm font-medium">Опишите сеттинг приключения</label>
          <Textarea
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            placeholder="Опишите мир, атмосферу, начальную ситуацию... Без ограничений по символам!"
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{setting.length} символов</span>
            {setting.length === 0 && (
              <span className="text-xs text-muted-foreground">
                💡 Чем подробнее опишешь - тем лучше ИИ поймёт твою задумку
              </span>
            )}
          </div>
        </Card>

        {/* Выбор роли */}
        <Card className="p-6 space-y-4">
          <label className="text-sm font-medium">Выберите свою роль:</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRole('author')}
              className={`relative p-8 rounded-lg border-2 transition-all hover:scale-105 ${
                role === 'author'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-center space-y-2">
                <Icon name="Pen" size={48} className="mx-auto" />
                <h3 className="text-2xl font-bold">АВТОР</h3>
                <p className="text-sm text-muted-foreground">
                  Веди историю, управляй миром и НПС
                </p>
              </div>
              {role === 'author' && (
                <div className="absolute top-2 right-2">
                  <Icon name="Check" size={24} className="text-primary" />
                </div>
              )}
            </button>

            <button
              onClick={() => setRole('hero')}
              className={`relative p-8 rounded-lg border-2 transition-all hover:scale-105 ${
                role === 'hero'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-center space-y-2">
                <Icon name="Sword" size={48} className="mx-auto" />
                <h3 className="text-2xl font-bold">ГЕРОЙ</h3>
                <p className="text-sm text-muted-foreground">
                  Играй за персонажа в истории
                </p>
              </div>
              {role === 'hero' && (
                <div className="absolute top-2 right-2">
                  <Icon name="Check" size={24} className="text-primary" />
                </div>
              )}
            </button>
          </div>
        </Card>

        {/* Вид повествования */}
        <Card className="p-6 space-y-4">
          <label className="text-sm font-medium">Вид повествования:</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setNarrativeMode('first')}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                narrativeMode === 'first'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-center space-y-1">
                <Icon name="User" size={32} className="mx-auto" />
                <h4 className="font-semibold">От первого лица</h4>
                <p className="text-xs text-muted-foreground">Я вижу, я делаю</p>
              </div>
            </button>

            <button
              onClick={() => setNarrativeMode('third')}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                narrativeMode === 'third'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-center space-y-1">
                <Icon name="Users" size={32} className="mx-auto" />
                <h4 className="font-semibold">От третьего лица</h4>
                <p className="text-xs text-muted-foreground">Он/она видит, делает</p>
              </div>
            </button>

            <button
              onClick={() => setNarrativeMode('love-interest')}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                narrativeMode === 'love-interest'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-center space-y-1">
                <Icon name="Heart" size={32} className="mx-auto" />
                <h4 className="font-semibold">С интересом</h4>
                <p className="text-xs text-muted-foreground">Важные моменты от любовного интереса</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Количество игроков */}
        <Card className="p-6 space-y-4">
          <label className="text-sm font-medium">
            Количество игроков: {playerCount} {playerCount === 1 ? '(соло)' : `(с учётом автора)`}
          </label>
          <div className="px-2">
            <Slider
              value={[playerCount]}
              onValueChange={(value) => setPlayerCount(value[0])}
              min={1}
              max={6}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
          </div>
        </Card>

        {/* Кнопка старта */}
        <Card className="p-6 bg-gradient-to-r from-primary/20 to-primary/10 border-primary/50">
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full h-16 text-xl gap-3 shadow-lg hover:shadow-xl transition-all"
          >
            <Icon name="Swords" size={24} />
            НАЧАТЬ ПРИКЛЮЧЕНИЕ
          </Button>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;