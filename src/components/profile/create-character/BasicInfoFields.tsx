import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface BasicInfoFieldsProps {
  name: string;
  gender: 'male' | 'female' | '';
  age: string;
  race: string;
  role: string;
  onNameChange: (value: string) => void;
  onGenderChange: (value: 'male' | 'female') => void;
  onAgeChange: (value: string) => void;
  onRaceChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

export const BasicInfoFields = ({
  name,
  gender,
  age,
  race,
  role,
  onNameChange,
  onGenderChange,
  onAgeChange,
  onRaceChange,
  onRoleChange
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="char-name" className="text-blue-300 font-semibold flex items-center gap-2">
          <Icon name="User" size={16} />
          Имя персонажа *
        </Label>
        <Input
          id="char-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Например: Герда Снежная"
          className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 h-12 text-base focus:border-blue-400 focus:ring-blue-400/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="char-gender" className="text-pink-300 font-semibold flex items-center gap-2">
          <Icon name="Users" size={16} />
          Пол *
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onGenderChange('male')}
            className={`h-12 rounded-lg border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
              gender === 'male'
                ? 'bg-blue-500/30 border-blue-400 text-blue-300 shadow-lg shadow-blue-500/30'
                : 'bg-purple-900/20 border-purple-500/30 text-purple-400 hover:border-blue-400/50'
            }`}
          >
            <Icon name="User" size={18} />
            Мужской
          </button>
          <button
            type="button"
            onClick={() => onGenderChange('female')}
            className={`h-12 rounded-lg border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
              gender === 'female'
                ? 'bg-pink-500/30 border-pink-400 text-pink-300 shadow-lg shadow-pink-500/30'
                : 'bg-purple-900/20 border-purple-500/30 text-purple-400 hover:border-pink-400/50'
            }`}
          >
            <Icon name="User" size={18} />
            Женский
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="char-age" className="text-green-300 font-semibold flex items-center gap-2">
            <Icon name="Calendar" size={16} />
            Возраст
          </Label>
          <Input
            id="char-age"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            placeholder="25"
            className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 h-12 text-base focus:border-green-400 focus:ring-green-400/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="char-race" className="text-orange-300 font-semibold flex items-center gap-2">
            <Icon name="Globe" size={16} />
            Раса
          </Label>
          <Input
            id="char-race"
            value={race}
            onChange={(e) => onRaceChange(e.target.value)}
            placeholder="Эльф, человек..."
            className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 h-12 text-base focus:border-orange-400 focus:ring-orange-400/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="char-role" className="text-cyan-300 font-semibold flex items-center gap-2">
          <Icon name="Briefcase" size={16} />
          Роль
        </Label>
        <Input
          id="char-role"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          placeholder="Воин, маг, торговец..."
          className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 h-12 text-base focus:border-cyan-400 focus:ring-cyan-400/50"
        />
      </div>
    </>
  );
};
