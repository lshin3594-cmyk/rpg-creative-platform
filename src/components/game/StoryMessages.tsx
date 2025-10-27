import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Message, GameSettings } from './types';
import { forwardRef, memo } from 'react';

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
      <ScrollArea className="h-full w-full bg-gradient-to-b from-black/20 to-black/40" ref={ref}>
        <div className="p-3 md:p-6">
          {messages.length === 0 && !isProcessing ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/40">
                  <Icon name="Rocket" size={36} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Готовимся к старту...</h3>
                <p className="text-muted-foreground">
                  ИИ создаёт начало истории
                </p>
              </div>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
              <MessageList messages={messages} />
              {isProcessing && <ProcessingIndicator processingTime={processingTime} />}
              {generatingIllustration && <IllustrationIndicator />}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/40">
                  <Icon name="Rocket" size={48} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold tracking-wider">Пристегнитесь, мы отправляемся</h3>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-lg font-mono text-primary">{processingTime} сек</span>
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

const MessageList = memo(({ messages }: { messages: Message[] }) => (
  <>
    {messages.map((message) => (
      <div
        key={message.id}
        className={`flex gap-2 md:gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
      >
        {message.type === 'ai' && (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/50">
            <Icon name="Bot" size={20} className="text-primary md:w-6 md:h-6" />
          </div>
        )}
        <div className={`flex-1 max-w-4xl ${message.type === 'user' ? 'ml-0 md:ml-16' : 'mr-0 md:mr-16'}`}>
          <div
            className={`rounded-lg p-3 md:p-6 ${
              message.type === 'user'
                ? 'bg-primary/10 border border-primary/40'
                : 'bg-black/60 border border-primary/20'
            } backdrop-blur-sm`}
          >
            <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base text-foreground">{message.content}</p>
          </div>
          {message.illustration && message.type === 'ai' && (
            <div className="mt-4 rounded-lg overflow-hidden border-2 border-primary/30">
              <img 
                src={message.illustration} 
                alt="Episode illustration"
                className="w-full aspect-[21/9] object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
        {message.type === 'user' && (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 border-2 border-primary">
            <Icon name="User" size={20} className="text-black md:w-6 md:h-6" />
          </div>
        )}
      </div>
    ))}
  </>
));

MessageList.displayName = 'MessageList';

const ProcessingIndicator = ({ processingTime }: { processingTime: number }) => (
  <div className="flex gap-2 md:gap-4 justify-start animate-fade-in">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/50 animate-pulse">
      <Icon name="Bot" size={20} className="text-primary md:w-6 md:h-6" />
    </div>
    <div className="flex-1 max-w-4xl mr-0 md:mr-16">
      <div className="rounded-lg p-3 md:p-6 bg-black/60 border border-primary/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs md:text-sm text-foreground">Пристегнитесь, мы отправляемся</span>
            <span className="text-xs text-primary/70 font-mono">{processingTime} сек</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IllustrationIndicator = () => (
  <div className="flex gap-2 md:gap-4 justify-start animate-fade-in">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/50">
      <Icon name="Image" size={20} className="text-primary md:w-6 md:h-6" />
    </div>
    <div className="flex-1 max-w-4xl mr-0 md:mr-16">
      <div className="rounded-lg p-3 md:p-6 bg-black/40 border-2 border-dashed border-primary/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Icon name="Loader2" size={16} className="animate-spin text-primary md:w-5 md:h-5" />
          <span className="text-xs md:text-sm text-muted-foreground">Создаю иллюстрацию для эпизода...</span>
        </div>
      </div>
    </div>
  </div>
);