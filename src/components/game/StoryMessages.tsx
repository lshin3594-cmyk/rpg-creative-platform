import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Message, GameSettings } from './types';
import { forwardRef } from 'react';

interface StoryMessagesProps {
  messages: Message[];
  gameSettings: GameSettings;
  isProcessing: boolean;
  processingTime: number;
  generatingIllustration: boolean;
}

export const StoryMessages = forwardRef<HTMLDivElement, StoryMessagesProps>(
  ({ messages, gameSettings, isProcessing, processingTime, generatingIllustration }, ref) => {
    return (
      <ScrollArea className="flex-1" ref={ref}>
        <div className="p-6">
          {messages.length === 0 && !isProcessing ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Icon name="Rocket" size={36} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Готовимся к старту...</h3>
                <p className="text-muted-foreground">
                  ИИ создаёт начало истории
                </p>
              </div>
            </div>
          ) : messages.length > 0 ? (
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
                    {message.illustration && message.type === 'ai' && (
                      <div className="mb-3 rounded-lg overflow-hidden border">
                        <img 
                          src={message.illustration} 
                          alt="Episode illustration"
                          className="w-full aspect-[16/9] object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
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
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Пристегнитесь, мы отправляемся</span>
                          <span className="text-xs text-muted-foreground/60">{processingTime} сек</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {generatingIllustration && (
                <div className="flex gap-4 justify-start">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="Image" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 max-w-3xl mr-12">
                    <div className="rounded-lg p-4 bg-muted/50 border-2 border-dashed border-primary/30">
                      <div className="flex items-center gap-3">
                        <Icon name="Loader2" size={20} className="animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Создаю иллюстрацию для эпизода...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Icon name="Rocket" size={36} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold">Пристегнитесь, мы отправляемся</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">{processingTime} сек</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }
);

StoryMessages.displayName = 'StoryMessages';