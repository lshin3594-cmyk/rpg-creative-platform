import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PlotSelectorProps {
  plots: Plot[];
  selectedPlot: string;
  setSelectedPlot?: (id: string) => void;
  showPlotDetails: boolean;
  setShowPlotDetails: (show: boolean) => void;
}

export const PlotSelector = ({
  plots,
  selectedPlot,
  setSelectedPlot,
  showPlotDetails,
  setShowPlotDetails
}: PlotSelectorProps) => {
  const selectedPlotData = plots.find(p => p.id === selectedPlot);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Выберите готовый сюжет или опишите свой</Label>
        {plots.length > 0 && (
          <div className="grid grid-cols-1 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSelectedPlot?.('')}
              className={`p-2 rounded-lg border-2 transition-all text-left text-sm ${
                !selectedPlot
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Icon name="Sparkles" size={14} className="inline mr-2" />
              Свободное описание
            </button>
            {plots.map((plot) => (
              <button
                key={plot.id}
                type="button"
                onClick={() => {
                  setSelectedPlot?.(plot.id);
                  setShowPlotDetails(true);
                }}
                className={`p-2 rounded-lg border-2 transition-all text-left hover:scale-[1.01] ${
                  selectedPlot === plot.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="BookOpen" size={14} />
                  <span className="font-medium text-sm">{plot.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{plot.description}</p>
              </button>
            ))}
          </div>
        )}
        
        {selectedPlot && selectedPlotData && showPlotDetails && (
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{selectedPlotData.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">{selectedPlotData.description}</CardDescription>
                </div>
                <button
                  onClick={() => setShowPlotDetails(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-primary">Конфликт:</span>
                <p className="text-muted-foreground mt-0.5">{selectedPlotData.mainConflict}</p>
              </div>
              <div>
                <span className="font-semibold text-primary">Ключевые события:</span>
                <p className="text-muted-foreground mt-0.5">{selectedPlotData.keyEvents}</p>
              </div>
              <div>
                <span className="font-semibold text-primary">Развязка:</span>
                <p className="text-muted-foreground mt-0.5">{selectedPlotData.resolution}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
