import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  id: string;
  episode: number;
}

interface StoryJournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
  currentEpisode: number;
}

export const StoryJournalModal = ({ 
  open, 
  onOpenChange, 
  messages,
  currentEpisode 
}: StoryJournalModalProps) => {
  
  const groupedByEpisode = messages.reduce((acc, msg) => {
    const ep = msg.episode;
    if (!acc[ep]) acc[ep] = [];
    acc[ep].push(msg);
    return acc;
  }, {} as Record<number, Message[]>);

  const episodes = Object.keys(groupedByEpisode)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="BookMarked" size={24} className="text-primary" />
            Журнал истории
            <Badge variant="secondary" className="ml-auto">
              {messages.length} записей
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {episodes.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Icon name="BookOpen" size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">История ещё не начата</p>
                <p className="text-sm">Журнал будет заполняться по мере развития сюжета</p>
              </div>
            ) : (
              episodes.map(ep => (
                <div key={ep} className="space-y-3">
                  <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-2 border-b">
                    <div className="flex items-center gap-2">
                      <div className={`
                        px-3 py-1 rounded-full text-sm font-bold
                        ${ep === currentEpisode 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'}
                      `}>
                        Эпизод {ep}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {groupedByEpisode[ep].length} записей
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {groupedByEpisode[ep].map((msg) => (
                      <div 
                        key={msg.id}
                        className={`
                          p-4 rounded-lg border
                          ${msg.type === 'user' 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'bg-muted/50 border-muted'}
                        `}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon 
                            name={msg.type === 'user' ? 'User' : 'Bot'} 
                            size={16} 
                            className={msg.type === 'user' ? 'text-primary' : 'text-muted-foreground'}
                          />
                          <span className="text-xs font-medium">
                            {msg.type === 'user' ? 'Игрок' : 'ИИ'}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(msg.timestamp).toLocaleTimeString('ru', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="gap-2" onClick={() => onOpenChange(false)}>
            <Icon name="X" size={16} />
            Закрыть
          </Button>
          <Button variant="outline" className="gap-2 ml-auto">
            <Icon name="Download" size={16} />
            Экспорт
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};