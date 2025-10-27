import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import func2url from '../../../backend/func2url.json';

const IMAGE_GEN_URL = func2url['generate-image'];

const ROLES = ['Главный герой', 'Второстепенный персонаж', 'Антагонист', 'Союзник', 'Наставник'];

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (character: {
    name: string;
    role: string;
    personality: string;
    avatar: string;
    scenes?: string;
    quotes?: string;
    ideas?: string;
    isMainCharacter?: boolean;
  }) => void;
}

export const CreateCharacterDialog = ({ isOpen, onClose, onSubmit }: CreateCharacterDialogProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Главный герой');
  const [personality, setPersonality] = useState('');
  const [scenes, setScenes] = useState('');
  const [quotes, setQuotes] = useState('');
  const [ideas, setIdeas] = useState('');
  const [appearance, setAppearance] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [age, setAge] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState('');
  
  const { toast } = useToast();

  const handleGenerateAvatar = async () => {
    if (!name.trim() || !appearance.trim()) {
      toast({
        title: 'Заполните поля',
        description: 'Укажите имя и внешность персонажа для генерации аватара',
        variant: 'destructive'
      });
      return;
    }

    setIsGeneratingAvatar(true);
    try {
      const genderText = gender === 'male' ? 'male' : 'female';
      const ageText = age ? `, ${age} years old` : '';
      
      const prompt = `Half-body portrait of ${genderText} character named ${name}${ageText}, ${appearance}, fantasy style, professional character art, highly detailed, 8k quality, cinematic lighting, sharp focus, artstation quality`;
      
      const response = await fetch(IMAGE_GEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      setGeneratedAvatar(data.url);
      
      toast({
        title: 'Аватар готов!',
        description: 'Портрет персонажа сгенерирован'
      });
    } catch (error) {
      console.error('Avatar generation error:', error);
      toast({
        title: 'Ошибка генерации',
        description: 'Не удалось создать аватар. Попробуйте ещё раз',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Имя персонажа обязательно',
        variant: 'destructive',
      });
      return;
    }

    if (!role.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Выберите роль персонажа',
        variant: 'destructive',
      });
      return;
    }

    onSubmit({
      name: name.trim(),
      role: role,
      personality: personality.trim(),
      avatar: generatedAvatar || '',
      scenes: scenes.trim(),
      quotes: quotes.trim(),
      ideas: ideas.trim(),
      isMainCharacter: role === 'Главный герой'
    });

    setName('');
    setRole('Главный герой');
    setPersonality('');
    setScenes('');
    setQuotes('');
    setIdeas('');
    setAppearance('');
    setAge('');
    setGeneratedAvatar('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-purple-900/90 border-purple-500/40">
        <DialogHeader>
          <DialogTitle className="text-purple-100">Создать персонажа</DialogTitle>
          <DialogDescription className="text-purple-300/70">
            Опишите вашего персонажа и сгенерируйте его портрет
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="char-name" className="text-purple-200">Имя персонажа *</Label>
            <Input
              id="char-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Герда"
              className="bg-black/20 border-purple-500/30 text-purple-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="char-role" className="text-purple-200">Роль *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="char-role" className="bg-black/20 border-purple-500/30 text-purple-100">
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="char-personality" className="text-purple-200">Описание персонажа</Label>
            <Textarea
              id="char-personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Опишите характер, историю, особенности..."
              rows={3}
              className="bg-black/20 border-purple-500/30 text-purple-100"
            />
          </div>

          <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 space-y-3">
            <div className="text-sm text-purple-200 font-semibold flex items-center gap-2">
              <Icon name="Sparkles" size={16} />
              Генерация портрета
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="char-gender" className="text-purple-200 text-sm">Пол</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
                  <SelectTrigger id="char-gender" className="bg-black/20 border-purple-500/30 text-purple-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="male">Мужской</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="char-age" className="text-purple-200 text-sm">Возраст (опционально)</Label>
                <Input
                  id="char-age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Например: 25"
                  className="bg-black/20 border-purple-500/30 text-purple-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-appearance" className="text-purple-200 text-sm">
                Внешность (для генерации)
              </Label>
              <Textarea
                id="char-appearance"
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Опишите внешность: цвет волос, глаз, стиль одежды..."
                rows={2}
                className="bg-black/20 border-purple-500/30 text-purple-100 text-sm"
              />
            </div>

            <Button 
              onClick={handleGenerateAvatar}
              disabled={isGeneratingAvatar || !name.trim() || !appearance.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGeneratingAvatar ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Генерирую портрет...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  Сгенерировать аватар
                </>
              )}
            </Button>

            {generatedAvatar && (
              <div className="mt-3 rounded-lg overflow-hidden border-2 border-purple-500/50">
                <img 
                  src={generatedAvatar} 
                  alt="Generated avatar"
                  className="w-full aspect-square object-cover"
                />
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 space-y-3">
            <div className="text-sm text-purple-200 font-semibold">Живой NPC — идеи для ИИ</div>
            
            <div className="space-y-2">
              <Label htmlFor="char-scenes" className="text-purple-200 text-sm">Сцены</Label>
              <Textarea
                id="char-scenes"
                value={scenes}
                onChange={(e) => setScenes(e.target.value)}
                placeholder="Например: 'Встреча в таверне — защищает игрока'"
                rows={2}
                className="bg-black/20 border-purple-500/30 text-purple-100 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-quotes" className="text-purple-200 text-sm">Фразы и цитаты</Label>
              <Textarea
                id="char-quotes"
                value={quotes}
                onChange={(e) => setQuotes(e.target.value)}
                placeholder="Например: 'Клянусь, я отомщу!'"
                rows={2}
                className="bg-black/20 border-purple-500/30 text-purple-100 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-ideas" className="text-purple-200 text-sm">Идеи для развития</Label>
              <Textarea
                id="char-ideas"
                value={ideas}
                onChange={(e) => setIdeas(e.target.value)}
                placeholder="Например: 'Влюбляется в героя'"
                rows={2}
                className="bg-black/20 border-purple-500/30 text-purple-100 text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Создать персонажа
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
