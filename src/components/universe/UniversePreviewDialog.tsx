import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { canonUniverses } from './universeTypes';

interface UniversePreviewDialogProps {
  universe: typeof canonUniverses[0] | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const UniversePreviewDialog = ({
  universe,
  isOpen,
  onOpenChange,
  onSelect,
  isFavorite,
  onToggleFavorite
}: UniversePreviewDialogProps) => {
  if (!universe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-serif flex items-center gap-3">
                <Icon name={universe.icon as any} size={32} className="text-primary" />
                {universe.name}
              </DialogTitle>
              <DialogDescription className="mt-2 text-base">
                {universe.description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className="h-10 w-10 p-0"
            >
              <Icon 
                name="Star" 
                size={24} 
                className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'} 
              />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="BookOpen" size={18} className="text-primary" />
              <h3 className="font-semibold text-lg">Источник</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              {universe.source}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="Tags" size={18} className="text-primary" />
              <h3 className="font-semibold text-lg">Жанры и теги</h3>
            </div>
            <div className="flex flex-wrap gap-2 pl-7">
              {universe.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="Lightbulb" size={18} className="text-primary" />
              <h3 className="font-semibold text-lg">Что можно создать?</h3>
            </div>
            <div className="pl-7 space-y-2 text-sm text-muted-foreground">
              {getUniverseSuggestions(universe.name).map((suggestion, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon name="Sparkles" size={14} className="mt-0.5 text-primary flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="Info" size={18} className="text-primary" />
              <h3 className="font-semibold text-lg">Как это работает?</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              Когда вы выберете эту вселенную, ИИ изучит её правила, персонажей, локации и стиль повествования. 
              Все созданные истории будут соответствовать канону и атмосфере {universe.name}.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="flex-1 gap-2" onClick={onSelect}>
              <Icon name="Check" size={20} />
              Выбрать эту вселенную
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function getUniverseSuggestions(universeName: string): string[] {
  const suggestions: Record<string, string[]> = {
    'Гарри Поттер': [
      'Истории о студентах Хогвартса в разные эпохи',
      'Приключения в других магических школах мира',
      'Жизнь магглорождённых волшебников',
      'Квиддичные турниры и спортивные драмы'
    ],
    'Властелин колец': [
      'Путешествия по неизведанным землям Средиземья',
      'Истории о Первой и Второй эпохах',
      'Приключения гномов в Мории',
      'Жизнь хоббитов в Шире'
    ],
    'Звёздные войны': [
      'Истории джедаев и ситхов',
      'Приключения контрабандистов и пилотов',
      'Политические интриги Сената',
      'Войны клонов с новыми персонажами'
    ],
    'Marvel': [
      'Истории новых супергероев',
      'Команды Мстителей в параллельных вселенных',
      'Происхождение злодеев',
      'Уличные герои и их повседневные подвиги'
    ],
    'Игра престолов': [
      'Политические интриги малых домов',
      'Истории до восстания Роберта',
      'Приключения за Узким морем',
      'Жизнь простых людей в Семи Королевствах'
    ],
    'Ведьмак': [
      'Истории других ведьмаков из разных школ',
      'Приключения чародеек и магов',
      'Охота на редких монстров',
      'Политика королевств Севера'
    ],
    'Сверхъестественное': [
      'Охотники на монстров в других странах',
      'Истории ангелов и демонов',
      'Расследования паранормальных явлений',
      'Семейные династии охотников'
    ],
    'Mo Dao Zu Shi': [
      'Путь культивации новых учеников',
      'Истории других великих кланов',
      'Охота на злых духов',
      'Романтика в мире культиваторов'
    ]
  };

  return suggestions[universeName] || [
    'Новые истории с оригинальными персонажами',
    'Альтернативные события из канона',
    'Исследование неизвестных аспектов мира',
    'Приключения в разные временные периоды'
  ];
}
