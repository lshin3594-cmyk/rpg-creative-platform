import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NPC {
  name: string;
  relation: string;
  description: string;
}

interface InventoryItem {
  name: string;
  quantity?: number;
  description?: string;
}

interface JournalEntry {
  episode: number;
  title: string;
  time?: string;
  location?: string;
  events: string[];
  npcs: NPC[];
  emotions?: string[];
  clues?: string[];
  questions?: string[];
  plans?: string[];
  inventory?: InventoryItem[];
  resources?: { name: string; value: number; change?: number }[];
}

interface GameJournalProps {
  entries: JournalEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const GameJournal = ({ entries, isOpen, onClose }: GameJournalProps) => {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentEntry = selectedEpisode !== null 
    ? entries.find(e => e.episode === selectedEpisode) 
    : entries[entries.length - 1];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-950/95 to-pink-950/95 border border-purple-500/40 rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <Icon name="BookOpen" className="text-purple-300" size={24} />
            <h2 className="text-xl font-bold text-purple-100">Журнал игры</h2>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-purple-100 transition"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-purple-500/30 bg-black/20 overflow-y-auto">
            <div className="p-3 space-y-1">
              {entries.map((entry) => (
                <button
                  key={entry.episode}
                  onClick={() => setSelectedEpisode(entry.episode)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                    (selectedEpisode === entry.episode || (!selectedEpisode && entry === entries[entries.length - 1]))
                      ? 'bg-purple-600/50 text-purple-100'
                      : 'text-purple-300/70 hover:bg-purple-900/30 hover:text-purple-200'
                  }`}
                >
                  Эпизод {entry.episode}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            {currentEntry ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-100 mb-2">
                    {currentEntry.title || `Эпизод ${currentEntry.episode}`}
                  </h3>
                  {(currentEntry.time || currentEntry.location) && (
                    <div className="flex items-center gap-3 text-sm text-purple-300/70">
                      {currentEntry.time && (
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {currentEntry.time}
                        </span>
                      )}
                      {currentEntry.location && (
                        <span className="flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          {currentEntry.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {currentEntry.events.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="Sparkles" size={16} />
                      Ключевые события
                    </h4>
                    <ul className="space-y-1.5 text-sm text-purple-100/90">
                      {currentEntry.events.map((event, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{event}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentEntry.npcs.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="Users" size={16} />
                      Персонажи и отношения
                    </h4>
                    <div className="space-y-3">
                      {currentEntry.npcs.map((npc, i) => (
                        <div key={i} className="bg-purple-900/20 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-purple-100">{npc.name}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                npc.relation === 'друг' ? 'border-green-500/50 text-green-400 bg-green-950/30' :
                                npc.relation === 'враг' ? 'border-red-500/50 text-red-400 bg-red-950/30' :
                                'border-purple-500/50 text-purple-300 bg-purple-950/30'
                              }`}
                            >
                              {npc.relation}
                            </Badge>
                          </div>
                          <p className="text-xs text-purple-200/70 leading-relaxed">{npc.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentEntry.emotions && currentEntry.emotions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="Heart" size={16} />
                      Эмоциональное состояние
                    </h4>
                    <ul className="space-y-1.5 text-sm text-purple-100/80">
                      {currentEntry.emotions.map((emotion, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-pink-400">•</span>
                          <span>{emotion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentEntry.clues && currentEntry.clues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="Search" size={16} />
                      Новая информация
                    </h4>
                    <ul className="space-y-1.5 text-sm text-purple-100/80">
                      {currentEntry.clues.map((clue, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-yellow-400">•</span>
                          <span>{clue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentEntry.questions && currentEntry.questions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="HelpCircle" size={16} />
                      Нерешённые вопросы
                    </h4>
                    <ul className="space-y-1.5 text-sm text-purple-100/70 italic">
                      {currentEntry.questions.map((question, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-purple-400">?</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentEntry.plans && currentEntry.plans.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="Target" size={16} />
                      Планы на следующий ход
                    </h4>
                    <ul className="space-y-1.5 text-sm text-purple-100/80">
                      {currentEntry.plans.map((plan, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-blue-400">→</span>
                          <span>{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentEntry.inventory && currentEntry.inventory.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="Backpack" size={16} />
                      Инвентарь
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {currentEntry.inventory.map((item, i) => (
                        <div key={i} className="bg-purple-900/20 rounded-lg p-2.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-100 font-medium">{item.name}</span>
                            {item.quantity !== undefined && (
                              <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                                {item.quantity}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-purple-300/60 mt-1">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentEntry.resources && currentEntry.resources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                      <Icon name="Coins" size={16} />
                      Ресурсы
                    </h4>
                    <div className="space-y-2">
                      {currentEntry.resources.map((resource, i) => (
                        <div key={i} className="flex items-center justify-between bg-purple-900/20 rounded-lg p-2.5">
                          <span className="text-sm text-purple-100">{resource.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-yellow-400">
                              {resource.value}
                            </span>
                            {resource.change !== undefined && resource.change !== 0 && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  resource.change > 0 
                                    ? 'border-green-500/50 text-green-400' 
                                    : 'border-red-500/50 text-red-400'
                                }`}
                              >
                                {resource.change > 0 ? '+' : ''}{resource.change}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-purple-300/60">
                <p>Нет записей в журнале</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};