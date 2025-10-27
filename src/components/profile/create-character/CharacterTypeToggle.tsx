import Icon from '@/components/ui/icon';

interface CharacterTypeToggleProps {
  isMainCharacter: boolean;
  onToggle: (value: boolean) => void;
}

export const CharacterTypeToggle = ({ isMainCharacter, onToggle }: CharacterTypeToggleProps) => {
  return (
    <div className="p-4 rounded-xl bg-purple-800/40 border-2 border-purple-500/50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-purple-100 font-semibold mb-1">Тип персонажа</p>
          <p className="text-xs text-purple-300/70">
            {isMainCharacter ? "Главный герой — протагонист истории" : "NPC — второстепенный персонаж"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold transition-colors ${!isMainCharacter ? 'text-blue-400' : 'text-purple-500'}`}>
            NPC
          </span>
          <button
            type="button"
            onClick={() => onToggle(!isMainCharacter)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isMainCharacter ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-blue-600'
            }`}
          >
            <div 
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                isMainCharacter ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-bold transition-colors ${isMainCharacter ? 'text-yellow-400' : 'text-purple-500'}`}>
            <Icon name="Star" size={16} className="inline mr-1" />
            ГЕРОЙ
          </span>
        </div>
      </div>
    </div>
  );
};
