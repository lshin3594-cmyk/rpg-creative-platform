import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Character } from './types';

interface CharactersPanelProps {
  characters: Character[];
  agentsEnabled: boolean;
  autoIllustrations: boolean;
  onAgentsToggle: (enabled: boolean) => void;
  onIllustrationsToggle: (enabled: boolean) => void;
  onCreateCharacter: () => void;
  onOpenJournal: () => void;
}

export const CharactersPanel = ({
  characters,
  agentsEnabled,
  autoIllustrations,
  onAgentsToggle,
  onIllustrationsToggle,
  onCreateCharacter,
  onOpenJournal
}: CharactersPanelProps) => {
  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b bg-background/95">
        <h3 className="font-bold flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" />
          Персонажи
        </h3>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {characters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Icon name="UserPlus" size={32} className="mx-auto mb-2 opacity-50" />
              <p>Персонажи появятся</p>
              <p>по ходу истории</p>
            </div>
          ) : (
            characters.map((char, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    {char.avatar ? (
                      <img src={char.avatar} alt={char.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Icon name="User" size={24} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{char.name}</h4>
                    <p className="text-xs text-muted-foreground">{char.role}</p>
                    {char.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
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
      <div className="p-3 border-t space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          onClick={onCreateCharacter}
        >
          <Icon name="UserPlus" size={16} />
          Создать НПС
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          onClick={onOpenJournal}
        >
          <Icon name="BookMarked" size={16} />
          Журнал
        </Button>
        
        <div className="pt-2 border-t space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="agents-toggle" className="text-xs cursor-pointer">
                Агенты-наблюдатели
              </Label>
              <Switch 
                id="agents-toggle"
                checked={agentsEnabled}
                onCheckedChange={onAgentsToggle}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              ИИ следит за сюжетом и временем
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="illustrations-toggle" className="text-xs cursor-pointer">
                Автоиллюстрации
              </Label>
              <Switch 
                id="illustrations-toggle"
                checked={autoIllustrations}
                onCheckedChange={onIllustrationsToggle}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Картинки для каждого эпизода
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
