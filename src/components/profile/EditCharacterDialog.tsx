import { useState, useEffect } from 'react';
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
import type { Character } from './CharactersList';
import func2url from '../../../backend/func2url.json';

const IMAGE_GEN_URL = func2url['generate-image'];

interface EditCharacterDialogProps {
  character: Character | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const ROLES = ['Главный герой', 'Второстепенный персонаж', 'Антагонист', 'Союзник', 'Наставник'];

export const EditCharacterDialog = ({ character, open, onOpenChange, onSave }: EditCharacterDialogProps) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState('');
  const [race, setRace] = useState('');
  const [role, setRole] = useState('');
  const [appearance, setAppearance] = useState('');
  const [personality, setPersonality] = useState('');
  const [scenes, setScenes] = useState('');
  const [quotes, setQuotes] = useState('');
  const [ideas, setIdeas] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { toast } = useToast();

  const handleGenerateAvatar = async () => {
    if (!gender) {
      toast({
        title: 'Укажите пол',
        description: 'Выберите пол персонажа для генерации',
        variant: 'destructive'
      });
      return;
    }
    
    if (!appearance.trim()) {
      toast({
        title: 'Заполните внешность',
        description: 'Опишите внешность персонажа для генерации аватара',
        variant: 'destructive'
      });
      return;
    }

    setIsGeneratingAvatar(true);
    try {
      const timestamp = Date.now();
      
      const genderEn = gender === 'male' ? 'man' : 'woman';
      const appearanceClean = appearance.trim() || 'face portrait';
      const prompt = `Portrait of ${genderEn}. ${appearanceClean}. Professional headshot, neutral face, SFW`;
      
      const response = await fetch(IMAGE_GEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = data.url;
      
      setGeneratedAvatar(imageUrl);
      
      toast({
        title: 'Аватар сгенерирован!',
        description: 'Теперь можно сохранить персонажа',
      });
    } catch (error) {
      toast({
        title: 'Ошибка генерации',
        description: 'Не удалось сгенерировать аватар. Попробуйте ещё раз.',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Неверный формат',
        description: 'Загрузите изображение (JPG, PNG, WebP)',
        variant: 'destructive'
      });
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setGeneratedAvatar(imageUrl);
      setIsUploadingImage(false);
      toast({
        title: 'Изображение загружено!',
        description: 'Теперь можно сохранить персонажа',
      });
    };

    reader.onerror = () => {
      setIsUploadingImage(false);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive'
      });
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (character) {
      setName(character.name);
      setGender((character as any).gender || '');
      setAge((character as any).age || '');
      setRace((character as any).race || '');
      setRole(character.role);
      setAppearance((character as any).appearance || '');
      setPersonality(character.personality || '');
      setScenes((character as any).scenes || '');
      setQuotes((character as any).quotes || '');
      setIdeas((character as any).ideas || '');
      setGeneratedAvatar(character.avatar || '');
    }
  }, [character]);

  const handleSave = async () => {
    if (!character) return;

    if (!name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Имя персонажа обязательно',
        variant: 'destructive',
      });
      return;
    }

    const savedCharacters = localStorage.getItem('user-characters');
    if (!savedCharacters) return;

    const characters = JSON.parse(savedCharacters);
    const updatedCharacters = characters.map((c: Character) =>
      c.id === character.id
        ? { 
            ...c, 
            name: name.trim(), 
            gender,
            age: age.trim(),
            race: race.trim(),
            role: role, 
            appearance: appearance.trim(),
            personality: personality.trim(), 
            scenes: scenes.trim(), 
            quotes: quotes.trim(), 
            ideas: ideas.trim(),
            avatar: generatedAvatar || c.avatar
          }
        : c
    );

    localStorage.setItem('user-characters', JSON.stringify(updatedCharacters));

    toast({
      title: 'Персонаж обновлён',
      description: `${name} успешно сохранён`,
    });

    onSave();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-purple-900/90 border-purple-500/40">
        <DialogHeader>
          <DialogTitle className="text-purple-100">Редактировать персонажа</DialogTitle>
          <DialogDescription className="text-purple-300/70">
            Измените параметры вашего персонажа
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="edit-char-name" className="text-purple-200">Имя персонажа *</Label>
            <Input
              id="edit-char-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Герда"
              className="bg-black/20 border-purple-500/30 text-purple-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-purple-200">Пол</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={gender === 'male' ? 'default' : 'outline'}
                  onClick={() => setGender('male')}
                  className={gender === 'male' 
                    ? 'flex-1 bg-purple-600 hover:bg-purple-700' 
                    : 'flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'}
                >
                  <Icon name="User" size={16} className="mr-1" />
                  Муж.
                </Button>
                <Button
                  type="button"
                  variant={gender === 'female' ? 'default' : 'outline'}
                  onClick={() => setGender('female')}
                  className={gender === 'female' 
                    ? 'flex-1 bg-pink-600 hover:bg-pink-700' 
                    : 'flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'}
                >
                  <Icon name="User" size={16} className="mr-1" />
                  Жен.
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-char-age" className="text-purple-200">Возраст</Label>
              <Input
                id="edit-char-age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="bg-black/20 border-purple-500/30 text-purple-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-char-race" className="text-purple-200">Раса</Label>
              <Input
                id="edit-char-race"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                placeholder="Например: эльф"
                className="bg-black/20 border-purple-500/30 text-purple-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-char-role" className="text-purple-200">Роль</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="edit-char-role" className="bg-black/20 border-purple-500/30 text-purple-100">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-char-appearance" className="text-purple-200">Внешность</Label>
            <Textarea
              id="edit-char-appearance"
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              placeholder="Опишите внешность: волосы, глаза, одежда, особенности..."
              rows={3}
              className="bg-black/20 border-purple-500/30 text-purple-100 resize-none"
            />
          </div>

          {generatedAvatar && (
            <div className="space-y-2">
              <Label className="text-purple-200">Сгенерированный аватар</Label>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30">
                <img 
                  src={generatedAvatar} 
                  alt="Аватар персонажа" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleGenerateAvatar}
              disabled={isGeneratingAvatar || isUploadingImage}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGeneratingAvatar ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  Перегенерировать
                </>
              )}
            </Button>
            
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                disabled={isGeneratingAvatar || isUploadingImage}
                className="hidden"
              />
              <Button 
                type="button"
                disabled={isGeneratingAvatar || isUploadingImage}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={(e) => {
                  e.preventDefault();
                  (e.currentTarget.parentElement as HTMLLabelElement)?.querySelector('input')?.click();
                }}
              >
                {isUploadingImage ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить свою
                  </>
                )}
              </Button>
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-char-personality" className="text-purple-200">Описание</Label>
            <Textarea
              id="edit-char-personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Опишите персонажа: характер, мотивы..."
              rows={3}
              className="bg-black/20 border-purple-500/30 text-purple-100 resize-none"
            />
          </div>

          <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 space-y-3">
            <div className="text-sm text-purple-200 font-semibold">Живой NPC — идеи для ИИ</div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-char-scenes" className="text-purple-200 text-sm">Сцены</Label>
              <Textarea
                id="edit-char-scenes"
                value={scenes}
                onChange={(e) => setScenes(e.target.value)}
                placeholder="Например: 'Встреча в таверне — защищает игрока'"
                rows={2}
                className="bg-black/20 border-purple-500/30 text-purple-100 text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-char-quotes" className="text-purple-200 text-sm">Фразы и цитаты</Label>
              <Textarea
                id="edit-char-quotes"
                value={quotes}
                onChange={(e) => setQuotes(e.target.value)}
                placeholder="Например: 'Клянусь, я отомщу!'"
                rows={2}
                className="bg-black/20 border-purple-500/30 text-purple-100 text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-char-ideas" className="text-purple-200 text-sm">Идеи для развития</Label>
              <Textarea
                id="edit-char-ideas"
                value={ideas}
                onChange={(e) => setIdeas(e.target.value)}
                placeholder="Например: 'Влюбляется в героя'"
                rows={2}
                className="bg-black/20 border-purple-500/30 text-purple-100 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Сохранить изменения
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};