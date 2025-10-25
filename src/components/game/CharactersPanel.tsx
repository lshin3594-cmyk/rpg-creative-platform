import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Character, GameSettings } from './types';

interface CharactersPanelProps {
  characters: Character[];
  agentsEnabled: boolean;
  autoIllustrations: boolean;
  gameSettings?: GameSettings;
  onAgentsToggle: (enabled: boolean) => void;
  onIllustrationsToggle: (enabled: boolean) => void;
  onCreateCharacter: () => void;
  onOpenJournal: () => void;
  onKickAI: () => void;
}

export const CharactersPanel = ({
  characters,
  agentsEnabled,
  autoIllustrations,
  gameSettings,
  onAgentsToggle,
  onIllustrationsToggle,
  onCreateCharacter,
  onOpenJournal,
  onKickAI
}: CharactersPanelProps) => {
  const eloquenceLevel = gameSettings?.eloquenceLevel || 1;
  const genre = gameSettings?.genre || 'Фэнтези';
  const rating = gameSettings?.rating || '18+';

  return (
    <div className="w-80 border-r border-primary/20 bg-black/40 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-primary/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/40">
            <Icon name="Crown" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">ИИ</h3>
            <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              <Icon name="Settings" size={12} />
              Настройки
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-primary/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Icon name="Sparkles" size={12} />
              Жанр
            </span>
            <span className="text-foreground font-medium">{genre}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Icon name="Shield" size={12} />
              Рейтинг
            </span>
            <span className="text-foreground font-medium">{rating}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Icon name="MessageSquare" size={12} />
              Красноречие
            </span>
            <div className="flex items-center gap-1">
              <span className="text-primary font-bold">{eloquenceLevel}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded-full ${
                      i < eloquenceLevel ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {characters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Icon name="Users" size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-xs">Персонажи появятся</p>
              <p className="text-xs">по ходу истории</p>
            </div>
          ) : (
            characters.map((char, idx) => (
              <div
                key={idx}
                className="relative p-4 bg-black/60 border border-primary/30 hover:border-primary/60 transition-all cursor-pointer group rounded-lg overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/50 relative overflow-hidden">
                    {char.avatar ? (
                      <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="User" size={20} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate">{char.name}</h4>
                    <p className="text-xs text-primary/70 flex items-center gap-1">
                      <Icon name="Briefcase" size={10} />
                      {char.role}
                    </p>
                    {char.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-tight">
                        {char.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-primary/20 space-y-2 bg-black/60">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all text-foreground"
          onClick={onOpenJournal}
        >
          <Icon name="BookOpen" size={16} />
          Журнал
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all text-foreground"
          onClick={onKickAI}
        >
          <Icon name="Zap" size={16} />
          Пнуть ИИ
        </Button>
        
        <div className="pt-3 border-t border-primary/20 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="agents-toggle" className="text-xs cursor-pointer text-muted-foreground">
                Агенты-наблюдатели
              </Label>
              <Switch 
                id="agents-toggle"
                checked={agentsEnabled}
                onCheckedChange={onAgentsToggle}
              />
            </div>
            <p className="text-[10px] text-muted-foreground/60">
              ИИ следит за сюжетом и временем
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="illustrations-toggle" className="text-xs cursor-pointer text-muted-foreground">
                Автоиллюстрации
              </Label>
              <Switch 
                id="illustrations-toggle"
                checked={autoIllustrations}
                onCheckedChange={onIllustrationsToggle}
              />
            </div>
            <p className="text-[10px] text-muted-foreground/60">
              3-4 картинки на эпизод
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};