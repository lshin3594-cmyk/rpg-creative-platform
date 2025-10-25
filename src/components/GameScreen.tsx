import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { StoryJournalModal } from '@/components/story/StoryJournalModal';
import { CreateCharacterModal } from '@/components/story/CreateCharacterModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Character {
  name: string;
  role: string;
  description: string;
  avatar?: string;
  level?: number;
}

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  id: string;
  episode: number;
}

interface GameSettings {
  name: string;
  setting: string;
  role: 'author' | 'hero';
  narrativeMode: 'first' | 'third' | 'love-interest';
  playerCount: number;
}

interface GameScreenProps {
  gameId?: string;
}

const AI_STORY_URL = 'https://functions.poehali.dev/43b376d8-4248-4a7e-8065-56da54df84d7';

export const GameScreen = ({ gameId }: GameScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showCreateChar, setShowCreateChar] = useState(false);
  const [agentsEnabled, setAgentsEnabled] = useState(true);
  const turnCountRef = useRef(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Загружаем настройки игры
    const settingsJson = localStorage.getItem('current-game-settings');
    if (settingsJson) {
      setGameSettings(JSON.parse(settingsJson));
    }
  }, []);

  useEffect(() => {
    // Автостарт истории - ИИ делает первый ход
    if (gameSettings && messages.length === 0 && !isProcessing) {
      const startStory = async () => {
        setIsProcessing(true);
        try {
          const startAction = gameSettings.setting 
            ? `Начни историю в сеттинге: ${gameSettings.setting}`
            : 'Начни захватывающую историю';

          const response = await fetch(AI_STORY_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: startAction,
              settings: gameSettings,
              history: []
            })
          });

          if (!response.ok) throw new Error('AI request failed');

          const data = await response.json();
          
          const aiMessage: Message = {
            type: 'ai',
            content: data.text,
            timestamp: new Date(),
            id: Date.now().toString(),
            episode: data.episode || 1
          };

          setMessages([aiMessage]);
          setCurrentEpisode(data.episode || 1);

          if (data.characters && data.characters.length > 0) {
            setCharacters(data.characters);
          }
        } catch (error) {
          console.error('Auto-start error:', error);
          toast({
            title: 'Ошибка запуска',
            description: 'Не удалось начать историю. Попробуйте ввести первое действие.',
            variant: 'destructive'
          });
        } finally {
          setIsProcessing(false);
        }
      };

      startStory();
    }
  }, [gameSettings]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAgentPrompt = () => {
    turnCountRef.current += 1;
    const turns = turnCountRef.current;

    if (!agentsEnabled) return '';

    if (turns % 3 === 0) {
      return '\n\n[АГЕНТ-НАБЛЮДАТЕЛЬ: Не забывай про сюжетные линии и персонажей. Время идёт, что-то должно происходить!]';
    }
    
    if (turns % 5 === 0) {
      return '\n\n[АГЕНТ-ВРЕМЕНИ: Напомни про время суток, погоду, атмосферу. Мир должен жить!]';
    }

    if (turns % 7 === 0 && characters.length > 0) {
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      return `\n\n[АГЕНТ-ПЕРСОНАЖЕЙ: А что делает ${randomChar.name}? Покажи их действия и эмоции!]`;
    }

    return '';
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isProcessing || !gameSettings) return;

    const userMessage: Message = {
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
      id: Date.now().toString(),
      episode: currentEpisode
    };

    setMessages(prev => [...prev, userMessage]);
    const userAction = currentInput.trim();
    const agentPrompt = getAgentPrompt();
    
    setCurrentInput('');
    setIsProcessing(true);

    try {
      const response = await fetch(AI_STORY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: userAction + agentPrompt,
          settings: gameSettings,
          history: messages.map(m => ({ type: m.type, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      
      const aiMessage: Message = {
        type: 'ai',
        content: data.text,
        timestamp: new Date(),
        id: (Date.now() + 1).toString(),
        episode: data.episode || currentEpisode
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentEpisode(data.episode || currentEpisode);

      // Добавляем новых персонажей
      if (data.characters && data.characters.length > 0) {
        setCharacters(prev => {
          const existingNames = prev.map(c => c.name);
          const newChars = data.characters.filter(
            (c: Character) => !existingNames.includes(c.name)
          );
          return [...prev, ...newChars];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Ошибка ИИ',
        description: 'Не удалось получить ответ. Попробуйте ещё раз.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCharacterCreated = (character: Character) => {
    setCharacters(prev => [...prev, character]);
  };

  if (!gameSettings) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Левая панель - Персонажи */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b bg-background/95">
          <h3 className="font-bold flex items-center gap-2">
            <Icon name="Users" size={20} className="text-primary" />
            Персонажи
          </h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {characters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Icon name="UserPlus" size={32} className="mx-auto mb-2 opacity-50" />
                <p>Персонажи появятся</p>
                <p>по ходу истории</p>
              </div>
            ) : (
              characters.map((char, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      {char.avatar ? (
                        <img src={char.avatar} alt={char.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Icon name="User" size={24} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{char.name}</h4>
                      <p className="text-xs text-muted-foreground">{char.role}</p>
                      {char.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {char.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={() => setShowCreateChar(true)}
          >
            <Icon name="UserPlus" size={16} />
            Создать НПС
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={() => setShowJournal(true)}
          >
            <Icon name="BookMarked" size={16} />
            Журнал
          </Button>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="agents-toggle" className="text-xs cursor-pointer">
                Агенты-наблюдатели
              </Label>
              <Switch 
                id="agents-toggle"
                checked={agentsEnabled}
                onCheckedChange={setAgentsEnabled}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              ИИ следит за сюжетом и временем
            </p>
          </div>
        </div>
      </div>

      {/* Центральная панель - История */}
      <div className="flex-1 flex flex-col">
        {/* Шапка */}
        <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-background flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="BookOpen" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{gameSettings.name}</h2>
              <p className="text-sm text-muted-foreground">
                Эпизод {currentEpisode} • {gameSettings.role === 'author' ? 'Автор' : 'Герой'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Icon name="Save" size={18} />
              <span className="hidden md:inline">Сохранить</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Icon name="X" size={18} />
            </Button>
          </div>
        </div>

        {/* История */}
        <ScrollArea ref={scrollRef} className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Icon name="Sparkles" size={36} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Начните историю</h3>
                <p className="text-muted-foreground">
                  {gameSettings.setting || 'Опишите своё первое действие или ситуацию'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon name="Bot" size={20} className="text-primary" />
                    </div>
                  )}
                  <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                    <div
                      className={`rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={20} className="text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-4 justify-start">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="Bot" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 max-w-3xl mr-12">
                    <div className="rounded-lg p-4 bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Поле ввода */}
        <div className="border-t p-4 bg-background">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex gap-3">
              <Textarea
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={messages.length === 0 ? "Напишите что произойдёт дальше..." : "Ваше действие..."}
                className="min-h-[80px] max-h-[200px] resize-none"
                disabled={isProcessing}
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isProcessing}
                  className="px-6"
                >
                  {isProcessing ? (
                    <Icon name="Loader2" size={20} className="animate-spin" />
                  ) : (
                    <Icon name="Send" size={20} />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowResources(!showResources)}
                  className="px-6"
                >
                  <Icon name="Package" size={20} />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Enter — отправить • Shift+Enter — новая строка
            </p>
          </div>
        </div>
      </div>

      {/* Правая панель - Таймлайн эпизодов */}
      <div className="w-20 border-l bg-muted/20 flex flex-col items-center py-4 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground rotate-0 writing-mode-vertical">
          ЭПИЗОДЫ
        </div>
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center space-y-2 px-2">
            {Array.from({ length: currentEpisode }, (_, i) => i + 1).map((ep) => (
              <button
                key={ep}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  ep === currentEpisode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {ep}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <StoryJournalModal 
        open={showJournal}
        onOpenChange={setShowJournal}
        messages={messages}
        currentEpisode={currentEpisode}
      />

      <CreateCharacterModal
        open={showCreateChar}
        onOpenChange={setShowCreateChar}
        onCharacterCreated={handleCharacterCreated}
        gameSettings={gameSettings}
      />
    </div>
  );
};