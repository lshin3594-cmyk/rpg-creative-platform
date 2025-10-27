import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { forwardRef } from 'react';

interface StoryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onDiceRoll: () => void;
  isProcessing: boolean;
  messagesCount: number;
}

export const StoryInput = forwardRef<HTMLTextAreaElement, StoryInputProps>(
  ({ value, onChange, onSend, onDiceRoll, isProcessing, messagesCount }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    return (
      <div className="border-t border-primary/20 p-2 md:p-4 bg-black/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 md:gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={ref}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={messagesCount === 0 ? "Что произойдёт дальше..." : "Что вы будете делать..."}
                className="min-h-[60px] md:min-h-[80px] max-h-[150px] md:max-h-[200px] resize-none bg-black/60 border-primary/30 focus:border-primary text-sm md:text-base text-foreground placeholder:text-muted-foreground/50 pb-6"
                disabled={isProcessing}
              />
              <p className="absolute bottom-2 left-3 text-[10px] md:text-xs text-muted-foreground/40 hidden md:block">
                Enter — отправить • Shift+Enter — новая строка
              </p>
            </div>
            
            <div className="flex gap-1 md:gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onDiceRoll}
                disabled={isProcessing}
                className="h-10 w-10 md:h-12 md:w-12 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all"
                title="Случайное действие"
              >
                <Icon name="Dices" size={18} className="text-primary md:w-5 md:h-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={onSend}
                disabled={!value.trim() || isProcessing}
                className="h-10 md:h-12 px-4 md:px-8 bg-primary hover:bg-primary/90 text-black font-bold border-2 border-primary/60 shadow-lg shadow-primary/20 transition-all text-sm md:text-base"
              >
                {isProcessing ? (
                  <Icon name="Loader2" size={18} className="animate-spin md:w-5 md:h-5" />
                ) : (
                  <>
                    <Icon name="Send" size={18} className="md:mr-2 md:w-5 md:h-5" />
                    <span className="hidden md:inline">Отправить</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

StoryInput.displayName = 'StoryInput';