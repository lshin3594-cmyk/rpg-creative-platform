import Icon from '@/components/ui/icon';

type LoadingStage = 'idle' | 'world' | 'story' | 'done';

interface LoadingStagesProps {
  loadingStage: LoadingStage;
  stageErrors: {world?: string; story?: string};
}

export function LoadingStages({ loadingStage, stageErrors }: LoadingStagesProps) {
  const stages = [
    { id: 'world', label: 'Создание мира', icon: 'Globe' as const },
    { id: 'story', label: 'Генерация истории', icon: 'BookOpen' as const }
  ];

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const isActive = loadingStage === stage.id;
        const isDone = ['world', 'story'].indexOf(loadingStage) > index || loadingStage === 'done';
        const hasError = stageErrors[stage.id as keyof typeof stageErrors];

        return (
          <div key={stage.id} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              hasError 
                ? 'bg-destructive/20 text-destructive' 
                : isDone 
                  ? 'bg-green-500/20 text-green-600' 
                  : isActive 
                    ? 'bg-primary/20 text-primary animate-pulse' 
                    : 'bg-muted text-muted-foreground'
            }`}>
              {hasError ? (
                <Icon name="AlertCircle" size={18} />
              ) : isDone ? (
                <Icon name="Check" size={18} />
              ) : (
                <Icon name={stage.icon} size={18} />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                hasError 
                  ? 'text-destructive' 
                  : isActive 
                    ? 'text-primary' 
                    : isDone 
                      ? 'text-green-600' 
                      : 'text-muted-foreground'
              }`}>
                {stage.label}
              </p>
              {hasError && (
                <p className="text-xs text-destructive/80 mt-1">{hasError}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
