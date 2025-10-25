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
  const [role, setRole] = useState<'hero' | 'author'>('hero');
  const [narrativeMode, setNarrativeMode] = useState<'first' | 'third' | 'love-interest'>('third');
  const [genre, setGenre] = useState('Фэнтези');
  const [rating, setRating] = useState('18+');
  const [characters, setCharacters] = useState<Array<{name: string; role: string; description: string}>>([]);

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
      role,
      narrativeMode,
      playerCount: 1,
      genre,
      rating,
      initialCharacters: characters,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('current-game-settings', JSON.stringify(gameSettings));
    navigate('/story/new');
  };

  const addCharacter = () => {
    setCharacters([...characters, { name: '', role: '', description: '' }]);
  };

  const updateCharacter = (index: number, field: 'name' | 'role' | 'description', value: string) => {
    const updated = [...characters];
    updated[index][field] = value;
    setCharacters(updated);
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen p-4 py-12 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-purple-300 rounded-full animate-twinkle"></div>
        <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-pink-200 rounded-full animate-twinkle-slow" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[50%] left-[20%] w-1 h-1 bg-purple-400 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[35%] right-[25%] w-2 h-2 bg-pink-300 rounded-full animate-twinkle-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[20%] left-[35%] w-1.5 h-1.5 bg-purple-200 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[70%] right-[40%] w-1 h-1 bg-pink-400 rounded-full animate-twinkle-slow" style={{ animationDelay: '2.5s' }}></div>
      </div>
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 gap-2 text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 z-10"
      >
        <Icon name="Home" size={18} />
        На главную
      </Button>

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
            <Label className="text-purple-100 text-base mb-4 block">
              Ваша роль в игре
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole('hero')}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    role === 'hero'
                      ? 'border-purple-400 bg-purple-500/30'
                      : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="User" size={20} className="text-purple-300" />
                  <span className="font-bold text-purple-100">Герой</span>
                </div>
                <p className="text-xs text-purple-200/70">
                  Вы управляете главным персонажем, ИИ ведёт сюжет и NPC
                </p>
              </button>
              <button
                onClick={() => setRole('author')}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    role === 'author'
                      ? 'border-purple-400 bg-purple-500/30'
                      : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="BookOpen" size={20} className="text-purple-300" />
                  <span className="font-bold text-purple-100">Автор</span>
                </div>
                <p className="text-xs text-purple-200/70">
                  Вы управляете сюжетом и всеми персонажами
                </p>
              </button>
            </div>
          </div>

          <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <Label className="text-purple-100 text-base mb-4 block">
              Режим повествования
            </Label>
            <div className="space-y-3">
              <button
                onClick={() => setNarrativeMode('first')}
                className={`
                  w-full p-4 rounded-lg border-2 transition-all text-left
                  ${
                    narrativeMode === 'first'
                      ? 'border-purple-400 bg-purple-500/30'
                      : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Eye" size={18} className="text-purple-300" />
                  <span className="font-bold text-purple-100">От первого лица</span>
                </div>
                <p className="text-xs text-purple-200/70 mb-2">
                  Полное погружение в персонажа
                </p>
                {narrativeMode === 'first' && (
                  <div className="mt-3 p-3 bg-black/40 rounded border border-purple-400/30">
                    <p className="text-xs text-purple-100/90 italic leading-relaxed">
                      "Я медленно открываю дверь. Петли скрипят. Холодный воздух обжигает лицо. 
                      В темноте что-то шевелится..."
                    </p>
                  </div>
                )}
              </button>
              <button
                onClick={() => setNarrativeMode('third')}
                className={`
                  w-full p-4 rounded-lg border-2 transition-all text-left
                  ${
                    narrativeMode === 'third'
                      ? 'border-purple-400 bg-purple-500/30'
                      : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Users" size={18} className="text-purple-300" />
                  <span className="font-bold text-purple-100">От третьего лица</span>
                </div>
                <p className="text-xs text-purple-200/70 mb-2">
                  Классическое повествование
                </p>
                {narrativeMode === 'third' && (
                  <div className="mt-3 p-3 bg-black/40 rounded border border-purple-400/30">
                    <p className="text-xs text-purple-100/90 italic leading-relaxed">
                      "Она медленно открывает дверь. Петли скрипят. Холодный воздух обжигает её лицо. 
                      В темноте что-то шевелится..."
                    </p>
                  </div>
                )}
              </button>
              <button
                onClick={() => setNarrativeMode('love-interest')}
                className={`
                  w-full p-4 rounded-lg border-2 transition-all text-left
                  ${
                    narrativeMode === 'love-interest'
                      ? 'border-pink-400 bg-pink-500/30'
                      : 'border-purple-500/30 bg-black/20 hover:border-pink-400/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Heart" size={18} className="text-pink-300" />
                  <span className="font-bold text-purple-100">Романтический фокус</span>
                </div>
                <p className="text-xs text-purple-200/70 mb-2">
                  Переключение между персонажами с упором на романтику
                </p>
                {narrativeMode === 'love-interest' && (
                  <div className="mt-3 p-3 bg-black/40 rounded border border-pink-400/30">
                    <p className="text-xs text-purple-100/90 italic leading-relaxed mb-2">
                      "Она медленно открывает дверь. Холодный воздух обжигает лицо."
                    </p>
                    <p className="text-xs text-pink-200/90 italic leading-relaxed">
                      💭 *Он смотрит на неё. Сердце бьётся чаще. "Какая же она смелая...", — думает он, 
                      не в силах отвести взгляд.*
                    </p>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <Label className="text-purple-100 text-base mb-4 block">
              Жанр и рейтинг
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genre" className="text-purple-200/80 text-sm mb-2 block">
                  Жанр
                </Label>
                <select
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black/30 border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Фэнтези">Фэнтези</option>
                  <option value="Киберпанк">Киберпанк</option>
                  <option value="Ужасы">Ужасы</option>
                  <option value="Романтика">Романтика</option>
                  <option value="Детектив">Детектив</option>
                  <option value="Научная фантастика">Научная фантастика</option>
                  <option value="Постапокалипсис">Постапокалипсис</option>
                  <option value="Историческое">Историческое</option>
                  <option value="Драма">Драма</option>
                  <option value="Приключения">Приключения</option>
                </select>
              </div>
              <div>
                <Label htmlFor="rating" className="text-purple-200/80 text-sm mb-2 block">
                  Рейтинг
                </Label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black/30 border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="6+">6+ (Для детей)</option>
                  <option value="12+">12+ (Подростки)</option>
                  <option value="16+">16+ (Взрослые темы)</option>
                  <option value="18+">18+ (Без цензуры)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-purple-100 text-base">
                Персонажи (необязательно)
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addCharacter}
                className="gap-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
              >
                <Icon name="UserPlus" size={16} />
                Добавить
              </Button>
            </div>

            {characters.length === 0 ? (
              <div className="text-center py-8 text-purple-300/60 text-sm">
                <Icon name="Users" size={40} className="mx-auto mb-2 opacity-40" />
                <p>Персонажи появятся по ходу истории</p>
                <p className="text-xs mt-1">Или создайте их заранее</p>
              </div>
            ) : (
              <div className="space-y-3">
                {characters.map((char, idx) => (
                  <div key={idx} className="p-4 bg-black/40 border border-purple-500/30 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <Input
                          value={char.name}
                          onChange={(e) => updateCharacter(idx, 'name', e.target.value)}
                          placeholder="Имя персонажа"
                          className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
                        />
                        <Input
                          value={char.role}
                          onChange={(e) => updateCharacter(idx, 'role', e.target.value)}
                          placeholder="Роль (воин, маг, торговец...)"
                          className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
                        />
                        <Textarea
                          value={char.description}
                          onChange={(e) => updateCharacter(idx, 'description', e.target.value)}
                          placeholder="Внешность и характер..."
                          className="min-h-[60px] resize-none bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
                        />
                      </div>
                      <button
                        onClick={() => removeCharacter(idx)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Icon name="X" size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            Начать игру
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;