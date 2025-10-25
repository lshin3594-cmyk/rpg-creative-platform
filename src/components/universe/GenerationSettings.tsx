import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GenerationSettingsProps {
  length: string;
  style: string;
  rating: string;
  customPrompt: string;
  onLengthChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onCustomPromptChange: (value: string) => void;
}

export const GenerationSettings = ({
  length,
  style,
  rating,
  customPrompt,
  onLengthChange,
  onStyleChange,
  onRatingChange,
  onCustomPromptChange
}: GenerationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Настройки генерации
        </CardTitle>
        <CardDescription>
          Управляйте параметрами создания фанфика
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">Длина текста</Label>
            <Select value={length} onValueChange={onLengthChange}>
              <SelectTrigger id="length">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    <div>
                      <div className="font-medium">Короткий</div>
                      <div className="text-xs text-muted-foreground">500-1000 слов</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Icon name="Book" size={16} />
                    <div>
                      <div className="font-medium">Средний</div>
                      <div className="text-xs text-muted-foreground">1500-2500 слов</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="long">
                  <div className="flex items-center gap-2">
                    <Icon name="BookOpen" size={16} />
                    <div>
                      <div className="font-medium">Длинный</div>
                      <div className="text-xs text-muted-foreground">3000-5000 слов</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Стиль повествования</Label>
            <Select value={style} onValueChange={onStyleChange}>
              <SelectTrigger id="style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narrative">
                  <div className="flex items-center gap-2">
                    <Icon name="Feather" size={16} />
                    <div>
                      <div className="font-medium">Повествование</div>
                      <div className="text-xs text-muted-foreground">От третьего лица</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="dialogue">
                  <div className="flex items-center gap-2">
                    <Icon name="MessageSquare" size={16} />
                    <div>
                      <div className="font-medium">Диалоги</div>
                      <div className="text-xs text-muted-foreground">Акцент на общении</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="descriptive">
                  <div className="flex items-center gap-2">
                    <Icon name="Eye" size={16} />
                    <div>
                      <div className="font-medium">Описательный</div>
                      <div className="text-xs text-muted-foreground">Детальные описания</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="poetic">
                  <div className="flex items-center gap-2">
                    <Icon name="Sparkles" size={16} />
                    <div>
                      <div className="font-medium">Поэтичный</div>
                      <div className="text-xs text-muted-foreground">Метафоры и образы</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Рейтинг контента</Label>
            <Select value={rating} onValueChange={onRatingChange}>
              <SelectTrigger id="rating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    <div>
                      <div className="font-medium">Для всех</div>
                      <div className="text-xs text-muted-foreground">Без ограничений</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="teen">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} />
                    <div>
                      <div className="font-medium">Подростки</div>
                      <div className="text-xs text-muted-foreground">Лёгкая романтика</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="mature">
                  <div className="flex items-center gap-2">
                    <Icon name="Shield" size={16} />
                    <div>
                      <div className="font-medium">Взрослые</div>
                      <div className="text-xs text-muted-foreground">Сложные темы</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customPrompt">Дополнительные указания (опционально)</Label>
          <Textarea
            id="customPrompt"
            placeholder="Например: Добавь больше юмора, сделай акцент на дружбе персонажей, включи неожиданный поворот в сюжете..."
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Опишите, что вы хотите увидеть в истории. ИИ учтёт ваши пожелания при генерации.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
