import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

import { AvatarSection } from './create-character/AvatarSection';
import { CharacterTypeToggle } from './create-character/CharacterTypeToggle';
import { BasicInfoFields } from './create-character/BasicInfoFields';
import { AppearanceField } from './create-character/AppearanceField';
import { PersonalityField } from './create-character/PersonalityField';
import { NPCFieldsSection } from './create-character/NPCFieldsSection';
import { FullscreenAvatarDialog } from './create-character/FullscreenAvatarDialog';

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
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState('');
  const [race, setRace] = useState('');
  const [role, setRole] = useState('');
  const [appearance, setAppearance] = useState('');
  const [personality, setPersonality] = useState('');
  const [scenes, setScenes] = useState('');
  const [quotes, setQuotes] = useState('');
  const [ideas, setIdeas] = useState('');
  const [isMainCharacter, setIsMainCharacter] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState('');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
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
      const genderEn = gender === 'male' ? 'man' : 'woman';
      const appearanceClean = appearance.trim() || 'face portrait';
      const prompt = `Portrait of ${genderEn}. ${appearanceClean}. Professional headshot, neutral face, SFW`;
      
      console.log('🎨 Generating avatar with prompt:', prompt);
      
      const response = await fetch(IMAGE_GEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      const imageUrl = data.url;
      
      console.log('🖼️ Got image URL:', imageUrl);
      
      setGeneratedAvatar(imageUrl);
      
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
      scenes: isMainCharacter ? '' : scenes.trim(),
      quotes: isMainCharacter ? '' : quotes.trim(),
      ideas: isMainCharacter ? '' : ideas.trim(),
      isMainCharacter: isMainCharacter
    });

    setName('');
    setGender('');
    setAge('');
    setRace('');
    setRole('');
    setAppearance('');
    setPersonality('');
    setScenes('');
    setQuotes('');
    setIdeas('');
    setIsMainCharacter(false);
    setGeneratedAvatar('');
    onClose();
  };

  return (
    <>
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
            <AvatarSection
              generatedAvatar={generatedAvatar}
              isGeneratingAvatar={isGeneratingAvatar}
              isUploadingImage={isUploadingImage}
              onGenerateAvatar={handleGenerateAvatar}
              onUploadImage={handleUploadImage}
              onAvatarClick={() => setIsFullscreenOpen(true)}
            />

            <div className="space-y-5">
              <CharacterTypeToggle
                isMainCharacter={isMainCharacter}
                onToggle={setIsMainCharacter}
              />

              <BasicInfoFields
                name={name}
                gender={gender}
                age={age}
                race={race}
                role={role}
                onNameChange={setName}
                onGenderChange={setGender}
                onAgeChange={setAge}
                onRaceChange={setRace}
                onRoleChange={setRole}
              />

              <AppearanceField
                value={appearance}
                onChange={setAppearance}
              />

              <PersonalityField
                value={personality}
                onChange={setPersonality}
              />

              {!isMainCharacter && (
                <NPCFieldsSection
                  scenes={scenes}
                  quotes={quotes}
                  ideas={ideas}
                  onScenesChange={setScenes}
                  onQuotesChange={setQuotes}
                  onIdeasChange={setIdeas}
                />
              )}
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

      <FullscreenAvatarDialog
        isOpen={isFullscreenOpen}
        avatarUrl={generatedAvatar}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </>
  );
};
