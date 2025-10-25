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
      <div className="border-t p-4 bg-background">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-3">
            <Textarea
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={messagesCount === 0 ? "Напишите что произойдёт дальше..." : "Ваше действие..."}
              className="min-h-[80px] max-h-[200px] resize-none"
              disabled={isProcessing}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                onClick={onSend}
                disabled={!value.trim() || isProcessing}
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
                onClick={onDiceRoll}
                disabled={isProcessing}
                className="px-6"
                title="Случайное действие"
              >
                <Icon name="Dices" size={20} />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Enter — отправить • Shift+Enter — новая строка
          </p>
        </div>
      </div>
    );
  }
);

StoryInput.displayName = 'StoryInput';
