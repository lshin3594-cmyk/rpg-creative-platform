import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AppearanceFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const AppearanceField = ({ value, onChange }: AppearanceFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="char-appearance" className="text-indigo-300 font-semibold flex items-center gap-2">
        <Icon name="Eye" size={16} />
        Внешность
      </Label>
      <Textarea
        id="char-appearance"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Опишите внешность: волосы, глаза, одежда, особенности...&#10;Например: длинные серебристые волосы, изумрудные глаза, шрам на левой щеке, военная форма"
        rows={5}
        className="bg-indigo-950/30 border-indigo-600/40 text-indigo-50 placeholder:text-indigo-300/50 text-base focus:border-indigo-400 focus:ring-indigo-400/50 resize-none"
      />
    </div>
  );
};
