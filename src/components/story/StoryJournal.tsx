import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  id: string;
}

interface JournalEntry {
  type: 'character' | 'clue' | 'location' | 'event';
  name: string;
  description: string;
  relation?: string;
}

interface StoryJournalProps {
  messages: Message[];
}

export const StoryJournal = ({ messages }: StoryJournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'characters' | 'clues' | 'locations'>('characters');

  useEffect(() => {
    analyzeMessages();
  }, [messages]);

  const analyzeMessages = () => {
    const newEntries: JournalEntry[] = [];
    
    messages.forEach(msg => {
      if (msg.type === 'ai') {
        const text = msg.content;
        
        const characterMatches = text.match(/([А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+)?)\s*[-—–]\s*([^.!?\n]{10,100})/g);
        if (characterMatches) {
          characterMatches.forEach(match => {
            const [name, desc] = match.split(/\s*[-—–]\s*/);
            if (name && desc && !newEntries.some(e => e.name === name)) {
              newEntries.push({
                type: 'character',
                name: name.trim(),
                description: desc.trim(),
                relation: 'Неизвестно'
              });
            }
          });
        }

        const clueKeywords = ['улика', 'след', 'доказательство', 'находка', 'подсказка'];
        clueKeywords.forEach(keyword => {
          const regex = new RegExp(`(${keyword}[^.!?]{10,100})`, 'gi');
          const matches = text.match(regex);
          if (matches) {
            matches.forEach(clue => {
              if (!newEntries.some(e => e.description === clue.trim())) {
                newEntries.push({
                  type: 'clue',
                  name: 'Улика',
                  description: clue.trim()
                });
              }
            });
          }
        });

        const locationMatches = text.match(/в\s([А-ЯЁ][а-яё\s]{3,30}(?:улиц[аеы]|площад[ьи]|здани[еи]|дом[ае]|комнат[ае]))/g);
        if (locationMatches) {
          locationMatches.forEach(match => {
            const location = match.replace(/^в\s/, '').trim();
            if (!newEntries.some(e => e.name === location)) {
              newEntries.push({
                type: 'location',
                name: location,
                description: 'Место из истории'
              });
            }
          });
        }
      }
    });

    setEntries(newEntries);
  };

  const filteredEntries = entries.filter(e => {
    if (activeTab === 'characters') return e.type === 'character';
    if (activeTab === 'clues') return e.type === 'clue';
    if (activeTab === 'locations') return e.type === 'location';
    return true;
  });

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="BookMarked" size={20} className="text-primary" />
          <h3 className="font-bold">Журнал приключений</h3>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-all ${
              activeTab === 'characters'
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <Icon name="Users" size={14} className="inline mr-1" />
            Персонажи
          </button>
          <button
            onClick={() => setActiveTab('clues')}
            className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-all ${
              activeTab === 'clues'
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <Icon name="Search" size={14} className="inline mr-1" />
            Улики
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-all ${
              activeTab === 'locations'
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <Icon name="MapPin" size={14} className="inline mr-1" />
            Места
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-50" />
              <p>Пока пусто</p>
              <p className="text-xs mt-1">
                {activeTab === 'characters' && 'Персонажи появятся в истории'}
                {activeTab === 'clues' && 'Улики будут записаны автоматически'}
                {activeTab === 'locations' && 'Места добавятся по ходу сюжета'}
              </p>
            </div>
          )}

          {filteredEntries.map((entry, idx) => (
            <div
              key={idx}
              className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-2 mb-1">
                {entry.type === 'character' && (
                  <Icon name="User" size={16} className="text-primary mt-0.5" />
                )}
                {entry.type === 'clue' && (
                  <Icon name="Lightbulb" size={16} className="text-yellow-500 mt-0.5" />
                )}
                {entry.type === 'location' && (
                  <Icon name="MapPin" size={16} className="text-blue-500 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{entry.name}</h4>
                  {entry.relation && (
                    <span className="text-xs text-muted-foreground">{entry.relation}</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-background">
        <div className="text-xs text-muted-foreground text-center">
          <Icon name="Sparkles" size={12} className="inline mr-1" />
          Журнал обновляется автоматически
        </div>
      </div>
    </div>
  );
};
