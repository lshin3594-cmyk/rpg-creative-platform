import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Plot {
  id: string;
  name: string;
  description: string;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  genres: string[];
}

interface PlotCardProps {
  plot: Plot;
  index: number;
  onCardClick?: () => void;
  onPreview?: (e: React.MouseEvent, plot: Plot) => void;
  onEdit?: (e: React.MouseEvent, plot: Plot) => void;
  onDelete?: (e: React.MouseEvent, id: string) => void;
  deletingId: string | null;
  getGenreIcon: (genre: string) => string;
  getGenreLabel: (genre: string) => string;
}

export const PlotCard = ({
  plot,
  index,
  onCardClick,
  onPreview,
  onEdit,
  onDelete,
  deletingId,
  getGenreIcon,
  getGenreLabel
}: PlotCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (onPreview) {
      onPreview(e, plot);
    } else if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <Card 
      key={plot.id}
      className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 overflow-hidden relative group"
      onClick={handleCardClick}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fade-in 0.5s ease-out forwards'
      }}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onEdit && (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 backdrop-blur-sm bg-background/80"
            onClick={(e) => onEdit(e, plot)}
          >
            <Icon name="Pencil" size={16} />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 backdrop-blur-sm"
            onClick={(e) => onDelete(e, plot.id)}
            disabled={deletingId === plot.id}
          >
            {deletingId === plot.id ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Trash2" size={16} />
            )}
          </Button>
        )}
      </div>
      <CardHeader>
        {plot.genres && plot.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {plot.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="gap-1 text-xs">
                <Icon name={getGenreIcon(genre) as any} size={12} />
                {getGenreLabel(genre)}
              </Badge>
            ))}
            {plot.genres.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{plot.genres.length - 3}
              </Badge>
            )}
          </div>
        )}
        <CardTitle className="text-2xl font-serif">{plot.name}</CardTitle>
        {plot.description && (
          <CardDescription className="text-base leading-relaxed">
            {plot.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {plot.mainConflict && (
          <div className="flex gap-2">
            <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-2">{plot.mainConflict}</p>
          </div>
        )}
        {plot.keyEvents && (
          <div className="flex gap-2">
            <Icon name="List" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-2">{plot.keyEvents}</p>
          </div>
        )}
        {plot.resolution && (
          <div className="flex gap-2">
            <Icon name="Flag" size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-2">{plot.resolution}</p>
          </div>
        )}
        <Button variant="outline" className="w-full gap-2 mt-4">
          <Icon name="Sparkles" size={18} />
          Использовать сюжет
        </Button>
      </CardContent>
    </Card>
  );
};