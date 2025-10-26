import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Character {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  personality?: string;
}

interface CharacterSelectorProps {
  availableCharacters: Character[];
  selectedCharacterIds: number[];
  loadingCharacters: boolean;
  showCharactersList: boolean;
  setShowCharactersList: (show: boolean) => void;
  toggleCharacter: (id: number) => void;
}

export const CharacterSelector = ({
  availableCharacters,
  selectedCharacterIds,
  loadingCharacters,
  showCharactersList,
  setShowCharactersList,
  toggleCharacter
}: CharacterSelectorProps) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <Label className="text-purple-100 text-base">
            Персонажи (необязательно)
          </Label>
          {selectedCharacterIds.length > 0 && (
            <span className="text-purple-300/70 text-sm">
              Выбрано: {selectedCharacterIds.length}
            </span>
          )}
        </div>
        <p className="text-xs text-purple-300/60">
          <Icon name="Info" size={12} className="inline mr-1" />
          Первый персонаж — главный герой (вами управляется). Остальные — NPC, которых ИИ создаст в мире.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {selectedCharacterIds.map((charId, index) => {
          const char = availableCharacters.find(c => c.id === charId);
          if (!char) return null;
          const isMainCharacter = index === 0;
          return (
            <div key={char.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              isMainCharacter 
                ? 'bg-primary/40 border-primary ring-2 ring-primary/30' 
                : 'bg-purple-500/30 border-purple-400'
            }`}>
              {isMainCharacter && (
                <Icon name="Star" size={12} className="text-yellow-400 fill-yellow-400" />
              )}
              {char.avatar && (
                <img src={char.avatar} alt={char.name} className="w-8 h-8 rounded-full object-cover" />
              )}
              <div className="flex flex-col">
                <span className="text-sm text-purple-100">{char.name}</span>
                {isMainCharacter && (
                  <span className="text-xs text-purple-300/70">Главный герой</span>
                )}
              </div>
              <button
                onClick={() => toggleCharacter(char.id)}
                className="ml-1 hover:text-red-400 transition-colors"
              >
                <Icon name="X" size={14} className="text-purple-300" />
              </button>
            </div>
          );
        })}
        
        <button
          onClick={() => setShowCharactersList(!showCharactersList)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-purple-500/40 hover:border-purple-400 bg-black/20 hover:bg-purple-500/10 transition-all text-purple-300 hover:text-purple-100"
        >
          <Icon name="Plus" size={20} />
          <span className="text-sm">Добавить персонажа</span>
        </button>
      </div>

      {showCharactersList && (
        <div className="mt-4 p-4 rounded-lg bg-black/40 border border-purple-500/30">
          {loadingCharacters ? (
            <div className="text-center py-8">
              <Icon name="Loader2" size={32} className="mx-auto mb-2 animate-spin text-purple-400" />
              <p className="text-purple-300/60 text-sm">Загрузка персонажей...</p>
            </div>
          ) : availableCharacters.length === 0 ? (
            <div className="text-center py-8 text-purple-300/60 text-sm">
              <Icon name="Users" size={40} className="mx-auto mb-2 opacity-40" />
              <p>Нет сохранённых персонажей</p>
              <p className="text-xs mt-1">Создайте их в библиотеке персонажей</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {availableCharacters
                .filter(char => !selectedCharacterIds.includes(char.id))
                .map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    toggleCharacter(char.id);
                    setShowCharactersList(false);
                  }}
                  className="p-3 rounded-lg border border-purple-500/30 bg-black/20 hover:border-purple-400 hover:bg-purple-500/20 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    {char.avatar && (
                      <img src={char.avatar} alt={char.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-purple-100 truncate">{char.name}</h4>
                      <p className="text-xs text-purple-300/70">{char.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};