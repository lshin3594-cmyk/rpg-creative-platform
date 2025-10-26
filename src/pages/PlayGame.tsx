import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const STORY_AI_URL = 'https://functions.poehali.dev/9ea67dc2-c306-4906-bf0f-da435600b92c';

interface HistoryEntry {
  user: string;
  ai: string;
}

export default function PlayGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameSettings = location.state?.gameSettings;

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentStory, setCurrentStory] = useState<string>('');
  const [userAction, setUserAction] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameSettings) {
      navigate('/create-game');
      return;
    }
    startGame();
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
          game_settings: gameSettings,
          user_action: '',
          history: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStory(data.story);
      }
    } catch (error) {
      console.error('Failed to start game:', error);
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
          game_settings: gameSettings,
          user_action: action,
          history: newHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(newHistory);
        setCurrentStory(data.story);
      }
    } catch (error) {
      console.error('Failed to continue story:', error);
      setCurrentStory('Ошибка. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAction();
    }
  };

  if (!gameSettings) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/create-game')}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </Button>
          <div className="text-sm text-muted-foreground">
            {gameSettings.genre} • {gameSettings.rating}
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-4 min-h-[500px] max-h-[600px] overflow-y-auto space-y-6"
        >
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4 ml-12">
                <div className="text-sm text-primary/60 mb-1">Ты:</div>
                <div className="text-foreground">{entry.user}</div>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 mr-12">
                <div className="text-sm text-primary/60 mb-1">Мастер:</div>
                <div className="text-foreground whitespace-pre-wrap">{entry.ai}</div>
              </div>
            </div>
          ))}

          {currentStory && (
            <div className="bg-secondary/30 rounded-lg p-4 mr-12">
              <div className="text-sm text-primary/60 mb-1">
                {isStarting ? 'Начало истории:' : 'Мастер:'}
              </div>
              <div className="text-foreground whitespace-pre-wrap">{currentStory}</div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Loader2" className="animate-spin" size={16} />
              Мастер думает...
            </div>
          )}
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
          <Textarea
            placeholder="Опиши своё действие... (Enter - отправить, Shift+Enter - новая строка)"
            value={userAction}
            onChange={(e) => setUserAction(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="min-h-[100px] mb-3"
          />
          <Button 
            onClick={handleSendAction}
            disabled={isLoading || !userAction.trim()}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="animate-spin" size={16} />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Send" size={16} />
                Действовать
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
