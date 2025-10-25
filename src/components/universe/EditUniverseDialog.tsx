import { useState, useEffect } from 'react';
import { universeStorage, type Universe } from '@/lib/universeStorage';
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

interface EditUniverseDialogProps {
  universe: Universe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const GENRES = [
  'Фэнтези',
  'Научная фантастика',
  'Постапокалипсис',
  'Киберпанк',
  'Стимпанк',
  'Современность',
  'Историческое',
  'Ужасы',
  'Мистика',
  'Романтика',
];

export const EditUniverseDialog = ({ universe, open, onOpenChange, onSave }: EditUniverseDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [tags, setTags] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (universe) {
      setName(universe.name);
      setDescription(universe.description);
      setGenre(universe.genre);
      setTags(universe.tags.join(', '));
    }
  }, [universe]);

  const handleSave = () => {
    if (!universe) return;

    if (!name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Название вселенной обязательно',
        variant: 'destructive',
      });
      return;
    }

    universeStorage.update(universe.id, {
      name: name.trim(),
      description: description.trim(),
      genre,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });

    toast({
      title: 'Вселенная обновлена',
      description: `${name} успешно сохранена`,
    });

    onSave();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать вселенную</DialogTitle>
          <DialogDescription>
            Измените параметры вашей вселенной
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Название вселенной *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Средиземье"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Описание</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Кратко опишите вашу вселенную..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-genre">Жанр</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger id="edit-genre">
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Теги (через запятую)</Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="магия, драконы, эльфы"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            Сохранить изменения
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
