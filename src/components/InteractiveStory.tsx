import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StoryMessage {
  type: 'story' | 'action' | 'choices';
  content: string;
  choices?: string[];
  timestamp: Date;
}

interface InteractiveStoryProps {
  initialStory: string;
  narrativeMode: string;
  playerCharacter: string;
  npcCharacters: string;
  world: string;
  genre: string;
  onContinue: (action: string) => Promise<string>;
  onPlaySound?: () => void;
}

export const InteractiveStory = ({
  initialStory,
  narrativeMode,
  playerCharacter,
  npcCharacters,
  world,
  genre,
  onContinue,
  onPlaySound
}: InteractiveStoryProps) => {
  const [messages, setMessages] = useState<StoryMessage[]>([
    { type: 'story', content: initialStory, timestamp: new Date() }
  ]);
  const [customAction, setCustomAction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const quickActions = [
    { icon: 'Swords', text: 'Атаковать', action: 'Я атакую врага' },
    { icon: 'Shield', text: 'Защититься', action: 'Я принимаю оборонительную позицию' },
    { icon: 'MessageCircle', text: 'Поговорить', action: 'Я пытаюсь начать диалог' },
    { icon: 'Eye', text: 'Осмотреться', action: 'Я внимательно осматриваюсь вокруг' },
    { icon: 'Search', text: 'Исследовать', action: 'Я исследую окружение' },
    { icon: 'Footprints', text: 'Отступить', action: 'Я осторожно отступаю назад' }
  ];

  const handleAction = async (actionText: string) => {
    if (isGenerating) return;

    onPlaySound?.();
    setMessages(prev => [...prev, { 
      type: 'action', 
      content: actionText, 
      timestamp: new Date() 
    }]);
    setCustomAction('');
    setShowCustomInput(false);
    setIsGenerating(true);

    try {
      const continuation = await onContinue(actionText);
      setMessages(prev => [...prev, { 
        type: 'story', 
        content: continuation, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('Error continuing story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomAction = () => {
    if (customAction.trim()) {
      handleAction(customAction);
    }
  };

  return (
    <Card className="border-2 border-primary/20 backdrop-blur-sm bg-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Icon name="BookOpen" size={20} />
            Интерактивная история
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <Icon name="Zap" size={12} className="mr-1" />
              {narrativeMode === 'mixed' ? 'Смешанный' : narrativeMode === 'first_person' ? '1-е лицо' : '3-е лицо'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {messages.filter(m => m.type === 'action').length} действий
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="animate-fade-in">
                {message.type === 'story' && (
                  <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                )}
                {message.type === 'action' && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] p-3 bg-primary/10 rounded-lg border border-primary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="User" size={14} className="text-primary" />
                        <span className="text-xs font-medium text-primary">Ваше действие</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex items-center gap-2 text-muted-foreground p-4">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span className="text-sm">Нейросеть думает...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Что вы делаете?</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-xs"
            >
              <Icon name="Edit" size={14} className="mr-1" />
              Своё действие
            </Button>
          </div>

          {showCustomInput && (
            <div className="space-y-2 animate-fade-in">
              <Textarea
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                placeholder="Опишите своё действие..."
                className="min-h-[80px]"
                disabled={isGenerating}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCustomAction}
                  disabled={isGenerating || !customAction.trim()}
                  className="flex-1"
                >
                  <Icon name="Send" size={16} className="mr-2" />
                  Продолжить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomAction('');
                  }}
                  disabled={isGenerating}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}

          {!showCustomInput && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(action.action)}
                  disabled={isGenerating}
                  className="justify-start gap-2"
                >
                  <Icon name={action.icon as any} size={16} />
                  {action.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
