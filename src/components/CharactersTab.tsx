import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
}

interface CharactersTabProps {
  characters: Character[];
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onCardClick: () => void;
  onDelete?: (id: string) => void;
}

export const CharactersTab = ({ 
  characters, 
  isCreateDialogOpen, 
  setIsCreateDialogOpen,
  onCardClick,
  onDelete
}: CharactersTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (!confirm('Удалить этого персонажа?')) return;
    
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-semibold">Библиотека персонажей</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={20} />
              Создать персонажа
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Создание персонажа</DialogTitle>
              <DialogDescription>
                Опиши своего персонажа, и ИИ сгенерирует его портрет
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="char-name">Имя персонажа</Label>
                <Input id="char-name" placeholder="Тёмный Страж" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-role">Роль</Label>
                <Input id="char-role" placeholder="Воин, Маг, Вор..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-stats">Характеристики</Label>
                <Input id="char-stats" placeholder="Сила: 18, Ловкость: 14..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-personality">Характер</Label>
                <Textarea id="char-personality" placeholder="Суровый защитник древних тайн..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-backstory">Предыстория</Label>
                <Textarea id="char-backstory" placeholder="Последний из ордена..." className="min-h-[100px]" />
              </div>
              <Button className="w-full gap-2">
                <Icon name="Wand2" size={20} />
                Создать персонажа
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character, index) => (
          <Card 
            key={character.id}
            className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 relative group"
            onClick={onCardClick}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => handleDelete(e, character.id)}
                disabled={deletingId === character.id}
              >
                {deletingId === character.id ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="Trash2" size={16} />
                )}
              </Button>
            )}
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="w-32 h-32 border-4 border-primary/30 shadow-lg shadow-primary/20">
                  <AvatarImage src={character.avatar} alt={character.name} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-serif">{character.name}</CardTitle>
              <div className="flex justify-center mt-2">
                <Badge variant="secondary" className="text-sm">{character.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{character.stats}</p>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm font-medium mb-1">Характер:</p>
                  <p className="text-sm text-muted-foreground">{character.personality}</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm font-medium mb-1">История:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{character.backstory}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};