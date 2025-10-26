import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface RoleSelectorProps {
  role: 'hero' | 'author';
  setRole: (role: 'hero' | 'author') => void;
}

export const RoleSelector = ({ role, setRole }: RoleSelectorProps) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
      <Label className="text-purple-100 text-base mb-4 block">
        Ваша роль в игре
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setRole('hero')}
          className={`
            p-4 rounded-lg border-2 transition-all text-left
            ${
              role === 'hero'
                ? 'border-purple-400 bg-purple-500/30'
                : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
            }
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon name="User" size={20} className="text-purple-300" />
            <span className="font-bold text-purple-100">Герой</span>
          </div>
          <p className="text-xs text-purple-200/70">
            Вы управляете главным персонажем, ИИ ведёт сюжет и NPC
          </p>
        </button>
        <button
          onClick={() => setRole('author')}
          className={`
            p-4 rounded-lg border-2 transition-all text-left
            ${
              role === 'author'
                ? 'border-purple-400 bg-purple-500/30'
                : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
            }
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Feather" size={20} className="text-purple-300" />
            <span className="font-bold text-purple-100">Автор</span>
          </div>
          <p className="text-xs text-purple-200/70">
            Вы управляете историей и всеми персонажами
          </p>
        </button>
      </div>
    </div>
  );
};
