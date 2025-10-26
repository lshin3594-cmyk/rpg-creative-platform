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

type LoadingStage = 'idle' | 'world' | 'story' | 'done';

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
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('idle');
  const [stageErrors, setStageErrors] = useState<{world?: string, story?: string}>({});
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
      setLoadingStage('done');
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
    setStageErrors({});
    
    try {
      setLoadingStage('world');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingStage('story');
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Story API error:', response.status, errorText);
        setStageErrors(prev => ({ ...prev, story: `HTTP ${response.status}: ${errorText.slice(0, 100)}` }));
        throw new Error(`Story API failed (${response.status})`);
      }
      
      const data = await response.json();
      setLoadingStage('done');
      setCurrentStory(data.story || 'История началась...');
      saveGame([], data.story || '');
    } catch (error: any) {
      console.error('Failed to start game:', error);
      const errorMsg = error.message || 'Неизвестная ошибка';
      
      if (loadingStage === 'story') {
        setStageErrors(prev => ({ ...prev, story: errorMsg }));
      } else if (loadingStage === 'world') {
        setStageErrors(prev => ({ ...prev, world: errorMsg }));
      }
      
      toast({
        title: 'Ошибка запуска игры',
        description: errorMsg,
        variant: 'destructive'
      });
      setCurrentStory('Не удалось начать игру. Проверьте логи выше.');
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
      }
    } catch (error) {
      console.error('Poke failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStageIcon = (stage: LoadingStage) => {
    if (loadingStage === stage) return <Icon name="Loader2" className="animate-spin text-purple-400" size={18} />;
    if (stageErrors[stage as 'world' | 'story']) return <Icon name="CircleX" className="text-red-400" size={18} />;
    
    const stages: LoadingStage[] = ['world', 'story', 'done'];
    const currentIdx = stages.indexOf(loadingStage);
    const stageIdx = stages.indexOf(stage);
    
    if (stageIdx < currentIdx || loadingStage === 'done') {
      return <Icon name="CircleCheck" className="text-green-400" size={18} />;
    }
    return <Icon name="Circle" className="text-purple-700" size={18} />;
  };

  const getStageText = (stage: LoadingStage) => {
    const texts = {
      world: 'Создаю мир и атмосферу',
      story: 'Генерирую начальную историю',
      done: 'Готово!'
    };
    return texts[stage] || '';
  };

  if (!gameSettings) return null;

  if (isStarting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-purple-100">{gameSettings.name}</h2>
            <p className="text-purple-300/70 text-sm">Запускаю игру...</p>
          </div>
          
          <div className="space-y-4">
            {(['world', 'story'] as const).map(stage => (
              <div key={stage} className="flex items-center gap-3">
                {getStageIcon(stage)}
                <div className="flex-1">
                  <p className={`text-sm ${loadingStage === stage ? 'text-purple-200' : 'text-purple-400/60'}`}>
                    {getStageText(stage)}
                  </p>
                  {stageErrors[stage] && (
                    <p className="text-xs text-red-400 mt-1">{stageErrors[stage]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {(stageErrors.world || stageErrors.story) && (
            <Button 
              onClick={() => navigate('/create-game')} 
              variant="outline" 
              className="w-full"
            >
              <Icon name="ArrowLeft" size={16} />
              Вернуться назад
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-purple-900/30 backdrop-blur-sm border-b border-purple-500/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2 text-purple-300 hover:text-purple-100"
            >
              <Icon name="Home" size={16} />
              Главная
            </Button>
            <div>
              <h1 className="text-xl font-bold text-purple-100">{gameSettings.name}</h1>
              <p className="text-xs text-purple-300/60">Эпизод {history.length + 1}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedCharacter && (
              <div className="flex items-center gap-2 bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-500/30">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={selectedCharacter.avatar} />
                  <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-purple-200">{selectedCharacter.name}</span>
              </div>
            )}
            <Badge variant="outline" className="text-purple-300 border-purple-500/30">
              {gameSettings.genre}
            </Badge>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-3">
              <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-100 whitespace-pre-wrap">{entry.ai}</p>
              </div>
              <div className="bg-pink-900/20 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4 ml-8">
                <p className="text-sm text-pink-200 mb-1 font-semibold">Ваше действие:</p>
                <p className="text-pink-100 whitespace-pre-wrap">{entry.user}</p>
              </div>
            </div>
          ))}
          
          {currentStory && (
            <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
              <p className="text-purple-100 whitespace-pre-wrap">{currentStory}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-purple-900/30 backdrop-blur-sm border-t border-purple-500/30 p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <Textarea
            value={userAction}
            onChange={(e) => setUserAction(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Опишите ваше действие..."
            disabled={isLoading}
            className="min-h-[100px] bg-purple-950/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/50"
          />
          <div className="flex gap-3">
            <Button
              onClick={handleSendAction}
              disabled={isLoading || !userAction.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="animate-spin" size={18} />
                  ИИ думает...
                </>
              ) : (
                <>
                  <Icon name="Send" size={18} />
                  Отправить
                </>
              )}
            </Button>
            <Button
              onClick={handlePoke}
              disabled={isLoading}
              variant="outline"
              className="border-purple-500/30 text-purple-300"
            >
              <Icon name="Zap" size={18} />
              Пнуть ИИ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
