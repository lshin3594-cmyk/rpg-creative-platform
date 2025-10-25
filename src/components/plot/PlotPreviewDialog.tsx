import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Plot {
  id: string;
  name: string;
  description: string;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  genres: string[];
}

interface PlotPreviewDialogProps {
  plot: Plot | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getGenreIcon: (genre: string) => string;
  getGenreLabel: (genre: string) => string;
  onUseInStory?: () => void;
}

export const PlotPreviewDialog = ({
  plot,
  isOpen,
  onOpenChange,
  getGenreIcon,
  getGenreLabel,
  onUseInStory
}: PlotPreviewDialogProps) => {
  if (!plot) return null;

  const events = plot.keyEvents?.split('\n').filter(e => e.trim()) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif flex items-center gap-2">
            <Icon name="BookOpen" size={24} />
            {plot.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {plot.genres && plot.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {plot.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="gap-1">
                    <Icon name={getGenreIcon(genre) as any} size={14} />
                    {getGenreLabel(genre)}
                  </Badge>
                ))}
              </div>
            )}

            {plot.description && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={18} className="text-primary" />
                  Описание
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {plot.description}
                </p>
              </div>
            )}

            {plot.mainConflict && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Flame" size={18} className="text-destructive" />
                  Основной конфликт
                </h3>
                <p className="text-sm leading-relaxed bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                  {plot.mainConflict}
                </p>
              </div>
            )}

            {events.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="ListChecks" size={18} className="text-primary" />
                  Ключевые события
                </h3>
                <div className="space-y-2">
                  {events.map((event, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {idx + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-0.5">{event}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plot.resolution && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Check" size={18} className="text-green-600" />
                  Развязка
                </h3>
                <p className="text-sm leading-relaxed bg-green-600/5 p-3 rounded-lg border border-green-600/20">
                  {plot.resolution}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {onUseInStory && (
          <div className="flex gap-2 pt-4 border-t">
            <Button className="flex-1 gap-2" onClick={onUseInStory}>
              <Icon name="Wand2" size={18} />
              Использовать в генераторе
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
