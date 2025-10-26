import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Character {
  name: string;
  role: string;
  description: string;
  avatar?: string;
}

interface CreateCharacterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCharacterCreated: (character: Character) => void;
  gameSettings: {
    name: string;
    setting: string;
  };
}

export const CreateCharacterModal = ({ 
  open, 
  onOpenChange, 
  onCharacterCreated,
  gameSettings 
}: CreateCharacterModalProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [appearance, setAppearance] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [age, setAge] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<string>('');
  
  const { toast } = useToast();

  const generateAvatar = async () => {
    if (!name || !appearance) {
      toast({
        title: 'Заполните поля',
        description: 'Укажите имя и внешность персонажа для генерации',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      const genderText = gender === 'male' ? 'male' : 'female';
      const ageText = age ? `, ${age} years old` : '';
      const settingText = gameSettings.setting ? `in ${gameSettings.setting} setting` : 'fantasy style';
      
      const prompt = `Half-body portrait of ${genderText} character named ${name}${ageText}, ${appearance}, ${settingText}, professional character art, highly detailed, 8k quality, cinematic lighting, sharp focus, artstation quality`;
      
      const response = await fetch('https://functions.poehali.dev/16a136ce-ff21-4430-80df-ad1caa87a3a7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      setGeneratedAvatar(data.url);
      
      toast({
        title: 'Изображение готово!',
        description: 'Аватар персонажа сгенерирован'
      });
    } catch (error) {
      console.error('Avatar generation error:', error);
      toast({
        title: 'Ошибка генерации',
        description: 'Не удалось создать изображение. Попробуйте ещё раз.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreate = () => {
    if (!name.trim() || !role.trim()) {
      toast({
        title: 'Заполните поля',
        description: 'Имя и роль обязательны',
        variant: 'destructive'
      });
      return;
    }

    const character: Character = {
      name: name.trim(),
      role: role.trim(),
      description: description.trim(),
      avatar: generatedAvatar
    };

    onCharacterCreated(character);
    
    setName('');
    setRole('');
    setDescription('');
    setAppearance('');
    setGeneratedAvatar('');
    onOpenChange(false);

    toast({
      title: 'Персонаж создан!',
      description: `${character.name} добавлен в историю`
    });
  };

  const randomNames = {
    male: ['Александр', 'Дмитрий', 'Максим', 'Артём', 'Иван', 'Николай', 'Виктор', 'Андрей'],
    female: ['Анна', 'Мария', 'Екатерина', 'Ольга', 'Елена', 'Наталья', 'Дарья', 'София']
  };

  const generateRandomName = () => {
    const names = randomNames[gender];
    setName(names[Math.floor(Math.random() * names.length)]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="UserPlus" size={24} className="text-primary" />
            Создание персонажа
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Левая колонка - Форма */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Icon name="Users" size={16} className="text-primary" />
                Пол
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={gender === 'male' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setGender('male')}
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Мужской
                </Button>
                <Button
                  type="button"
                  variant={gender === 'female' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setGender('female')}
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Женский
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-age" className="flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                Возраст
              </Label>
              <Input
                id="char-age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Например: 25 лет"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-name">Имя персонажа</Label>
              <div className="flex gap-2">
                <Input
                  id="char-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите имя"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateRandomName}
                  title="Случайное имя"
                >
                  <Icon name="Sparkles" size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-role">Роль / Профессия</Label>
              <Input
                id="char-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Например: Преподаватель химии"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-appearance">Внешность</Label>
              <Textarea
                id="char-appearance"
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Опишите внешность для генерации изображения"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-desc">Описание и характер</Label>
              <Textarea
                id="char-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Характер, история, особенности..."
                rows={4}
              />
            </div>
          </div>

          {/* Правая колонка - Превью */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              {generatedAvatar ? (
                <img 
                  src={generatedAvatar} 
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <Icon name="Image" size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Аватар персонажа</p>
                  <p className="text-xs mt-1">Заполните форму и нажмите "Сгенерировать"</p>
                </div>
              )}
            </div>

            <Button
              className="w-full gap-2"
              onClick={generateAvatar}
              disabled={isGenerating || !name || !appearance}
              variant="secondary"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={16} />
                  Сгенерировать изображение
                </>
              )}
            </Button>

            {generatedAvatar && (
              <Button
                className="w-full gap-2"
                onClick={generateAvatar}
                variant="outline"
              >
                <Icon name="RefreshCw" size={16} />
                Перегенерировать
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!name.trim() || !role.trim()}
            className="ml-auto gap-2"
          >
            <Icon name="Check" size={16} />
            Создать персонажа
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};