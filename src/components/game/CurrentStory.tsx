import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CurrentStoryProps {
  currentStory: string;
  isStarting: boolean;
}

export function CurrentStory({ currentStory, isStarting }: CurrentStoryProps) {
  if (!currentStory || currentStory.length === 0) {
    return null;
  }

  // Удаляем весь блок СТАТУС ИСТОРИИ (от начала или от 📊 до ===)
  let cleanStory = currentStory;
  
  console.log('🔍 Original story length:', currentStory.length);
  console.log('🔍 Original story:', currentStory);
  
  const statusStart = cleanStory.indexOf('📊 СТАТУС ИСТОРИИ');
  const statusEnd = cleanStory.indexOf('===');
  
  console.log('🔍 Status start:', statusStart);
  console.log('🔍 Status end:', statusEnd);
  
  if (statusStart !== -1 && statusEnd !== -1 && statusEnd > statusStart) {
    // Удаляем блок от 📊 до === включительно
    cleanStory = cleanStory.substring(0, statusStart) + cleanStory.substring(statusEnd + 3);
    console.log('🔍 After removing status:', cleanStory);
  }
  
  cleanStory = cleanStory.trim();
  
  console.log('🔍 Final cleaned story:', cleanStory);
  console.log('🔍 Final length:', cleanStory.length);
  
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