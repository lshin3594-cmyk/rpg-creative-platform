import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SettingInputProps {
  setting: string;
  setSetting: (setting: string) => void;
}

export const SettingInput = ({ setting, setSetting }: SettingInputProps) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
      <div className="space-y-2 mb-4">
        <Label htmlFor="setting" className="text-purple-100 text-base">
          Опишите сеттинг игры
        </Label>
        <p className="text-xs text-purple-300/60 leading-relaxed">
          Опишите мир, атмосферу, начальную ситуацию. Можно добавлять идеи про NPC:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-1.5 text-purple-200/80">
            <span>📽️</span>
            <div>
              <span className="font-semibold">Сцены:</span>
              <span className="text-purple-300/60 block">"Встреча в таверне — NPC защищает игрока"</span>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-purple-200/80">
            <span>💬</span>
            <div>
              <span className="font-semibold">Цитаты:</span>
              <span className="text-purple-300/60 block">"Клянусь, я отомщу!"</span>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-purple-200/80">
            <span>✨</span>
            <div>
              <span className="font-semibold">Идеи:</span>
              <span className="text-purple-300/60 block">"NPC влюбляется в героя"</span>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-purple-200/80">
            <span>💖</span>
            <div>
              <span className="font-semibold">Отношение:</span>
              <span className="text-purple-300/60 block">"Грубость нравится NPC"</span>
            </div>
          </div>
        </div>
      </div>
      <Textarea
        id="setting"
        value={setting}
        onChange={(e) => setSetting(e.target.value)}
        placeholder="Тёмный лес, старая таверна. В углу сидит загадочный незнакомец в капюшоне.&#10;&#10;NPC 'Кира' — молодая воровка, циничная и дерзкая. Цитата: 'Доверяй, но проверяй'. Идея: NPC влюбляется в героя, но скрывает это. Отношение: грубость и сарказм ей нравятся, она сама такая.&#10;&#10;Опиши любые детали, которые хочешь увидеть!"
        className="min-h-[220px] resize-none bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
      />
      <div className="mt-3 text-xs text-purple-300/60">
        💡 ИИ поймёт ваши идеи и создаст живых NPC, которые реагируют на ваши решения
      </div>
    </div>
  );
};