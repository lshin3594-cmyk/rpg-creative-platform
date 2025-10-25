import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionInputModes } from './story/ActionInputModes';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<'free' | 'structured'>('structured');

  const handleActionSubmit = async (actionText: string, dialogue?: string) => {
    if (isGenerating) return;

    onPlaySound?.();
    setMessages(prev => [...prev, { 
      type: 'action', 
      content: actionText, 
      timestamp: new Date() 
    }]);
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

        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium mb-3">Что вы делаете?</p>
          <ActionInputModes
            onSubmit={handleActionSubmit}
            isGenerating={isGenerating}
            mode={inputMode}
            onModeChange={setInputMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};