import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useRef, useEffect } from 'react';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string;
}

interface Plot {
  id: string;
  name: string;
  description: string;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  genres: string[];
}

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface StoryGeneratorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storyPrompt: string;
  setStoryPrompt: (prompt: string) => void;
  selectedCharacter: string;
  setSelectedCharacter: (id: string) => void;
  selectedWorld: string;
  setSelectedWorld: (id: string) => void;
  isGenerating: boolean;
  generatedStory: string;
  onGenerate: () => void;
  onStartStory?: () => void;
  characters: Character[];
  worlds: World[];
  plots: Plot[];
  episodeLength?: number;
  setEpisodeLength?: (value: number) => void;
  imagesPerEpisode?: number;
  setImagesPerEpisode?: (value: number) => void;
  playerInstructions?: string;
  setPlayerInstructions?: (value: string) => void;
  autoGenerateNPCs?: boolean;
  setAutoGenerateNPCs?: (value: boolean) => void;
  npcCount?: number;
  setNpcCount?: (value: number) => void;
  npcTypes?: string[];
  setNpcTypes?: (value: string[]) => void;
  selectedPlot?: string;
  setSelectedPlot?: (id: string) => void;
  narrativeMode?: string;
  setNarrativeMode?: (mode: string) => void;
  playerCharacterId?: string;
  setPlayerCharacterId?: (id: string) => void;
  selectedNarrativeCharacters?: string[];
  setSelectedNarrativeCharacters?: (ids: string[]) => void;
  onContinue?: (action: string) => Promise<string>;
}

export const StoryGenerator = ({
  isOpen,
  onOpenChange,
  storyPrompt,
  setStoryPrompt,
  onGenerate,
  onContinue
}: StoryGeneratorProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([]);
      setCurrentInput('');
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const userMessage: Message = {
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = currentInput.trim();
    setCurrentInput('');
    setIsProcessing(true);

    try {
      if (messages.length === 0) {
        setStoryPrompt(userInput);
        await onGenerate();
      }

      if (onContinue) {
        const aiResponse = await onContinue(userInput);
        const aiMessage: Message = {
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-3 text-lg py-7 px-10 bg-primary hover:bg-primary/90 shadow-2xl hover:scale-105 transition-all">
            <Icon name="Sparkles" size={28} className="animate-pulse" />
            Начать приключение
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="Bot" size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Интерактивная история</h2>
                  <p className="text-sm text-muted-foreground">Опиши идею — начнём игру</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="MessageSquare" size={32} className="text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Начни свою историю</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Опиши героя, сеттинг и ситуацию — ИИ мгновенно продолжит историю
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-4">
                      <button
                        onClick={() => setCurrentInput('Я — детектив в киберпанк-городе. Только что нашёл странный чип...')}
                        className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                      >
                        🕵️ Детектив
                      </button>
                      <button
                        onClick={() => setCurrentInput('Я просыпаюсь в средневековом замке. Я — молодой маг...')}
                        className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                      >
                        🧙 Фэнтези
                      </button>
                      <button
                        onClick={() => setCurrentInput('Корабль сломался на чужой планете. Нужно выжить...')}
                        className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                      >
                        🚀 Космос
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="Bot" size={18} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={18} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon name="Bot" size={18} className="text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Генерирую...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={messages.length === 0 ? "Опиши начало истории..." : "Что делаешь дальше?"}
                  className="min-h-[60px] max-h-[120px] resize-none"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isProcessing}
                  size="lg"
                  className="px-6"
                >
                  {isProcessing ? (
                    <Icon name="Loader2" size={20} className="animate-spin" />
                  ) : (
                    <Icon name="Send" size={20} />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Enter — отправить • Shift+Enter — новая строка
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};