import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useRef, useEffect } from 'react';
import { StoryJournal } from './story/StoryJournal';

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
  id: string;
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
  const [showJournal, setShowJournal] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
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
      setShowJournal(true);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const userMessage: Message = {
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
      id: Date.now().toString()
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
          timestamp: new Date(),
          id: (Date.now() + 1).toString()
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

  const handleEditMessage = async (messageId: string) => {
    if (!editInput.trim() || isProcessing) return;

    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const updatedMessages = messages.slice(0, messageIndex);
    setMessages(updatedMessages);
    setEditingMessageId(null);
    setIsProcessing(true);

    try {
      if (onContinue) {
        const aiResponse = await onContinue(editInput.trim());
        const aiMessage: Message = {
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          id: Date.now().toString()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
      setEditInput('');
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
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
          <div className="flex-1 flex overflow-hidden">
            {showJournal && (
              <StoryJournal messages={messages} />
            )}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-background flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowJournal(!showJournal)}
                    className="gap-2"
                  >
                    <Icon name={showJournal ? 'PanelLeftClose' : 'PanelLeftOpen'} size={20} />
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="BookOpen" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Твоя история</h2>
                    <p className="text-sm text-muted-foreground">Ролевая новелла без ограничений</p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.length === 0 && (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Wand2" size={32} className="text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Начни своё приключение</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Опиши героя, мир и ситуацию. ИИ подхватит и создаст интерактивную историю
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-4 max-w-2xl mx-auto">
                        <button
                          onClick={() => setCurrentInput('Я — частный детектив в неоновом мегаполисе 2087 года. На столе передо мной лежит фото убитой женщины...')}
                          className="p-4 rounded-lg bg-muted hover:bg-muted/80 text-left transition-colors group"
                        >
                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🕵️</div>
                          <div className="font-semibold text-sm">Нео-детектив</div>
                          <div className="text-xs text-muted-foreground mt-1">Киберпанк расследование</div>
                        </button>
                        <button
                          onClick={() => setCurrentInput('Меня зовут Элара, я молодая маг-целительница. Сегодня в королевство пришла чума...')}
                          className="p-4 rounded-lg bg-muted hover:bg-muted/80 text-left transition-colors group"
                        >
                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧙‍♀️</div>
                          <div className="font-semibold text-sm">Маг-целитель</div>
                          <div className="text-xs text-muted-foreground mt-1">Темное фэнтези</div>
                        </button>
                        <button
                          onClick={() => setCurrentInput('Я капитан торгового корабля "Феникс". Только что получил сигнал бедствия с заброшенной станции...')}
                          className="p-4 rounded-lg bg-muted hover:bg-muted/80 text-left transition-colors group"
                        >
                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
                          <div className="font-semibold text-sm">Космокапитан</div>
                          <div className="text-xs text-muted-foreground mt-1">Космический хоррор</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={msg.id}>
                      <div
                        className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.type === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                            <Icon name="Sparkles" size={16} className="text-primary" />
                          </div>
                        )}
                        <div className="flex flex-col gap-2 max-w-[80%]">
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              msg.type === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted border border-border'
                            }`}
                          >
                            {editingMessageId === msg.id ? (
                              <Textarea
                                value={editInput}
                                onChange={(e) => setEditInput(e.target.value)}
                                className="min-h-[60px]"
                                autoFocus
                              />
                            ) : (
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            )}
                          </div>
                          {msg.type === 'ai' && editingMessageId !== msg.id && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingMessageId(msg.id);
                                  setEditInput('Переделай: ');
                                }}
                                className="gap-1 h-7 text-xs"
                              >
                                <Icon name="RefreshCw" size={14} />
                                Переделать
                              </Button>
                            </div>
                          )}
                          {editingMessageId === msg.id && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditMessage(msg.id)}
                                disabled={!editInput.trim()}
                              >
                                <Icon name="Check" size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingMessageId(null);
                                  setEditInput('');
                                }}
                              >
                                <Icon name="X" size={14} />
                              </Button>
                            </div>
                          )}
                        </div>
                        {msg.type === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Icon name="User" size={16} className="text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isProcessing && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                        <Icon name="Sparkles" size={16} className="text-primary animate-pulse" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3 border border-border">
                        <div className="flex items-center gap-2">
                          <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Рассказчик думает...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-background">
                <div className="flex gap-2 max-w-4xl mx-auto">
                  <Textarea
                    ref={inputRef}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={messages.length === 0 ? "Опиши героя и начало истории..." : "Что говоришь или делаешь?"}
                    className="min-h-[70px] max-h-[150px] resize-none text-base"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || isProcessing}
                    size="lg"
                    className="px-6"
                  >
                    {isProcessing ? (
                      <Icon name="Loader2" size={22} className="animate-spin" />
                    ) : (
                      <Icon name="Send" size={22} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Enter — отправить • Shift+Enter — новая строка
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};