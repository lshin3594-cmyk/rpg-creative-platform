import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Universe } from './universeTypes';

interface UniverseCardProps {
  universe: Universe;
  index: number;
  onCardClick: () => void;
  onDelete?: (e: React.MouseEvent, id: string) => void;
  onLearnCanon?: (e: React.MouseEvent, id: string) => void;
  deletingId: string | null;
  isLearning: string | null;
  getGenreIcon: (genre: string) => string;
  getGenreLabel: (genre: string) => string;
}

export const UniverseCard = ({
  universe,
  index,
  onCardClick,
  onDelete,
  onLearnCanon,
  deletingId,
  isLearning,
  getGenreIcon,
  getGenreLabel
}: UniverseCardProps) => {
  return (
    <Card 
      key={universe.id}
      className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 overflow-hidden relative group"
      onClick={onCardClick}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fade-in 0.5s ease-out forwards'
      }}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => onDelete(e, universe.id)}
            disabled={deletingId === universe.id}
          >
            {deletingId === universe.id ? (
              <Icon name="Loader2" size={14} className="animate-spin" />
            ) : (
              <Icon name="Trash2" size={14} />
            )}
          </Button>
        )}
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-transparent" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Icon name="Globe" size={20} className="text-primary" />
              {!universe.isCustom && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Icon name="BookOpen" size={12} />
                  Канон
                </Badge>
              )}
              {universe.learnedAt && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Icon name="Check" size={12} />
                  Изучена
                </Badge>
              )}
              {universe.genres && universe.genres.length > 0 && (
                universe.genres.slice(0, 2).map(genre => (
                  <Badge key={genre} variant="outline" className="text-xs gap-1">
                    <Icon name={getGenreIcon(genre) as any} size={10} />
                    {getGenreLabel(genre)}
                  </Badge>
                ))
              )}
            </div>
            <CardTitle className="text-xl font-serif mb-2">{universe.name}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {universe.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {universe.canonSource && (
          <div className="text-xs text-muted-foreground border-t pt-3">
            <strong>Источник:</strong> {universe.canonSource}
          </div>
        )}

        {universe.mainConflict && (
          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Icon name="Flame" size={12} />
              Конфликт:
            </p>
            <p className="text-sm line-clamp-2">{universe.mainConflict}</p>
          </div>
        )}
        
        <div className="flex gap-2 text-xs flex-wrap">
          {universe.lore && <Badge variant="outline" className="gap-1"><Icon name="Book" size={10} />Лор</Badge>}
          {universe.rules && <Badge variant="outline" className="gap-1"><Icon name="Scale" size={10} />Правила</Badge>}
          {universe.characters && <Badge variant="outline" className="gap-1"><Icon name="Users" size={10} />Персонажи</Badge>}
          {universe.locations && <Badge variant="outline" className="gap-1"><Icon name="Map" size={10} />Локации</Badge>}
          {universe.keyEvents && <Badge variant="outline" className="gap-1"><Icon name="ListChecks" size={10} />События</Badge>}
        </div>

        {!universe.learnedAt && onLearnCanon && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={(e) => onLearnCanon(e, universe.id)}
            disabled={isLearning === universe.id}
          >
            {isLearning === universe.id ? (
              <>
                <Icon name="Loader2" size={14} className="animate-spin" />
                Изучаю...
              </>
            ) : (
              <>
                <Icon name="Download" size={14} />
                Изучить канон
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
