import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

interface EditCharacterDialogProps {
  character: Character | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const ROLES = ['Главный герой', 'Второстепенный персонаж', 'Антагонист', 'Союзник', 'Наставник'];

export const EditCharacterDialog = ({ character, open, onOpenChange, onSave }: EditCharacterDialogProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [personality, setPersonality] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (character) {
      setName(character.name);
      setRole(character.role);
      setPersonality(character.personality || '');
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
        ? { ...c, name: name.trim(), role: role, personality: personality.trim() }
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

        <div className="space-y-4 py-4">
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

          <div className="space-y-2">
            <Label htmlFor="edit-char-personality" className="text-purple-200">Характер</Label>
            <Textarea
              id="edit-char-personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Опишите характер персонажа..."
              rows={4}
              className="bg-black/20 border-purple-500/30 text-purple-100"
            />
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