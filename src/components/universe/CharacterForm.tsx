import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CharacterFormData {
  name: string;
  age: string;
  gender: string;
  appearance: string;
  personality: string;
  background: string;
  abilities: string;
  strengths: string;
  weaknesses: string;
  goals: string;
  role: 'main' | 'supporting' | 'antagonist';
}

interface CharacterFormProps {
  onSubmit: (data: CharacterFormData) => void;
  isLoading?: boolean;
}

export const CharacterForm = ({ onSubmit, isLoading = false }: CharacterFormProps) => {
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    age: '',
    gender: '',
    appearance: '',
    personality: '',
    background: '',
    abilities: '',
    strengths: '',
    weaknesses: '',
    goals: '',
    role: 'main'
  });

  const updateField = (field: keyof CharacterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.name.trim() && formData.personality.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" size={20} />
            Основная информация
          </CardTitle>
          <CardDescription>
            Базовые данные о персонаже
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя персонажа *</Label>
              <Input
                id="name"
                placeholder="Например: Гарри Поттер"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Возраст</Label>
              <Input
                id="age"
                placeholder="Например: 17 лет"
                value={formData.age}
                onChange={(e) => updateField('age', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Пол</Label>
              <Input
                id="gender"
                placeholder="Например: мужской"
                value={formData.gender}
                onChange={(e) => updateField('gender', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль в истории</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'main' | 'supporting' | 'antagonist') => updateField('role', value)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Главный герой</SelectItem>
                  <SelectItem value="supporting">Второстепенный персонаж</SelectItem>
                  <SelectItem value="antagonist">Антагонист</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Eye" size={20} />
            Внешность
          </CardTitle>
          <CardDescription>
            Описание внешнего вида персонажа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="appearance">Описание внешности</Label>
            <Textarea
              id="appearance"
              placeholder="Например: Высокий юноша с чёрными волосами и зелёными глазами, носит круглые очки и шрам в форме молнии на лбу"
              value={formData.appearance}
              onChange={(e) => updateField('appearance', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Heart" size={20} />
            Характер и личность
          </CardTitle>
          <CardDescription>
            Психологический портрет персонажа
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personality">Характер *</Label>
            <Textarea
              id="personality"
              placeholder="Например: Храбрый, верный друзьям, иногда импульсивный. Готов жертвовать собой ради других"
              value={formData.personality}
              onChange={(e) => updateField('personality', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="background">Предыстория</Label>
            <Textarea
              id="background"
              placeholder="Например: Вырос у тёти и дяди, потерял родителей в младенчестве, узнал о своём волшебном наследии в 11 лет"
              value={formData.background}
              onChange={(e) => updateField('background', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Цели и мотивация</Label>
            <Textarea
              id="goals"
              placeholder="Например: Победить Волан-де-Морта, защитить друзей, понять свою судьбу"
              value={formData.goals}
              onChange={(e) => updateField('goals', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Zap" size={20} />
            Способности и навыки
          </CardTitle>
          <CardDescription>
            Сильные и слабые стороны персонажа
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="abilities">Способности</Label>
            <Textarea
              id="abilities"
              placeholder="Например: Магия, парселтанг (язык змей), полёты на метле, защита от тёмных искусств"
              value={formData.abilities}
              onChange={(e) => updateField('abilities', e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strengths">Сильные стороны</Label>
              <Textarea
                id="strengths"
                placeholder="Например: Храбрость, лояльность, интуиция"
                value={formData.strengths}
                onChange={(e) => updateField('strengths', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weaknesses">Слабые стороны</Label>
              <Textarea
                id="weaknesses"
                placeholder="Например: Импульсивность, склонность к самопожертвованию"
                value={formData.weaknesses}
                onChange={(e) => updateField('weaknesses', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
              Создание...
            </>
          ) : (
            <>
              <Icon name="Check" size={18} className="mr-2" />
              Создать персонажа
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
