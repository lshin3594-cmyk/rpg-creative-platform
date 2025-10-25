import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const CreateGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameName, setGameName] = useState('');
  const [setting, setSetting] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');

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

    if (!setting.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Опишите сеттинг игры',
        variant: 'destructive'
      });
      return;
    }

    const gameSettings = {
      name: gameName,
      setting,
      aiInstructions,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('current-game-settings', JSON.stringify(gameSettings));
    navigate('/story/new');
  };

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-purple-100 uppercase">
            Создание игры
          </h1>
          <p className="text-purple-200/70 max-w-2xl mx-auto">
            ИИ адаптируется к вашим действиям и создаёт уникальные сюжеты, героев, окружение и диалоги
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="gameName" className="text-purple-100 text-base">
                Введите название игры
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRandomName}
                className="gap-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
              >
                <Icon name="Sparkles" size={16} />
                Случайно
              </Button>
            </div>
            <Input
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Введите название игры"
              className="text-lg bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
            />
          </div>

          <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <Label htmlFor="setting" className="text-purple-100 text-base mb-4 block">
              Опишите сеттинг игры
            </Label>
            <Textarea
              id="setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="Опишите мир, атмосферу, начальную ситуацию... Без ограничений!"
              className="min-h-[200px] resize-none bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
            />
            <div className="mt-3 flex justify-between items-center text-sm">
              <span className="text-purple-300/70">{setting.length} символов</span>
              {setting.length === 0 && (
                <span className="text-purple-300/70">
                  💡 Чем подробнее опишешь - тем лучше ИИ поймёт
                </span>
              )}
            </div>
          </div>

          <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <Label htmlFor="aiInstructions" className="text-purple-100 text-base mb-4 block">
              Рекомендации ИИ по сюжету и ведению
            </Label>
            <Textarea
              id="aiInstructions"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              placeholder="Напишите рекомендации ИИ: стиль повествования, важные детали, что должно произойти..."
              className="min-h-[150px] resize-none bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
            />
            <div className="mt-3 flex justify-between items-center text-sm">
              <span className="text-purple-300/70">{aiInstructions.length} символов</span>
              {aiInstructions.length === 0 && (
                <span className="text-purple-300/70">
                  ✨ Необязательно, но помогает ИИ лучше понять задумку
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1 gap-2 border-purple-500/40 hover:bg-purple-500/20 text-purple-200"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </Button>
          <Button
            onClick={handleStart}
            className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none text-lg py-6"
          >
            <Icon name="Rocket" size={20} />
            Начать приключение
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;