import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StoryJournal } from './story/StoryJournal';
import { storyStorage } from '@/lib/storyStorage';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  id: string;
}

interface StoryGeneratorProps {
  storyId?: string;
}

export const StoryGenerator = ({ storyId }: StoryGeneratorProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showJournal, setShowJournal] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [currentStoryId, setCurrentStoryId] = useState<string>(storyId || '');
  const [storyTitle, setStoryTitle] = useState('Новая история');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (storyId) {
      const story = storyStorage.getById(storyId);
      if (story) {
        setMessages(story.messages);
        setStoryTitle(story.title);
        setCurrentStoryId(storyId);
      }
    }
  }, [storyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        type: 'ai',
        content: `Ответ ИИ на: "${userInput}"`,
        timestamp: new Date(),
        id: (Date.now() + 1).toString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditInput(message.content);
    }
  };

  const handleSaveEdit = async () => {
    if (!editInput.trim() || !editingMessageId) return;

    const messageIndex = messages.findIndex(m => m.id === editingMessageId);
    if (messageIndex === -1) return;

    const newMessages = [...messages];
    newMessages[messageIndex] = {
      ...newMessages[messageIndex],
      content: editInput.trim()
    };

    const messagesToKeep = newMessages.slice(0, messageIndex + 1);
    setMessages(messagesToKeep);
    setEditingMessageId(null);
    setEditInput('');
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        type: 'ai',
        content: `Новый ответ на отредактированное сообщение: "${editInput.trim()}"`,
        timestamp: new Date(),
        id: Date.now().toString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (!previousUserMessage || previousUserMessage.type !== 'user') return;

    const messagesToKeep = messages.slice(0, messageIndex);
    setMessages(messagesToKeep);
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        type: 'ai',
        content: `Новый вариант ответа на: "${previousUserMessage.content}"`,
        timestamp: new Date(),
        id: Date.now().toString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveStory = () => {
    if (messages.length === 0) {
      toast({
        title: 'Нечего сохранять',
        description: 'Начните историю перед сохранением',
        variant: 'destructive'
      });
      return;
    }

    const id = currentStoryId || Date.now().toString();
    const title = messages[0]?.content.slice(0, 50) || 'Новая история';
    
    storyStorage.save({
      id,
      title,
      messages,
      createdAt: currentStoryId ? storyStorage.getById(currentStoryId)?.createdAt || new Date() : new Date(),
      updatedAt: new Date()
    });

    setCurrentStoryId(id);
    setStoryTitle(title);

    toast({
      title: 'Сохранено!',
      description: 'История сохранена в вашей библиотеке'
    });
  };

  const handleNewStory = () => {
    if (messages.length > 0) {
      const confirm = window.confirm('Начать новую историю? Текущий прогресс будет потерян, если не сохранён.');
      if (!confirm) return;
    }
    setMessages([]);
    setCurrentStoryId('');
    setStoryTitle('Новая история');
    navigate('/');
  };

  const handleGoToLibrary = () => {
    navigate('/my-saves');
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <div className="flex-1 flex">
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
                <h2 className="text-xl font-bold">{storyTitle}</h2>
                <p className="text-sm text-muted-foreground">
                  {messages.length === 0 ? 'Начни свою историю' : `${messages.length} сообщений`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveStory}
                disabled={messages.length === 0}
                className="gap-2"
              >
                <Icon name="Save" size={18} />
                <span className="hidden md:inline">Сохранить</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Icon name="MoreVertical" size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleNewStory}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Новая история
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGoToLibrary}>
                    <Icon name="Library" size={16} className="mr-2" />
                    Мои сохранения
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <Icon name="Home" size={16} className="mr-2" />
                    На главную
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                    <Icon name="MessageSquare" size={36} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Начни свою историю</h3>
                  <p className="text-muted-foreground">
                    Опиши ситуацию, персонажей или мир - и ИИ продолжит твою историю
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground text-left bg-muted/30 rounded-lg p-4">
                    <p className="font-semibold">Примеры:</p>
                    <p>• "Я детектив в нуарном городе. Только что получил странное дело..."</p>
                    <p>• "Космический корабль потерпел крушение на неизвестной планете"</p>
                    <p>• "В старом особняке происходят странные вещи..."</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
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
                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          className="min-h-[100px]"
                          placeholder="Отредактируй сообщение..."
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingMessageId(null);
                              setEditInput('');
                            }}
                          >
                            Отмена
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={!editInput.trim()}
                          >
                            <Icon name="Check" size={16} className="mr-1" />
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className={`rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {message.type === 'user' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditMessage(message.id)}
                              className="h-8 text-xs"
                            >
                              <Icon name="Pencil" size={14} className="mr-1" />
                              Изменить
                            </Button>
                          )}
                          {message.type === 'ai' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRegenerateResponse(message.id)}
                              className="h-8 text-xs"
                              disabled={isProcessing}
                            >
                              <Icon name="RefreshCw" size={14} className="mr-1" />
                              Переделать
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={20} className="text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
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

          <div className="border-t p-4 bg-background">
            <div className="max-w-4xl mx-auto flex gap-3">
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
                placeholder={messages.length === 0 ? "Опиши начало истории..." : "Твоё действие..."}
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={isProcessing}
              />
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
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Enter — отправить • Shift+Enter — новая строка
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};