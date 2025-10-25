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
      <div className="border-t border-primary/20 p-4 bg-black/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={ref}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={messagesCount === 0 ? "Напишите что произойдёт дальше..." : "Напишите что вы будете делать..."}
                className="min-h-[80px] max-h-[200px] resize-none bg-black/60 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                disabled={isProcessing}
              />
              <p className="absolute bottom-2 left-3 text-xs text-muted-foreground/40">
                Enter — отправить • Shift+Enter — новая строка
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onDiceRoll}
                disabled={isProcessing}
                className="h-12 w-12 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all"
                title="Случайное действие"
              >
                <Icon name="Dices" size={20} className="text-primary" />
              </Button>
              
              <Button
                size="lg"
                onClick={onSend}
                disabled={!value.trim() || isProcessing}
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-black font-bold border-2 border-primary/60 shadow-lg shadow-primary/20 transition-all"
              >
                {isProcessing ? (
                  <Icon name="Loader2" size={20} className="animate-spin" />
                ) : (
                  <>
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить
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
