import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CurrentStoryProps {
  currentStory: string;
  isStarting: boolean;
}

export function CurrentStory({ currentStory, isStarting }: CurrentStoryProps) {
  if (!currentStory || currentStory.length === 0) {
    return null;
  }

  let cleanStory = currentStory;
  
  const statusStart = cleanStory.indexOf('📊 СТАТУС ИСТОРИИ');
  const statusEnd = cleanStory.indexOf('===');
  
  if (statusStart !== -1 && statusEnd !== -1 && statusEnd > statusStart) {
    cleanStory = cleanStory.substring(0, statusStart) + cleanStory.substring(statusEnd + 3);
  }
  
  cleanStory = cleanStory.trim();
  
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