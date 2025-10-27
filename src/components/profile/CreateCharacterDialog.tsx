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

import { useToast } from '@/hooks/use-toast';
import func2url from '../../../backend/func2url.json';

const IMAGE_GEN_URL = func2url['generate-image'];



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
  const [race, setRace] = useState('');
  const [role, setRole] = useState('');
  const [appearance, setAppearance] = useState('');
  const [personality, setPersonality] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState('');
  
  const { toast } = useToast();

  const handleGenerateAvatar = async () => {
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
      const characterName = name.trim() || 'fantasy character';
      const raceText = race ? `, ${race} race` : '';
      
      const prompt = `Square portrait of ${characterName}${raceText}, ${appearance}, fantasy RPG character art, professional digital painting, highly detailed, 8k quality, cinematic lighting, sharp focus, epic composition, artstation trending`;
      
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

    onSubmit({
      name: name.trim(),
      role: role.trim() || 'Персонаж',
      personality: `${race ? `Раса: ${race}. ` : ''}${role ? `Роль: ${role}. ` : ''}${appearance ? `Внешность: ${appearance}. ` : ''}${personality}`.trim(),
      avatar: generatedAvatar || '',
      scenes: '',
      quotes: '',
      ideas: '',
      isMainCharacter: false
    });

    setName('');
    setRace('');
    setRole('');
    setAppearance('');
    setPersonality('');
    setGeneratedAvatar('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-gradient-to-br from-purple-950/95 via-purple-900/90 to-purple-950/95 border border-purple-500/30 backdrop-blur-xl overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-purple-500/20 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            Создать персонажа
          </DialogTitle>
          <DialogDescription className="text-purple-300/70">
            Заполните данные о персонаже и сгенерируйте аватар
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-6 px-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              {generatedAvatar ? (
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
                  <img 
                    src={generatedAvatar} 
                    alt="Аватар персонажа" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/30 flex items-center justify-center">
                  <Icon name="User" size={64} className="text-purple-400/50" />
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleGenerateAvatar}
              disabled={isGeneratingAvatar}
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/50"
            >
              {isGeneratingAvatar ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={18} />
                  Сгенерировать аватар
                </>
              )}
            </Button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="char-name" className="text-blue-300 font-semibold flex items-center gap-2">
                <Icon name="User" size={16} />
                Имя персонажа *
              </Label>
              <Input
                id="char-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Герда Снежная"
                className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 h-12 text-base focus:border-blue-400 focus:ring-blue-400/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-race" className="text-pink-300 font-semibold flex items-center gap-2">
                <Icon name="Dna" size={16} />
                Раса
              </Label>
              <Input
                id="char-race"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                placeholder="Например: Эльф, Человек, Дроу"
                className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 h-12 text-base focus:border-pink-400 focus:ring-pink-400/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-role" className="text-blue-300 font-semibold flex items-center gap-2">
                <Icon name="Briefcase" size={16} />
                Роль
              </Label>
              <Input
                id="char-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Например: Воин, Маг огня, Торговец"
                className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 h-12 text-base focus:border-blue-400 focus:ring-blue-400/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-appearance" className="text-pink-300 font-semibold flex items-center gap-2">
                <Icon name="Palette" size={16} />
                Внешность (для генерации аватара)
              </Label>
              <Textarea
                id="char-appearance"
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Опишите внешность: цвет волос, глаз, одежду, особенности...&#10;Например: длинные белые волосы, ледяные голубые глаза, серебряная броня"
                rows={5}
                className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 text-base focus:border-pink-400 focus:ring-pink-400/50 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-personality" className="text-blue-300 font-semibold flex items-center gap-2">
                <Icon name="Heart" size={16} />
                Описание характера
              </Label>
              <Textarea
                id="char-personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Опишите характер, предыстория, мотивацию, особенности поведения...&#10;Например: хладнокровная воительница, потерявшая семью в войне. Не доверяет незнакомцам, но верна союзникам до конца."
                rows={6}
                className="bg-purple-900/30 border-purple-500/40 text-purple-50 placeholder:text-purple-400/50 text-base focus:border-blue-400 focus:ring-blue-400/50 resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-purple-500/20 pt-4 mt-auto">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-purple-300 hover:text-purple-100 hover:bg-purple-800/30"
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 font-semibold shadow-lg"
          >
            <Icon name="Check" size={18} />
            Создать персонажа
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};