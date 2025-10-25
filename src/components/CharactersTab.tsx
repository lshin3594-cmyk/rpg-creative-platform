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
import { InputWithAI } from '@/components/ui/input-with-ai';
import { useAIGeneration } from '@/hooks/useAIGeneration';

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
  
  const { generate } = useAIGeneration();

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

  const generateCharacterField = async (field: 'personality' | 'backstory' | 'stats' | 'role') => {
    const context = `Персонаж: ${formData.name || 'без имени'}, Роль: ${formData.role || 'не указана'}`;
    const prompts = {
      personality: `Создай краткое описание характера для ${context}. 2-3 предложения.`,
      backstory: `Создай краткую предысторию для ${context}. 3-4 предложения.`,
      stats: `Создай игровые характеристики для ${context}. Формат: Сила: X, Ловкость: Y, и т.д.`,
      role: `Предложи интересную роль/класс для персонажа ${formData.name || 'фэнтези персонажа'}`
    };

    const result = await generate(prompts[field]);
    if (result) {
      setFormData(prev => ({ ...prev, [field]: result }));
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
              <InputWithAI
                label="Роль"
                id="char-role"
                value={formData.role}
                onChange={(value) => setFormData({...formData, role: value})}
                onGenerate={() => generateCharacterField('role')}
                placeholder="Воин, Маг, Вор..."
              />
              <InputWithAI
                label="Характеристики"
                id="char-stats"
                value={formData.stats}
                onChange={(value) => setFormData({...formData, stats: value})}
                onGenerate={() => generateCharacterField('stats')}
                placeholder="Сила: 18, Ловкость: 14..."
              />
              <InputWithAI
                label="Характер"
                id="char-personality"
                value={formData.personality}
                onChange={(value) => setFormData({...formData, personality: value})}
                onGenerate={() => generateCharacterField('personality')}
                placeholder="Суровый защитник древних тайн..."
                multiline
              />
              <InputWithAI
                label="Предыстория"
                id="char-backstory"
                value={formData.backstory}
                onChange={(value) => setFormData({...formData, backstory: value})}
                onGenerate={() => generateCharacterField('backstory')}
                placeholder="Последний из ордена..."
                multiline
                className="min-h-[100px]"
              />
              
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
            className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 relative group"
            onClick={onCardClick}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
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
                <Avatar className="w-32 h-32 border-4 border-primary/30 shadow-lg shadow-primary/20">
                  <AvatarImage src={character.avatar} alt={character.name} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
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
            <InputWithAI
              label="Роль"
              id="edit-char-role"
              value={formData.role}
              onChange={(value) => setFormData({...formData, role: value})}
              onGenerate={() => generateCharacterField('role')}
              placeholder="Воин, Маг, Вор..."
            />
            <InputWithAI
              label="Характеристики"
              id="edit-char-stats"
              value={formData.stats}
              onChange={(value) => setFormData({...formData, stats: value})}
              onGenerate={() => generateCharacterField('stats')}
              placeholder="Сила: 18, Ловкость: 14..."
            />
            <InputWithAI
              label="Характер"
              id="edit-char-personality"
              value={formData.personality}
              onChange={(value) => setFormData({...formData, personality: value})}
              onGenerate={() => generateCharacterField('personality')}
              placeholder="Суровый защитник древних тайн..."
              multiline
            />
            <InputWithAI
              label="Предыстория"
              id="edit-char-backstory"
              value={formData.backstory}
              onChange={(value) => setFormData({...formData, backstory: value})}
              onGenerate={() => generateCharacterField('backstory')}
              placeholder="Последний из ордена..."
              multiline
              className="min-h-[100px]"
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