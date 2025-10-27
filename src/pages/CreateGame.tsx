import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { GameNameInput } from '@/components/create-game/GameNameInput';
import { SettingInput } from '@/components/create-game/SettingInput';
import { RoleSelector } from '@/components/create-game/RoleSelector';
import { NarrativeSelector } from '@/components/create-game/NarrativeSelector';
import { GameSettings } from '@/components/create-game/GameSettings';
import { CharacterSelector } from '@/components/create-game/CharacterSelector';

const GAME_ENTITIES_URL = 'https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696';

const CreateGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameName, setGameName] = useState('');
  const [setting, setSetting] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [role, setRole] = useState<'hero' | 'author'>('hero');
  const [narrativeMode, setNarrativeMode] = useState<'first' | 'third' | 'love-interest'>('third');
  const [genres, setGenres] = useState<string[]>(['Фэнтези']);
  const [rating, setRating] = useState('18+');
  const [aiModel] = useState<'deepseek'>('deepseek');

  const [availableCharacters, setAvailableCharacters] = useState<any[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<number[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [showCharactersList, setShowCharactersList] = useState(false);

  useEffect(() => {
    const loadCharacters = () => {
      setLoadingCharacters(true);
      try {
        const savedCharacters = localStorage.getItem('user-characters');
        if (savedCharacters) {
          const chars = JSON.parse(savedCharacters);
          setAvailableCharacters(chars);
        }
      } catch (error) {
      } finally {
        setLoadingCharacters(false);
      }
    };
    loadCharacters();
  }, []);

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

    if (genres.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Выберите хотя бы один жанр',
        variant: 'destructive'
      });
      return;
    }

    const selectedChars = availableCharacters.filter(c => selectedCharacterIds.includes(c.id));
    
    const gameSettings = {
      name: gameName,
      setting,
      aiInstructions,
      role,
      narrativeMode,
      playerCount: 1,
      genre: genres.join(', '),
      rating,
      aiModel,
      initialCharacters: selectedChars.map(c => ({
        name: c.name,
        role: c.role,
        description: c.personality || c.backstory || '',
        scenes: c.scenes || '',
        quotes: c.quotes || '',
        ideas: c.ideas || ''
      })),
      createdAt: new Date().toISOString()
    };

    // Сохраняем настройки в localStorage перед переходом
    localStorage.setItem('current-game-settings', JSON.stringify(gameSettings));
    localStorage.removeItem('current-game-progress'); // Очищаем прогресс старой игры

    navigate('/play-game', { state: { gameSettings } });
  };

  const toggleCharacter = (id: number) => {
    if (selectedCharacterIds.includes(id)) {
      setSelectedCharacterIds(selectedCharacterIds.filter(cid => cid !== id));
    } else {
      setSelectedCharacterIds([...selectedCharacterIds, id]);
    }
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
          <GameNameInput 
            gameName={gameName}
            setGameName={setGameName}
            onGenerateRandom={generateRandomName}
          />

          <SettingInput 
            setting={setting}
            setSetting={setSetting}
          />

          <RoleSelector 
            role={role}
            setRole={setRole}
          />

          <NarrativeSelector 
            narrativeMode={narrativeMode}
            setNarrativeMode={setNarrativeMode}
          />

          <GameSettings 
            genres={genres}
            setGenres={setGenres}
            rating={rating}
            setRating={setRating}
          />

          <CharacterSelector 
            availableCharacters={availableCharacters}
            selectedCharacterIds={selectedCharacterIds}
            loadingCharacters={loadingCharacters}
            showCharactersList={showCharactersList}
            setShowCharactersList={setShowCharactersList}
            toggleCharacter={toggleCharacter}
          />

          <Button
            onClick={handleStart}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none text-lg py-6"
          >
            <Icon name="Rocket" size={24} />
            Начать игру
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;