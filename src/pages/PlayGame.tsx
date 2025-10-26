import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const STORY_AI_URL = 'https://functions.poehali.dev/f9547351-df35-40b5-9a78-8d12690971c3';

interface HistoryEntry {
  user: string;
  ai: string;
}

export default function PlayGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const gameSettings = location.state?.gameSettings;
  const existingSave = location.state?.existingSave;

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentStory, setCurrentStory] = useState<string>('');
  const [userAction, setUserAction] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [gameId, setGameId] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameSettings) {
      navigate('/create-game');
      return;
    }
    
    if (existingSave) {
      setGameId(existingSave.id);
      setHistory(existingSave.history || []);
      setCurrentStory(existingSave.currentStory || '');
      setIsStarting(false);
    } else {
      const id = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setGameId(id);
      startGame();
    }
    
    const savedCharacters = localStorage.getItem('user-characters');
    if (savedCharacters) {
      try {
        const chars = JSON.parse(savedCharacters);
        setSelectedCharacter(chars[0] || null);
      } catch (e) {
        console.error('Failed to parse characters:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentStory]);

  const startGame = async () => {
    setIsLoading(true);
    setIsStarting(true);
    try {
      const response = await fetch(STORY_AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: gameSettings.genre || 'фэнтези',
          setting: gameSettings.setting || 'средневековье',
          difficulty: 'medium',
          userAction: '',
          history: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStory(data.story || 'История началась...');
        saveGame([], data.story || '');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Ошибка генерации',
          description: errorData.error || 'Не удалось начать игру',
          variant: 'destructive'
        });
        setCurrentStory('Не удалось начать игру. Попробуйте снова.');
      }
    } catch (error) {
      console.error('Failed to start game:', error);
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте подключение к интернету',
        variant: 'destructive'
      });
      setCurrentStory('Ошибка загрузки. Попробуйте снова.');
    } finally {
      setIsLoading(false);
      setIsStarting(false);
    }
  };

  const handleSendAction = async () => {
    if (!userAction.trim() || isLoading) return;

    const action = userAction.trim();
    setUserAction('');
    setIsLoading(true);

    const newHistory: HistoryEntry[] = [
      ...history,
      { user: action, ai: currentStory }
    ];

    try {
      const response = await fetch(STORY_AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: gameSettings.genre || 'фэнтези',
          setting: gameSettings.setting || 'средневековье',
          difficulty: 'medium',
          userAction: action,
          history: newHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(newHistory);
        setCurrentStory(data.story || 'История продолжается...');
        saveGame(newHistory, data.story || '');
        
        toast({
          title: '💾 Сохранено',
          description: `Эпизод ${newHistory.length} автоматически сохранён`,
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Ошибка генерации',
          description: errorData.error || 'Не удалось продолжить историю',
          variant: 'destructive'
        });
        setCurrentStory('Не удалось продолжить историю. Попробуйте ещё раз.');
      }
    } catch (error) {
      console.error('Failed to continue story:', error);
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте подключение к интернету',
        variant: 'destructive'
      });
      setCurrentStory('Ошибка. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGame = (historyData: HistoryEntry[], currentText: string) => {
    if (!gameId) return;

    const gameState = {
      id: gameId,
      settings: gameSettings,
      history: historyData,
      currentStory: currentText,
      episodeCount: historyData.length,
      savedAt: new Date().toISOString(),
      lastAction: historyData.length > 0 ? historyData[historyData.length - 1].user : 'Начало игры'
    };

    const savedGames = JSON.parse(localStorage.getItem('saved-games') || '[]');
    const existingIndex = savedGames.findIndex((g: any) => g.id === gameId);
    
    if (existingIndex >= 0) {
      savedGames[existingIndex] = gameState;
    } else {
      savedGames.push(gameState);
    }
    
    localStorage.setItem('saved-games', JSON.stringify(savedGames));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAction();
    }
  };

  const handlePoke = async () => {
    toast({
      title: '⚡ Пнул ИИ',
      description: 'ИИ генерирует продолжение...',
    });
    
    setIsLoading(true);
    try {
      const response = await fetch(STORY_AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: gameSettings.genre || 'фэнтези',
          setting: gameSettings.setting || 'средневековье',
          difficulty: 'medium',
          userAction: '[продолжи историю дальше]',
          history: history
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStory(data.story || currentStory);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось пнуть ИИ',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to poke AI:', error);
      toast({
        title: 'Ошибка',
        description: 'Проверьте подключение',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!gameSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-purple-300">Загрузка игры...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-80 bg-black/40 border-r border-purple-500/20 p-6 flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/create-game')}
          className="gap-2 justify-start text-purple-300 hover:text-purple-100"
        >
          <Icon name="ArrowLeft" size={16} />
          Саммари партии
        </Button>

        {selectedCharacter && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-14 h-14 border-2 border-yellow-500/50">
                <AvatarImage src={selectedCharacter.avatar} className="object-cover" />
                <AvatarFallback className="bg-purple-900/50 text-purple-100">
                  {selectedCharacter.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{selectedCharacter.name}</h3>
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-300 text-xs">
                  {selectedCharacter.role}
                </Badge>
              </div>
            </div>
            {selectedCharacter.personality && (
              <p className="text-sm text-purple-300/70 leading-relaxed">
                {selectedCharacter.personality}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/journal')}
            className="w-full justify-start gap-2 border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
          >
            <Icon name="BookOpen" size={18} />
            Журнал
          </Button>

          <Button
            variant="outline"
            onClick={handlePoke}
            disabled={isLoading}
            className="w-full justify-start gap-2 border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/10"
          >
            <Icon name="Zap" size={18} />
            Пнуть ИИ
          </Button>
        </div>

        <div className="space-y-3 pt-4 border-t border-purple-500/20">
          <h4 className="text-purple-300 text-sm font-medium">Агенты-наблюдатели</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-300/70">ИИ следит за сюжетом и временем</span>
            <div className="w-12 h-6 bg-yellow-500/20 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-300/70">Автоиллюстрации</span>
            <div className="w-12 h-6 bg-yellow-500/20 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-black/40 border-b border-purple-500/20 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-yellow-500" />
            <h1 className="text-xl font-bold text-white">Эпизод: {history.length + 1}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-purple-300"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-5">
                <div className="text-sm text-purple-300/70 mb-2">Ты:</div>
                <div className="text-white leading-relaxed">{entry.user}</div>
              </div>
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-5">
                <div className="text-sm text-amber-300/70 mb-2">
                  {gameSettings.role === 'hero' ? 'ИИ Мастер:' : 'ИИ:'}
                </div>
                <div className="text-amber-100 leading-relaxed whitespace-pre-wrap">{entry.ai}</div>
              </div>
            </div>
          ))}

          {currentStory && (
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-5">
              <div className="text-sm text-amber-300/70 mb-2">
                {isStarting ? 'Начало истории:' : (gameSettings.role === 'hero' ? 'ИИ Мастер:' : 'ИИ:')}
              </div>
              <div className="text-amber-100 leading-relaxed whitespace-pre-wrap">{currentStory}</div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-purple-300">
              <Icon name="Loader2" className="animate-spin" size={16} />
              {gameSettings.role === 'hero' ? 'Мастер думает...' : 'ИИ генерирует историю...'}
            </div>
          )}
        </div>

        <div className="bg-black/40 border-t border-purple-500/20 p-6">
          <Textarea
            placeholder="Напишите что вы будете делать... (Enter - отправить, Shift+Enter - новая строка)"
            value={userAction}
            onChange={(e) => setUserAction(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="min-h-[100px] mb-3 bg-black/30 border-purple-500/30 text-white resize-none"
          />
          <Button 
            onClick={handleSendAction}
            disabled={isLoading || !userAction.trim()}
            className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white gap-2 h-12 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="animate-spin" size={20} />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Send" size={20} />
                Отправить
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}