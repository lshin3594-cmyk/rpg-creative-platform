import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface ActionInputProps {
  userAction: string;
  metaCommand: string;
  showMetaInput: boolean;
  isLoading: boolean;
  onUserActionChange: (value: string) => void;
  onMetaCommandChange: (value: string) => void;
  onSend: () => void;
}

export function ActionInput({
  userAction,
  metaCommand,
  showMetaInput,
  isLoading,
  onUserActionChange,
  onMetaCommandChange,
  onSend
}: ActionInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto p-4">
        {showMetaInput && (
          <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Wand2" size={16} className="text-primary" />
              <span className="text-xs font-medium text-primary">Мета-команда (необязательно)</span>
            </div>
            <Textarea
              value={metaCommand}
              onChange={(e) => onMetaCommandChange(e.target.value)}
              placeholder="Например: добавь больше юмора, сделай диалог более напряжённым"
              className="min-h-[60px] text-sm resize-none bg-background"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Используй мета-команды, чтобы управлять стилем и настроением истории
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={userAction}
            onChange={(e) => onUserActionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Опиши своё действие..."
            className="min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={onSend}
            disabled={isLoading || !userAction.trim()}
            size="lg"
            className="px-6"
          >
            {isLoading ? (
              <Icon name="Loader2" className="animate-spin" size={20} />
            ) : (
              <Icon name="Send" size={20} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
