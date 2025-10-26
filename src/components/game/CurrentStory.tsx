import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CurrentStoryProps {
  currentStory: string;
  isStarting: boolean;
}

export function CurrentStory({ currentStory, isStarting }: CurrentStoryProps) {
  if (!currentStory || currentStory.length === 0) {
    return null;
  }

  const cleanStory = currentStory
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed !== '📊 СТАТУС ИСТОРИИ' && 
             trimmed !== '===' &&
             !trimmed.startsWith('📍') &&
             !trimmed.startsWith('⏰') &&
             !trimmed.startsWith('🎬') &&
             !trimmed.startsWith('👥') &&
             !trimmed.startsWith('💕') &&
             !trimmed.startsWith('🎒');
    })
    .join('\n')
    .trim();
  
  if (!cleanStory || cleanStory.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 items-start">
      <Avatar className="w-10 h-10 border-2 border-secondary/30">
        <AvatarFallback className="bg-secondary/20 text-secondary font-bold">
          🎭
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-card rounded-lg p-4 border">
        <p className="text-sm font-semibold text-foreground/80 mb-2">
          {isStarting ? 'Начало приключения' : 'Рассказчик'}
        </p>
        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
          {cleanStory}
        </p>
      </div>
    </div>
  );
}