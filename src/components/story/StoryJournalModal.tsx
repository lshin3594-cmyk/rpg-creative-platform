import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

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
  const [viewMode, setViewMode] = useState<'detailed' | 'overview'>('detailed');

  const handleExport = () => {
    const exportText = episodes.map(ep => {
      const episodeMsgs = groupedByEpisode[ep];
      let text = `\n═══════════════════════════════════════\n`;
      text += `          ЭПИЗОД ${ep}\n`;
      text += `═══════════════════════════════════════\n\n`;
      
      episodeMsgs.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleString('ru');
        const author = msg.type === 'user' ? 'ИГРОК' : 'ИИ';
        text += `[${time}] ${author}:\n${msg.content}\n\n`;
      });
      
      return text;
    }).join('\n');

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-journal-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const groupedByEpisode = messages.reduce((acc, msg) => {
    const ep = msg.episode;
    if (!acc[ep]) acc[ep] = [];
    acc[ep].push(msg);
    return acc;
  }, {} as Record<number, Message[]>);

  const episodes = Object.keys(groupedByEpisode)
    .map(Number)
    .sort((a, b) => a - b);

  const generateEpisodeSummary = (episodeMessages: Message[]): string => {
    const aiMessages = episodeMessages.filter(m => m.type === 'ai');
    const totalText = aiMessages.map(m => m.content).join(' ');
    const words = totalText.split(' ').slice(0, 50).join(' ');
    return words + '...';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="BookMarked" size={24} className="text-primary" />
            Журнал истории
            <Badge variant="secondary" className="ml-2">
              {messages.length} записей
            </Badge>
            <div className="ml-auto flex gap-2">
              <Button 
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
                className="gap-1.5"
              >
                <Icon name="List" size={14} />
                Детально
              </Button>
              <Button 
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('overview')}
                className="gap-1.5"
              >
                <Icon name="LayoutGrid" size={14} />
                Обзор эпизодов
              </Button>
            </div>
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
            ) : viewMode === 'overview' ? (
              <div className="grid grid-cols-2 gap-4">
                {episodes.map(ep => {
                  const episodeMsgs = groupedByEpisode[ep];
                  const summary = generateEpisodeSummary(episodeMsgs);
                  return (
                    <div 
                      key={ep} 
                      className={`
                        p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer
                        ${ep === currentEpisode 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-card hover:border-primary/50'}
                      `}
                      onClick={() => setViewMode('detailed')}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`
                          px-3 py-1 rounded-full text-sm font-bold
                          ${ep === currentEpisode 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'}
                        `}>
                          Эпизод {ep}
                        </div>
                        {ep === currentEpisode && (
                          <Badge variant="secondary" className="text-xs">Текущий</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {episodeMsgs.length} записей • {episodeMsgs.filter(m => m.type === 'user').length} ходов
                      </p>
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {summary}
                      </p>
                    </div>
                  );
                })}
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
          <Button variant="outline" className="gap-2 ml-auto" onClick={handleExport}>
            <Icon name="Download" size={16} />
            Экспорт
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};