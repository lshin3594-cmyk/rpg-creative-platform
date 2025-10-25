import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ActionInputModesProps {
  onSubmit: (action: string, dialogue?: string) => void;
  isGenerating: boolean;
  mode: 'free' | 'structured';
  onModeChange: (mode: 'free' | 'structured') => void;
}

export const ActionInputModes = ({
  onSubmit,
  isGenerating,
  mode,
  onModeChange
}: ActionInputModesProps) => {
  const [freeText, setFreeText] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [dialogue, setDialogue] = useState('');

  const quickActions = [
    { id: 'attack', icon: 'Swords', text: 'Атаковать', description: 'Я атакую' },
    { id: 'defend', icon: 'Shield', text: 'Защититься', description: 'Я принимаю оборонительную позицию' },
    { id: 'talk', icon: 'MessageCircle', text: 'Поговорить', description: 'Я начинаю диалог' },
    { id: 'look', icon: 'Eye', text: 'Осмотреться', description: 'Я внимательно осматриваюсь' },
    { id: 'search', icon: 'Search', text: 'Исследовать', description: 'Я исследую окружение' },
    { id: 'retreat', icon: 'Footprints', text: 'Отступить', description: 'Я осторожно отступаю' },
    { id: 'hide', icon: 'EyeOff', text: 'Спрятаться', description: 'Я прячусь' },
    { id: 'run', icon: 'Zap', text: 'Бежать', description: 'Я бегу' },
    { id: 'help', icon: 'Heart', text: 'Помочь', description: 'Я предлагаю помощь' },
    { id: 'think', icon: 'Brain', text: 'Подумать', description: 'Я обдумываю ситуацию' },
    { id: 'use', icon: 'Package', text: 'Использовать предмет', description: 'Я использую предмет' },
    { id: 'cast', icon: 'Wand2', text: 'Сотворить заклинание', description: 'Я творю заклинание' }
  ];

  const handleFreeSubmit = () => {
    if (freeText.trim()) {
      onSubmit(freeText);
      setFreeText('');
    }
  };

  const handleStructuredSubmit = () => {
    const action = quickActions.find(a => a.id === selectedAction);
    if (!action) return;

    const fullAction = dialogue 
      ? `${action.description} и говорю: "${dialogue}"`
      : action.description;
    
    onSubmit(fullAction, dialogue);
    setSelectedAction('');
    setDialogue('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Режим ввода действий</Label>
        <RadioGroup 
          value={mode} 
          onValueChange={(v) => onModeChange(v as 'free' | 'structured')}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="mode-free" />
            <Label htmlFor="mode-free" className="text-sm cursor-pointer">Свободный текст</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="structured" id="mode-structured" />
            <Label htmlFor="mode-structured" className="text-sm cursor-pointer">Готовые действия</Label>
          </div>
        </RadioGroup>
      </div>

      {mode === 'free' ? (
        <div className="space-y-3 animate-fade-in">
          <Textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Примеры действий:
• Я подхожу к двери и пытаюсь её открыть
• Говорю незнакомцу: &quot;Что ты здесь делаешь?&quot;
• Достаю меч и осматриваюсь в поисках угрозы
• Прячусь за колонной и наблюдаю"
            className="min-h-[120px]"
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleFreeSubmit();
              }
            }}
          />
          <Button
            onClick={handleFreeSubmit}
            disabled={isGenerating || !freeText.trim()}
            className="w-full gap-2"
          >
            <Icon name="Send" size={16} />
            Продолжить (Ctrl+Enter)
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label className="text-sm">Выберите действие</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={selectedAction === action.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedAction(action.id)}
                  disabled={isGenerating}
                  className="justify-start gap-2 h-auto py-2"
                >
                  <Icon name={action.icon as any} size={16} className="flex-shrink-0" />
                  <span className="text-xs">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {selectedAction && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="dialogue" className="text-sm">Слова персонажа (опционально)</Label>
              <Input
                id="dialogue"
                value={dialogue}
                onChange={(e) => setDialogue(e.target.value)}
                placeholder='Например: "Привет! Как дела?"'
                disabled={isGenerating}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleStructuredSubmit();
                  }
                }}
              />
            </div>
          )}

          <Button
            onClick={handleStructuredSubmit}
            disabled={isGenerating || !selectedAction}
            className="w-full gap-2"
          >
            <Icon name="Send" size={16} />
            Продолжить
          </Button>
        </div>
      )}
    </div>
  );
};