import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HistoryEntry {
  user: string;
  ai: string;
  image?: string;
}

interface StoryHistoryProps {
  history: HistoryEntry[];
  selectedCharacter: any;
  currentStory?: string;
}

export function StoryHistory({ history, selectedCharacter, currentStory }: StoryHistoryProps) {
  const formatText = (text: string) => {
    const metaCommandMatch = text.match(/^@\[МЕТА-КОМАНДА\]:\s*(.+?)\n\n/);
    if (metaCommandMatch) {
      const metaCommand = metaCommandMatch[1];
      const mainText = text.slice(metaCommandMatch[0].length);
      return (
        <>
          <div className="text-xs text-muted-foreground/70 mb-2 italic border-l-2 border-primary/50 pl-2">
            🔮 Мета: {metaCommand}
          </div>
          {mainText}
        </>
      );
    }
    return text;
  };

  return (
    <>
      {currentStory && (
        <div className="flex gap-3 items-start mb-4">
          <Avatar className="w-10 h-10 border-2 border-secondary/30">
            <AvatarFallback className="bg-secondary/20 text-secondary font-bold">
              🎭
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-card rounded-lg p-4 border">
            <p className="text-sm font-semibold text-foreground/80 mb-2">Рассказчик</p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {currentStory}
            </p>
          </div>
        </div>
      )}
      
      {history.map((entry, index) => (
        <div key={index} className="space-y-4">
          <div className="flex gap-3 items-start">
            <Avatar className="w-10 h-10 border-2 border-primary/30">
              <AvatarImage src={selectedCharacter?.avatarUrl} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {selectedCharacter?.name?.charAt(0) || 'Я'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-primary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-sm font-semibold text-primary mb-1">
                {selectedCharacter?.name || 'Ты'}
              </p>
              <p className="text-sm whitespace-pre-wrap">{formatText(entry.user)}</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Avatar className="w-10 h-10 border-2 border-secondary/30">
              <AvatarFallback className="bg-secondary/20 text-secondary font-bold">
                🎭
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-card rounded-lg p-4 border">
              <p className="text-sm font-semibold text-foreground/80 mb-2">Рассказчик</p>
              {entry.image && (
                <div className="mb-3 rounded-md overflow-hidden border">
                  <img 
                    src={entry.image} 
                    alt="Scene illustration" 
                    className="w-full h-auto"
                  />
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {entry.ai}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}