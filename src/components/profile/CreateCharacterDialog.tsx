import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (character: { name: string; role: string; personality: string; avatar: string; scenes?: string; quotes?: string; ideas?: string }) => void;
}

export const CreateCharacterDialog = ({ isOpen, onClose, onSubmit }: CreateCharacterDialogProps) => {
  const { toast } = useToast();
  const [newCharacter, setNewCharacter] = useState({ name: '', role: '', personality: '', avatar: '', scenes: '', quotes: '', ideas: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = () => {
    if (!newCharacter.name || !newCharacter.role) {
      toast({ title: 'Заполните имя и роль', variant: 'destructive' });
      return;
    }
    onSubmit(newCharacter);
    setNewCharacter({ name: '', role: '', personality: '', avatar: '', scenes: '', quotes: '', ideas: '' });
    onClose();
  };

  const generateAvatar = async () => {
    if (!newCharacter.name || !newCharacter.personality) {
      toast({ title: 'Заполните имя и описание для генерации', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const translationPrompt = `Extract key visual details from this character description and translate to English. Focus on: appearance (hair color, eye color, skin tone, facial features), age, gender, body type, clothing/profession style. Keep it concise, 2-3 sentences max.

Character: ${newCharacter.name}
Role: ${newCharacter.role}
Description: ${newCharacter.personality}

Extract and translate only visual details to English:`;

      const translationResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-ant-api03-UpVQ3HhbTwWnMNxSE19gKpG6XKDLwEYQAVY7r3cQKhZqJk4BXPmfqVT8sFmgHt9-U2-4rwYE0Q0NSPPwCGKWEw-vZSKnwAA',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 200,
          messages: [{ role: 'user', content: translationPrompt }]
        })
      });

      const translationData = await translationResponse.json();
      const visualDescription = translationData.content?.[0]?.text || `${newCharacter.name}, ${newCharacter.role}`;
      
      const shortDescription = visualDescription.slice(0, 300);
      const prompt = `Portrait of ${shortDescription}, professional character art, cinematic lighting`;
      
      const response = await fetch('https://functions.poehali.dev/16a136ce-ff21-4430-80df-ad1caa87a3a7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      
      const data = await response.json();
      setNewCharacter({ ...newCharacter, avatar: data.url });
      
      toast({ title: 'Изображение готово! ✨' });
    } catch (error) {
      console.error('Avatar generation error:', error);
      toast({ title: 'Ошибка генерации', description: 'Попробуйте ещё раз', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-950 via-black to-purple-950 border-purple-500/40 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-100">Создать персонажа</DialogTitle>
          <DialogDescription className="text-purple-300/70">
            Заполните информацию о новом персонаже
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-32 h-32 border-2 border-purple-500/50">
                <AvatarImage src={newCharacter.avatar} className="object-cover" />
                <AvatarFallback className="bg-purple-900/50 text-purple-100 text-2xl">
                  {newCharacter.name ? newCharacter.name.slice(0, 2).toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
              
              <Button
                onClick={generateAvatar}
                disabled={isGenerating || !newCharacter.name || !newCharacter.personality}
                size="sm"
                variant="outline"
                className="w-full border-purple-500/50 text-purple-200 hover:bg-purple-500/20 gap-2"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={16} />
                    Сгенерировать
                  </>
                )}
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="char-name" className="text-purple-200">Имя персонажа *</Label>
                <Input
                  id="char-name"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  placeholder="Введите имя"
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="char-role" className="text-purple-200">Роль *</Label>
                <Input
                  id="char-role"
                  value={newCharacter.role}
                  onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
                  placeholder="Например: Воин, Маг, Разведчик"
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="char-personality" className="text-purple-200">
              Описание персонажа
              <span className="text-purple-400/60 text-sm ml-2">(для генерации портрета)</span>
            </Label>
            <Textarea
              id="char-personality"
              value={newCharacter.personality}
              onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
              placeholder="Опишите внешность: цвет волос, глаз, возраст, стиль одежды..."
              className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="char-avatar" className="text-purple-200">URL аватара (опционально)</Label>
            <Input
              id="char-avatar"
              value={newCharacter.avatar}
              onChange={(e) => setNewCharacter({ ...newCharacter, avatar: e.target.value })}
              placeholder="https://example.com/avatar.png"
              className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
            />
          </div>

          <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2 text-purple-200">
              <Icon name="Lightbulb" size={18} className="text-yellow-400" />
              <h3 className="font-semibold">Живой NPC — идеи для ИИ</h3>
            </div>
            <p className="text-xs text-purple-300/70">
              Опишите сцены, цитаты и идеи — ИИ поймёт характер NPC и создаст его реакции на ваши решения
            </p>

            <div className="space-y-2">
              <Label htmlFor="char-scenes" className="text-purple-200 text-sm flex items-center gap-2">
                <Icon name="Film" size={14} />
                Сцены с участием NPC
              </Label>
              <Textarea
                id="char-scenes"
                value={newCharacter.scenes}
                onChange={(e) => setNewCharacter({ ...newCharacter, scenes: e.target.value })}
                placeholder="Например: 'Встреча в таверне — NPC защищает игрока от бандитов' или 'Предательство — NPC уходит к врагам'"
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-20 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-quotes" className="text-purple-200 text-sm flex items-center gap-2">
                <Icon name="Quote" size={14} />
                Фразы и цитаты NPC
              </Label>
              <Textarea
                id="char-quotes"
                value={newCharacter.quotes}
                onChange={(e) => setNewCharacter({ ...newCharacter, quotes: e.target.value })}
                placeholder="Например: 'Клянусь, я отомщу!' или 'Доверяй, но проверяй, друг мой'"
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-20 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-ideas" className="text-purple-200 text-sm flex items-center gap-2">
                <Icon name="Sparkles" size={14} />
                Идеи для развития
              </Label>
              <Textarea
                id="char-ideas"
                value={newCharacter.ideas}
                onChange={(e) => setNewCharacter({ ...newCharacter, ideas: e.target.value })}
                placeholder="Например: 'NPC влюбляется в героя' или 'NPC скрывает секрет о прошлом'"
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-20 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
          >
            <Icon name="Check" size={18} />
            Создать персонажа
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};