import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface NPCSettingsProps {
  autoGenerateNPCs: boolean;
  setAutoGenerateNPCs?: (value: boolean) => void;
  npcCount: number;
  setNpcCount?: (value: number) => void;
  npcTypes: string[];
  setNpcTypes?: (value: string[]) => void;
}

export const NPCSettings = ({
  autoGenerateNPCs,
  setAutoGenerateNPCs,
  npcCount,
  setNpcCount,
  npcTypes,
  setNpcTypes
}: NPCSettingsProps) => {
  const availableNpcTypes = [
    { value: 'ally', label: 'Союзник', icon: 'Users', description: 'Помогает главному герою' },
    { value: 'rival', label: 'Соперник', icon: 'Swords', description: 'Конкурирует за цели' },
    { value: 'mentor', label: 'Наставник', icon: 'GraduationCap', description: 'Обучает и направляет' },
    { value: 'love_interest', label: 'Любовный интерес', icon: 'Heart', description: 'Романтический персонаж' },
    { value: 'antagonist', label: 'Антагонист', icon: 'Skull', description: 'Противостоит герою' },
    { value: 'comic_relief', label: 'Комический', icon: 'Laugh', description: 'Разряжает обстановку' },
    { value: 'mysterious', label: 'Загадочный', icon: 'Eye', description: 'Скрывает тайны' },
    { value: 'merchant', label: 'Торговец', icon: 'ShoppingBag', description: 'Продает товары/услуги' },
  ];

  const toggleNpcType = (type: string) => {
    if (!setNpcTypes) return;
    if (npcTypes.includes(type)) {
      setNpcTypes(npcTypes.filter(t => t !== type));
    } else {
      setNpcTypes([...npcTypes, type]);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Icon name="Users" size={16} className="text-primary" />
            Автогенерация NPC
          </Label>
          <p className="text-xs text-muted-foreground">
            ИИ создаст дополнительных персонажей для истории
          </p>
        </div>
        <Switch
          checked={autoGenerateNPCs}
          onCheckedChange={setAutoGenerateNPCs}
        />
      </div>

      {autoGenerateNPCs && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Количество NPC</Label>
              <span className="text-sm font-semibold text-primary">{npcCount}</span>
            </div>
            <Slider
              value={[npcCount]}
              onValueChange={(value) => setNpcCount?.(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Рекомендуется 2-3 персонажа для оптимального баланса
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Типы NPC (опционально)</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableNpcTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleNpcType(type.value)}
                  className={`p-2.5 rounded-lg border-2 transition-all text-left text-xs hover:scale-[1.02] ${
                    npcTypes.includes(type.value)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={type.icon as any} size={14} className="text-primary" />
                    <span className="font-semibold">{type.label}</span>
                  </div>
                  <p className="text-muted-foreground text-[10px] leading-tight">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Не выбрано = ИИ определит типы автоматически
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
