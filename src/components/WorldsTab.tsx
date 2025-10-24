import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string;
}

interface WorldsTabProps {
  worlds: World[];
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onCardClick: () => void;
  onDelete?: (id: string) => void;
  onCreate?: (data: Omit<World, 'id'>) => Promise<void>;
}

export const WorldsTab = ({ 
  worlds, 
  isCreateDialogOpen, 
  setIsCreateDialogOpen,
  onCardClick,
  onDelete,
  onCreate
}: WorldsTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: '',
    image: ''
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (!confirm('Удалить этот мир?')) return;
    
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const handleCreate = async () => {
    if (!onCreate || !formData.name || !formData.description) return;
    
    setIsCreating(true);
    try {
      await onCreate(formData);
      setFormData({
        name: '',
        description: '',
        genre: '',
        image: ''
      });
      setIsCreateDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-semibold">Библиотека миров</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={20} />
              Создать мир
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Создание мира</DialogTitle>
              <DialogDescription>
                Опиши свой мир, и ИИ сгенерирует его визуализацию
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="world-name">Название мира</Label>
                <Input 
                  id="world-name" 
                  placeholder="Замок Теней" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="world-genre">Жанр</Label>
                <Input 
                  id="world-genre" 
                  placeholder="Тёмное фэнтези, Научная фантастика..." 
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="world-description">Описание</Label>
                <Textarea 
                  id="world-description" 
                  placeholder="Древняя крепость, пронизанная тёмной магией..." 
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <Button 
                className="w-full gap-2" 
                onClick={handleCreate}
                disabled={isCreating || !formData.name || !formData.description}
              >
                {isCreating ? (
                  <Icon name="Loader2" size={20} className="animate-spin" />
                ) : (
                  <Icon name="Wand2" size={20} />
                )}
                {isCreating ? 'Создание...' : 'Создать мир'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worlds.map((world, index) => (
          <Card 
            key={world.id}
            className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 overflow-hidden relative group"
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
                onClick={(e) => handleDelete(e, world.id)}
                disabled={deletingId === world.id}
              >
                {deletingId === world.id ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="Trash2" size={16} />
                )}
              </Button>
            )}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={world.image} 
                alt={world.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <Badge 
                variant="secondary" 
                className="absolute top-4 right-4 backdrop-blur-sm bg-background/80"
              >
                {world.genre}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{world.name}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {world.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <Icon name="BookOpen" size={18} />
                Исследовать мир
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};