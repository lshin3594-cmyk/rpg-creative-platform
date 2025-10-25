import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Action {
  id: string;
  icon: string;
  text: string;
  description: string;
}

interface ActionsSettingsProps {
  actions: Action[];
  onChange: (actions: Action[]) => void;
}

const availableIcons = [
  'Swords', 'Shield', 'MessageCircle', 'Eye', 'Search', 'Footprints',
  'EyeOff', 'Zap', 'Heart', 'Brain', 'Package', 'Wand2', 'Flame',
  'Wind', 'Droplets', 'Mountain', 'Trees', 'Lock', 'Unlock', 'Key',
  'Map', 'Compass', 'Scroll', 'BookOpen', 'Backpack', 'Coins',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Target', 'Focus'
];

export const ActionsSettings = ({ actions, onChange }: ActionsSettingsProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [formData, setFormData] = useState({
    icon: 'Sparkles',
    text: '',
    description: ''
  });

  const handleCreate = () => {
    if (!formData.text || !formData.description) return;
    
    const newAction: Action = {
      id: Date.now().toString(),
      icon: formData.icon,
      text: formData.text,
      description: formData.description
    };
    
    onChange([...actions, newAction]);
    setFormData({ icon: 'Sparkles', text: '', description: '' });
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingAction || !formData.text || !formData.description) return;
    
    onChange(actions.map(a => a.id === editingAction.id ? {
      ...a,
      icon: formData.icon,
      text: formData.text,
      description: formData.description
    } : a));
    
    setEditingAction(null);
    setFormData({ icon: 'Sparkles', text: '', description: '' });
  };

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setFormData({
      icon: action.icon,
      text: action.text,
      description: action.description
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Удалить это действие?')) return;
    onChange(actions.filter(a => a.id !== id));
  };

  const handleResetToDefault = () => {
    if (!confirm('Сбросить действия к стандартным? Все ваши настройки будут потеряны.')) return;
    
    const defaultActions: Action[] = [
      { id: '1', icon: 'Swords', text: 'Атаковать', description: 'Я атакую' },
      { id: '2', icon: 'Shield', text: 'Защититься', description: 'Я принимаю оборонительную позицию' },
      { id: '3', icon: 'MessageCircle', text: 'Поговорить', description: 'Я начинаю диалог' },
      { id: '4', icon: 'Eye', text: 'Осмотреться', description: 'Я внимательно осматриваюсь' },
      { id: '5', icon: 'Search', text: 'Исследовать', description: 'Я исследую окружение' },
      { id: '6', icon: 'Footprints', text: 'Отступить', description: 'Я осторожно отступаю' },
      { id: '7', icon: 'EyeOff', text: 'Спрятаться', description: 'Я прячусь' },
      { id: '8', icon: 'Zap', text: 'Бежать', description: 'Я бегу' },
      { id: '9', icon: 'Heart', text: 'Помочь', description: 'Я предлагаю помощь' },
      { id: '10', icon: 'Brain', text: 'Подумать', description: 'Я обдумываю ситуацию' },
      { id: '11', icon: 'Package', text: 'Использовать предмет', description: 'Я использую предмет' },
      { id: '12', icon: 'Wand2', text: 'Сотворить заклинание', description: 'Я творю заклинание' }
    ];
    
    onChange(defaultActions);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Sliders" size={20} />
              Кастомизация действий
            </CardTitle>
            <CardDescription className="mt-2">
              Настройте список быстрых действий для интерактивных историй
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleResetToDefault}>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Сбросить
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Icon name="Plus" size={16} />
                  Добавить действие
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новое действие</DialogTitle>
                  <DialogDescription>
                    Создайте кастомное действие для вашего персонажа
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="action-icon">Иконка</Label>
                    <Select value={formData.icon} onValueChange={(v) => setFormData({...formData, icon: v})}>
                      <SelectTrigger id="action-icon">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <Icon name={formData.icon as any} size={16} />
                            {formData.icon}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {availableIcons.map(icon => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              <Icon name={icon as any} size={16} />
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action-text">Название кнопки</Label>
                    <Input
                      id="action-text"
                      placeholder="Прыгнуть"
                      value={formData.text}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action-description">Описание действия</Label>
                    <Input
                      id="action-description"
                      placeholder="Я совершаю прыжок"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleCreate}
                    disabled={!formData.text || !formData.description}
                  >
                    Создать действие
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Card key={action.id} className="relative group">
              <CardContent className="p-4">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEdit(action)}
                  >
                    <Icon name="Edit" size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDelete(action.id)}
                  >
                    <Icon name="Trash2" size={12} />
                  </Button>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                    <Icon name={action.icon as any} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{action.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {actions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-50" />
            <p>Нет добавленных действий</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Добавить первое действие
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editingAction} onOpenChange={(open) => !open && setEditingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать действие</DialogTitle>
            <DialogDescription>
              Измените параметры действия
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-action-icon">Иконка</Label>
              <Select value={formData.icon} onValueChange={(v) => setFormData({...formData, icon: v})}>
                <SelectTrigger id="edit-action-icon">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Icon name={formData.icon as any} size={16} />
                      {formData.icon}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {availableIcons.map(icon => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        <Icon name={icon as any} size={16} />
                        {icon}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-action-text">Название кнопки</Label>
              <Input
                id="edit-action-text"
                placeholder="Прыгнуть"
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-action-description">Описание действия</Label>
              <Input
                id="edit-action-description"
                placeholder="Я совершаю прыжок"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleUpdate}
              disabled={!formData.text || !formData.description}
            >
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
