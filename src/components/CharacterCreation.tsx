import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface CharacterCreationProps {
  templateTitle: string;
  templateSetting: string;
  onComplete: (character: CharacterData) => void;
  onBack: () => void;
}

export interface CharacterData {
  name: string;
  gender: 'male' | 'female' | 'other';
  description: string;
}

const genderOptions = [
  { value: 'male' as const, label: 'Мужчина', icon: 'User' },
  { value: 'female' as const, label: 'Женщина', icon: 'UserRound' },
  { value: 'other' as const, label: 'Другое', icon: 'Users' }
];

export function CharacterCreation({ templateTitle, templateSetting, onComplete, onBack }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onComplete({
      name: name.trim(),
      gender,
      description: description.trim() || 'Обычный человек с необычной судьбой'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-primary/10"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к выбору истории
        </Button>

        <div className="bg-black/40 backdrop-blur-md border-2 border-primary/30 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Icon name="UserCircle" size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Создание персонажа</h1>
              <p className="text-muted-foreground">{templateTitle}</p>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 mb-6 border border-primary/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {templateSetting.slice(0, 200)}...
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Имя персонажа *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Алекс, Мария, Кай..."
                className="bg-black/40 border-primary/30 focus:border-primary text-foreground"
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Пол *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGender(option.value)}
                    className={`
                      p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                      ${gender === option.value
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-black/20 border-primary/30 text-muted-foreground hover:border-primary/50 hover:bg-primary/5'
                      }
                    `}
                  >
                    <Icon name={option.icon} size={24} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Описание персонажа <span className="text-muted-foreground">(необязательно)</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опиши внешность, характер, навыки... Например: Смелая девушка с рыжими волосами, хакер-самоучка, не доверяет властям"
                className="min-h-[120px] bg-black/40 border-primary/30 focus:border-primary text-foreground resize-none"
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Это поможет AI лучше подстроить историю под твоего персонажа
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 border-primary/40 hover:bg-primary/10"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/20"
            >
              <Icon name="Play" size={18} className="mr-2" />
              Начать историю
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
