import { ScrollArea } from '@/components/ui/scroll-area';

interface EpisodesTimelineProps {
  currentEpisode: number;
}

export const EpisodesTimeline = ({ currentEpisode }: EpisodesTimelineProps) => {
  return (
    <div className="w-20 border-l bg-muted/20 flex flex-col items-center py-4 space-y-3">
      <div className="text-xs font-semibold text-muted-foreground rotate-0 writing-mode-vertical">
        ЭПИЗОДЫ
      </div>
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center space-y-2 px-2">
          {Array.from({ length: currentEpisode }, (_, i) => i + 1).map((ep) => (
            <button
              key={ep}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                ep === currentEpisode
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {ep}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
