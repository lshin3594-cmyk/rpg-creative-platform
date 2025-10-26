import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SettingInputProps {
  setting: string;
  setSetting: (setting: string) => void;
}

export const SettingInput = ({ setting, setSetting }: SettingInputProps) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
      <Label htmlFor="setting" className="text-purple-100 text-base mb-4 block">
        Опишите сеттинг игры
      </Label>
      <Textarea
        id="setting"
        value={setting}
        onChange={(e) => setSetting(e.target.value)}
        placeholder="Опишите мир, атмосферу, начальную ситуацию... Без ограничений!"
        className="min-h-[200px] resize-none bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
      />
      <div className="mt-3 flex justify-between items-center text-sm">
        <span className="text-purple-300/70">{setting.length} символов</span>
        {setting.length === 0 && (
          <span className="text-purple-300/70">
            💡 Чем подробнее опишешь - тем лучше ИИ поймёт
          </span>
        )}
      </div>
    </div>
  );
};
