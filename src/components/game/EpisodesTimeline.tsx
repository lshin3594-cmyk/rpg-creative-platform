import { ScrollArea } from '@/components/ui/scroll-area';

interface EpisodesTimelineProps {
  currentEpisode: number;
}

export const EpisodesTimeline = ({ currentEpisode }: EpisodesTimelineProps) => {
  return (
    <div className="w-20 border-l border-primary/20 bg-black/40 backdrop-blur-sm flex flex-col items-center py-4 space-y-3 relative z-10">
      <div className="text-xs font-semibold text-muted-foreground rotate-0 writing-mode-vertical">
        ЭПИЗОДЫ
      </div>
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center space-y-2 px-2">
          {Array.from({ length: currentEpisode }, (_, i) => i + 1).map((ep) => (
            <button
              key={ep}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                ep === currentEpisode
                  ? 'bg-primary border-primary text-black shadow-lg shadow-primary/50'
                  : 'bg-black/60 border-primary/30 hover:border-primary/60 text-muted-foreground hover:text-foreground'
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