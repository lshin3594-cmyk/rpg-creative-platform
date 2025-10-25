import { useState } from 'react';
import { universeStorage, type Universe } from '@/lib/universeStorage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SavedUniversesListProps {
  onSelect?: (universe: Universe) => void;
  onEdit?: (universe: Universe) => void;
}

export const SavedUniversesList = ({ onSelect, onEdit }: SavedUniversesListProps) => {
  const [universes, setUniverses] = useState<Universe[]>(universeStorage.getAll());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    universeStorage.delete(id);
    setUniverses(universeStorage.getAll());
    setDeleteId(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (universes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <Icon name="Globe" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Вы ещё не создали ни одной вселенной</p>
          <p className="text-sm mt-2">Создайте свою первую вселенную выше</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {universes.map((universe) => (
          <Card key={universe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{universe.name}</span>
                <div className="flex gap-1">
                  {onEdit && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(universe)}
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setDeleteId(universe.id)}
                  >
                    <Icon name="Trash2" size={16} className="text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {universe.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant="secondary">{universe.genre}</Badge>
                </div>
                {universe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {universe.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Создана: {formatDate(universe.createdAt)}
                </div>
                {onSelect && (
                  <Button
                    className="w-full"
                    onClick={() => onSelect(universe)}
                  >
                    <Icon name="CheckCircle2" size={16} className="mr-2" />
                    Выбрать вселенную
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить вселенную?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Вселенная будет удалена безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
