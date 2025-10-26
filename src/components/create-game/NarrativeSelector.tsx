import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface NarrativeSelectorProps {
  narrativeMode: 'first' | 'third' | 'love-interest';
  setNarrativeMode: (mode: 'first' | 'third' | 'love-interest') => void;
}

export const NarrativeSelector = ({ narrativeMode, setNarrativeMode }: NarrativeSelectorProps) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
      <Label className="text-purple-100 text-base mb-4 block">
        Стиль повествования
      </Label>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setNarrativeMode('first')}
          className={`
            p-3 rounded-lg border-2 transition-all text-center
            ${
              narrativeMode === 'first'
                ? 'border-purple-400 bg-purple-500/30'
                : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
            }
          `}
        >
          <Icon name="Eye" size={18} className="text-purple-300 mx-auto mb-2" />
          <span className="text-sm font-semibold text-purple-100 block">От первого лица</span>
          <p className="text-xs text-purple-200/60 mt-1">«Я вижу...»</p>
        </button>
        <button
          onClick={() => setNarrativeMode('third')}
          className={`
            p-3 rounded-lg border-2 transition-all text-center
            ${
              narrativeMode === 'third'
                ? 'border-purple-400 bg-purple-500/30'
                : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
            }
          `}
        >
          <Icon name="Users" size={18} className="text-purple-300 mx-auto mb-2" />
          <span className="text-sm font-semibold text-purple-100 block">От третьего лица</span>
          <p className="text-xs text-purple-200/60 mt-1">«Он видит...»</p>
        </button>
        <button
          onClick={() => setNarrativeMode('love-interest')}
          className={`
            p-3 rounded-lg border-2 transition-all text-center
            ${
              narrativeMode === 'love-interest'
                ? 'border-purple-400 bg-purple-500/30'
                : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
            }
          `}
        >
          <Icon name="Heart" size={18} className="text-purple-300 mx-auto mb-2" />
          <span className="text-sm font-semibold text-purple-100 block">Романтика</span>
          <p className="text-xs text-purple-200/60 mt-1">От 2-го лица</p>
        </button>
      </div>
    </div>
  );
};
