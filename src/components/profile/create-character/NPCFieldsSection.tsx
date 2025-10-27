import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface NPCFieldsSectionProps {
  scenes: string;
  quotes: string;
  ideas: string;
  onScenesChange: (value: string) => void;
  onQuotesChange: (value: string) => void;
  onIdeasChange: (value: string) => void;
}

export const NPCFieldsSection = ({
  scenes,
  quotes,
  ideas,
  onScenesChange,
  onQuotesChange,
  onIdeasChange
}: NPCFieldsSectionProps) => {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-900/20 via-orange-900/10 to-yellow-900/20 border border-yellow-500/30 space-y-4">
      <div className="flex items-center gap-2">
        <Icon name="Lightbulb" size={20} className="text-yellow-400" />
        <h3 className="text-lg font-bold text-yellow-300">ЖИВОЙ NPC — ИДЕИ ДЛЯ ИИ</h3>
      </div>
      <p className="text-sm text-yellow-200/80">
        Опишите сцены, цитаты и идеи — ИИ поймёт характер NPC и создаст его реакции на ваши решения
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="char-scenes" className="text-yellow-300 font-semibold flex items-center gap-2">
            <Icon name="Film" size={16} />
            Сцены с участием NPC
          </Label>
          <Textarea
            id="char-scenes"
            value={scenes}
            onChange={(e) => onScenesChange(e.target.value)}
            placeholder="Например: 'Встреча в таверне — NPC защищает игрока от бандитов' или 'Предательство — NPC уходит к врагам'"
            rows={4}
            className="bg-yellow-950/30 border-yellow-600/40 text-yellow-50 placeholder:text-yellow-300/50 text-base focus:border-yellow-400 focus:ring-yellow-400/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="char-quotes" className="text-yellow-300 font-semibold flex items-center gap-2">
            <Icon name="MessageSquare" size={16} />
            Фразы и цитаты NPC
          </Label>
          <Textarea
            id="char-quotes"
            value={quotes}
            onChange={(e) => onQuotesChange(e.target.value)}
            placeholder="Например: 'Клянусь, я отомщу за них!' или 'Доверие? Я уже давно его потеряла.'"
            rows={4}
            className="bg-yellow-950/30 border-yellow-600/40 text-yellow-50 placeholder:text-yellow-300/50 text-base focus:border-yellow-400 focus:ring-yellow-400/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="char-ideas" className="text-yellow-300 font-semibold flex items-center gap-2">
            <Icon name="Sparkles" size={16} />
            Идеи для развития
          </Label>
          <Textarea
            id="char-ideas"
            value={ideas}
            onChange={(e) => onIdeasChange(e.target.value)}
            placeholder="Например: 'Влюбляется в героя' или 'Имеет тайну из прошлого'"
            rows={4}
            className="bg-yellow-950/30 border-yellow-600/40 text-yellow-50 placeholder:text-yellow-300/50 text-base focus:border-yellow-400 focus:ring-yellow-400/50 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
