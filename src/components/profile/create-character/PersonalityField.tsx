import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface PersonalityFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const PersonalityField = ({ value, onChange }: PersonalityFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="char-personality" className="text-purple-300 font-semibold flex items-center gap-2">
        <Icon name="Heart" size={16} />
        Описание характера
      </Label>
      <Textarea
        id="char-personality"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Опишите характер, предыстория, мотивацию, особенности поведения...&#10;Например: хладнокровная воительница, потерявшая семью в войне. Не доверяет незнакомцам, но верна союзникам до конца."
        rows={6}
        className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 text-base focus:border-blue-400 focus:ring-blue-400/50 resize-none"
      />
    </div>
  );
};
