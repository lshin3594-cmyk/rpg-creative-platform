import { Label } from '@/components/ui/label';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string;
}

interface CharacterWorldSelectorsProps {
  selectedCharacter: string;
  setSelectedCharacter: (id: string) => void;
  selectedWorld: string;
  setSelectedWorld: (id: string) => void;
  characters: Character[];
  worlds: World[];
}

export const CharacterWorldSelectors = ({
  selectedCharacter,
  setSelectedCharacter,
  selectedWorld,
  setSelectedWorld,
  characters,
  worlds
}: CharacterWorldSelectorsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="character-select">Персонаж (опционально)</Label>
        <select
          id="character-select"
          className="w-full px-3 py-2 bg-background border border-input rounded-md"
          value={selectedCharacter}
          onChange={(e) => setSelectedCharacter(e.target.value)}
        >
          <option value="">Без персонажа</option>
          {characters.map((char) => (
            <option key={char.id} value={char.id}>{char.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="world-select">Мир (опционально)</Label>
        <select
          id="world-select"
          className="w-full px-3 py-2 bg-background border border-input rounded-md"
          value={selectedWorld}
          onChange={(e) => setSelectedWorld(e.target.value)}
        >
          <option value="">Без мира</option>
          {worlds.map((world) => (
            <option key={world.id} value={world.id}>{world.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
