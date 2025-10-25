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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageGenerator } from '@/components/ImageGenerator';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
  character_type?: string;
}

interface CharactersTabProps {
  characters: Character[];
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onCardClick: () => void;
  onDelete?: (id: string) => void;
  onCreate?: (data: Omit<Character, 'id'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Character>) => Promise<void>;
}

export const CharactersTab = ({ 
  characters, 
  isCreateDialogOpen, 
  setIsCreateDialogOpen,
  onCardClick,
  onDelete,
  onCreate,
  onUpdate
}: CharactersTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    stats: '',
    personality: '',
    backstory: '',
    avatar: '',
    character_type: 'player'
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (!confirm('Удалить этого персонажа?')) return;
    
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const handleCreate = async () => {
    if (!onCreate || !formData.name || !formData.role) return;
    
    setIsCreating(true);
    try {
      await onCreate(formData);
      setFormData({
        name: '',
        role: '',
        stats: '',
        personality: '',
        backstory: '',
        avatar: '',
        character_type: 'player'
      });
      setIsCreateDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation();
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      role: character.role,
      stats: character.stats,
      personality: character.personality,
      backstory: character.backstory,
      avatar: character.avatar,
      character_type: character.character_type || 'player'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!onUpdate || !editingCharacter || !formData.name || !formData.role) return;
    
    setIsCreating(true);
    try {
      await onUpdate(editingCharacter.id, formData);
      setIsEditDialogOpen(false);
      setEditingCharacter(null);
      setFormData({
        name: '',
        role: '',
        stats: '',
        personality: '',
        backstory: '',
        avatar: '',
        character_type: 'player'
      });
    } finally {
      setIsCreating(false);
    }
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
                <Label htmlFor="char-type">Тип персонажа</Label>
                <Select 
                  value={formData.character_type} 
                  onValueChange={(value) => setFormData({...formData, character_type: value})}
                >
                  <SelectTrigger id="char-type">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={16} />
                        <span>Игрок (вы управляете)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="npc">
                      <div className="flex items-center gap-2">
                        <Icon name="Bot" size={16} />
                        <span>NPC (управляет ИИ)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.character_type === 'player' 
                    ? 'Персонаж, за которого вы играете в историях' 
                    : 'Персонаж, которым управляет нейросеть'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-name">Имя персонажа</Label>
                <Input 
                  id="char-name" 
                  placeholder="Тёмный Страж" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-role">Роль</Label>
                <Input 
                  id="char-role" 
                  placeholder="Воин, Маг, Вор..." 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-stats">Характеристики</Label>
                <Input 
                  id="char-stats" 
                  placeholder="Сила: 18, Ловкость: 14..." 
                  value={formData.stats}
                  onChange={(e) => setFormData({...formData, stats: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-personality">Характер</Label>
                <Textarea 
                  id="char-personality" 
                  placeholder="Суровый защитник древних тайн..." 
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-backstory">Предыстория</Label>
                <Textarea 
                  id="char-backstory" 
                  placeholder="Последний из ордена..." 
                  className="min-h-[100px]" 
                  value={formData.backstory}
                  onChange={(e) => setFormData({...formData, backstory: e.target.value})}
                />
              </div>
              
              <ImageGenerator
                currentImage={formData.avatar}
                onImageGenerated={(url) => setFormData({...formData, avatar: url})}
                placeholder="Опиши внешность персонажа для генерации портрета..."
                label="Портрет персонажа"
              />
              
              <Button 
                className="w-full gap-2" 
                onClick={handleCreate}
                disabled={isCreating || !formData.name || !formData.role}
              >
                {isCreating ? (
                  <Icon name="Loader2" size={20} className="animate-spin" />
                ) : (
                  <Icon name="Wand2" size={20} />
                )}
                {isCreating ? 'Создание...' : 'Создать персонажа'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character, index) => (
          <Card 
            key={character.id}
            className="border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm bg-gradient-to-br from-purple-950/40 via-black/60 to-pink-950/40 relative group overflow-hidden hover:shadow-[0_0_30px_rgba(168,85,247,0.4),0_0_60px_rgba(236,72,153,0.2)]"
            onClick={onCardClick}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            {/* Звёзды на фоне */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-[25%] right-[20%] w-1.5 h-1.5 bg-pink-200 rounded-full animate-twinkle-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-[45%] left-[25%] w-0.5 h-0.5 bg-purple-400 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-[30%] right-[15%] w-1 h-1 bg-pink-300 rounded-full animate-twinkle-slow" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-[15%] left-[30%] w-1 h-1 bg-purple-200 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-[60%] right-[40%] w-0.5 h-0.5 bg-pink-400 rounded-full animate-twinkle-slow" style={{ animationDelay: '2.5s' }}></div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {onUpdate && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleEdit(e, character)}
                >
                  <Icon name="Pencil" size={16} />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
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
            </div>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="w-32 h-32 border-4 border-purple-500/40 shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-purple-400/50 group-hover:shadow-2xl">
                  <AvatarImage 
                    src={character.avatar} 
                    alt={character.name}
                    className="opacity-60 blur-[2px] grayscale-[30%] group-hover:opacity-100 group-hover:blur-0 group-hover:grayscale-0 transition-all duration-500"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-3xl">{character.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-serif">{character.name}</CardTitle>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="secondary" className="text-sm">{character.role}</Badge>
                <Badge 
                  variant={character.character_type === 'player' ? 'default' : 'outline'}
                  className="text-xs gap-1"
                >
                  <Icon name={character.character_type === 'player' ? 'User' : 'Bot'} size={12} />
                  {character.character_type === 'player' ? 'Игрок' : 'NPC'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {character.personality && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-1">Характер:</p>
                  <p className="text-sm line-clamp-2">{character.personality}</p>
                </div>
              )}
              {character.stats && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Характеристики:</p>
                  <p className="text-xs font-mono bg-secondary/50 p-2 rounded">{character.stats}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Редактирование персонажа</DialogTitle>
            <DialogDescription>
              Обнови данные персонажа
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-char-type">Тип персонажа</Label>
              <Select 
                value={formData.character_type} 
                onValueChange={(value) => setFormData({...formData, character_type: value})}
              >
                <SelectTrigger id="edit-char-type">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} />
                      <span>Игрок (вы управляете)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="npc">
                    <div className="flex items-center gap-2">
                      <Icon name="Bot" size={16} />
                      <span>NPC (управляет ИИ)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-char-name">Имя персонажа</Label>
              <Input 
                id="edit-char-name" 
                placeholder="Тёмный Страж" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-char-role">Роль</Label>
              <Input 
                id="edit-char-role" 
                placeholder="Воин, Маг, Вор..." 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-char-stats">Характеристики</Label>
              <Input 
                id="edit-char-stats" 
                placeholder="Сила: 18, Ловкость: 14..." 
                value={formData.stats}
                onChange={(e) => setFormData({...formData, stats: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-char-personality">Характер</Label>
              <Textarea 
                id="edit-char-personality" 
                placeholder="Суровый защитник древних тайн..." 
                value={formData.personality}
                onChange={(e) => setFormData({...formData, personality: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-char-backstory">Предыстория</Label>
              <Textarea 
                id="edit-char-backstory" 
                placeholder="Последний из ордена..." 
                className="min-h-[100px]" 
                value={formData.backstory}
                onChange={(e) => setFormData({...formData, backstory: e.target.value})}
              />
            </div>
            
            <ImageGenerator
              currentImage={formData.avatar}
              onImageGenerated={(url) => setFormData({...formData, avatar: url})}
              placeholder="Опиши внешность персонажа для генерации портрета..."
              label="Портрет персонажа"
            />
            
            <Button 
              className="w-full gap-2" 
              onClick={handleUpdate}
              disabled={isCreating || !formData.name || !formData.role}
            >
              {isCreating ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <Icon name="Save" size={20} />
              )}
              {isCreating ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};