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
      
      // Формируем усиленный промпт с повторениями ключевых деталей
      const genderEn = gender === 'male' ? 'man' : 'woman';
      const ageText = age.trim() ? `${age} years old` : '30 years old';
      const raceText = race.trim() ? race : 'human';
      const roleText = role.trim() || 'character';
      
      // Парсим внешность и выделяем ключевые детали
      const appearanceDetails = appearance.trim() || 'detailed face';
      
      // КРИТИЧЕСКИ ВАЖНО: повторяем детали внешности 2-3 раза для Flux
      const prompt = `professional portrait photo, closeup headshot, ${genderEn}, ${ageText}, ${raceText} ${roleText}. APPEARANCE: ${appearanceDetails}. IMPORTANT DETAILS: ${appearanceDetails}. facial features: ${appearanceDetails}. Neutral expression, formal attire, professional clothing, studio portrait lighting, sharp focus, high detail face, photorealistic, 8k quality, SFW, appropriate, respectable character portrait`;
      
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
      
      // Просто показываем URL сразу - pollinations.ai сгенерирует при первом запросе
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
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              {generatedAvatar ? (
                <div 
                  className="w-96 h-96 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setIsFullscreenOpen(true)}
                >
                  <img 
                    src={generatedAvatar} 
                    alt="Аватар персонажа" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                    <Icon name="Maximize2" size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <div className="w-96 h-96 rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/30 flex items-center justify-center">
                  <Icon name="User" size={64} className="text-purple-400/50" />
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
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
                    {generatedAvatar ? 'Перегенерировать' : 'Сгенерировать аватар'}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-purple-800/40 border-2 border-purple-500/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-purple-100 font-semibold mb-1">Тип персонажа</p>
                  <p className="text-xs text-purple-300/70">
                    {isMainCharacter ? "Главный герой — протагонист истории" : "NPC — второстепенный персонаж"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold transition-colors ${!isMainCharacter ? 'text-blue-400' : 'text-purple-500'}`}>
                    NPC
                  </span>
                  <label className="relative inline-block w-16 h-8 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMainCharacter}
                      onChange={(e) => {
                        setIsMainCharacter(e.target.checked);
                        if (e.target.checked) {
                          setScenes('');
                          setQuotes('');
                          setIdeas('');
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="absolute inset-0 rounded-full bg-blue-500 peer-checked:bg-yellow-500 transition-all duration-300 shadow-lg ring-2 ring-blue-400 peer-checked:ring-yellow-400"></div>
                    <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-8 flex items-center justify-center">
                      <Icon name={isMainCharacter ? "Crown" : "Users"} size={14} className={isMainCharacter ? "text-yellow-500" : "text-blue-500"} />
                    </div>
                  </label>
                  <span className={`text-sm font-bold transition-colors ${isMainCharacter ? 'text-yellow-400' : 'text-purple-500'}`}>
                    ГГ
                  </span>
                </div>
              </div>
            </div>

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
              <Label htmlFor="char-gender" className="text-pink-300 font-semibold flex items-center gap-2">
                <Icon name="Users" size={16} />
                Пол *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`h-12 rounded-lg border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
                    gender === 'male'
                      ? 'bg-blue-500/30 border-blue-400 text-blue-300 shadow-lg shadow-blue-500/30'
                      : 'bg-purple-900/20 border-purple-500/30 text-purple-400 hover:border-blue-400/50'
                  }`}
                >
                  <Icon name="User" size={18} />
                  Мужской
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`h-12 rounded-lg border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
                    gender === 'female'
                      ? 'bg-pink-500/30 border-pink-400 text-pink-300 shadow-lg shadow-pink-500/30'
                      : 'bg-purple-900/20 border-purple-500/30 text-purple-400 hover:border-pink-400/50'
                  }`}
                >
                  <Icon name="User" size={18} />
                  Женский
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-age" className="text-blue-300 font-semibold flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                Возраст
              </Label>
              <Input
                id="char-age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Например: 25, молодой, пожилой"
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

            {!isMainCharacter && (
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
                    onChange={(e) => setScenes(e.target.value)}
                    placeholder="Например: 'Встреча в таверне — NPC защищает игрока от бандитов' или 'Предательство — NPC уходит к врагам'"
                    rows={4}
                    className="bg-yellow-950/30 border-yellow-600/40 text-yellow-50 placeholder:text-yellow-300/50 text-base focus:border-yellow-400 focus:ring-yellow-400/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="char-quotes" className="text-yellow-300 font-semibold flex items-center gap-2">
                    <Icon name="Quote" size={16} />
                    Фразы и цитаты NPC
                  </Label>
                  <Textarea
                    id="char-quotes"
                    value={quotes}
                    onChange={(e) => setQuotes(e.target.value)}
                    placeholder="Например: 'Клянусь, я отомщу!' или 'А что, так нельзя было?'"
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
                    onChange={(e) => setIdeas(e.target.value)}
                    placeholder="Например: 'Влюбляется в героя' или 'Имеет тайну из прошлого'"
                    rows={4}
                    className="bg-yellow-950/30 border-yellow-600/40 text-yellow-50 placeholder:text-yellow-300/50 text-base focus:border-yellow-400 focus:ring-yellow-400/50 resize-none"
                  />
                </div>
              </div>
            </div>
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

    {/* Fullscreen Avatar Dialog */}
    <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
      <DialogContent className="max-w-7xl h-[95vh] bg-black/95 border-purple-500/30 p-4">
        <DialogHeader>
          <DialogTitle className="text-purple-300 text-2xl flex items-center justify-between">
            <span>Аватар персонажа</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreenOpen(false)}
              className="text-purple-300 hover:text-purple-100 hover:bg-purple-800/30"
            >
              <Icon name="X" size={24} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {generatedAvatar && (
            <img 
              src={generatedAvatar} 
              alt="Аватар персонажа в полном размере" 
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};