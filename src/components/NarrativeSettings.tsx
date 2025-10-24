import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface Character {
  id: string;
  name: string;
  role: string;
  character_type?: string;
}

interface NarrativeSettingsProps {
  narrativeMode: string;
  setNarrativeMode: (mode: string) => void;
  playerCharacterId: string;
  setPlayerCharacterId: (id: string) => void;
  characters: Character[];
}

export const NarrativeSettings = ({
  narrativeMode,
  setNarrativeMode,
  playerCharacterId,
  setPlayerCharacterId,
  characters
}: NarrativeSettingsProps) => {
  const playerCharacters = characters.filter(c => c.character_type === 'player');

  return (
    <Card className="border-2 border-primary/20 backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="text-xl font-serif flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Настройки повествования
        </CardTitle>
        <CardDescription>
          Выберите стиль повествования и своего персонажа
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="narrative-mode">Вид повествования</Label>
          <Select value={narrativeMode} onValueChange={setNarrativeMode}>
            <SelectTrigger id="narrative-mode">
              <SelectValue placeholder="Выберите вид повествования" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mixed">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 font-medium">
                    <Icon name="Users" size={16} />
                    Смешанный (Многоперсонажный)
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Узнавайте мысли и чувства всех персонажей
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="first_person">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 font-medium">
                    <Icon name="Eye" size={16} />
                    От первого лица
                  </div>
                  <span className="text-xs text-muted-foreground">
                    "Я иду по тёмному лесу, чувствуя напряжение..."
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="third_person">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 font-medium">
                    <Icon name="BookOpen" size={16} />
                    От третьего лица
                  </div>
                  <span className="text-xs text-muted-foreground">
                    "Герой шёл по лесу, не подозревая об опасности..."
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {playerCharacters.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="player-character">Ваш персонаж</Label>
            <Select value={playerCharacterId} onValueChange={setPlayerCharacterId}>
              <SelectTrigger id="player-character">
                <SelectValue placeholder="Выберите персонажа игрока" />
              </SelectTrigger>
              <SelectContent>
                {playerCharacters.map(char => (
                  <SelectItem key={char.id} value={char.id}>
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} />
                      <span className="font-medium">{char.name}</span>
                      <Badge variant="secondary" className="text-xs">{char.role}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!playerCharacterId && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="AlertCircle" size={12} />
                Создайте персонажа типа "Игрок" в разделе Персонажи
              </p>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              {narrativeMode === 'mixed' && 'Повествование ведётся от разных персонажей в разные моменты. Вы узнаете мысли, чувства и мотивы действий как вашего персонажа, так и NPC. Это позволяет видеть что другие думают о вас и понимать их скрытые намерения.'}
              {narrativeMode === 'first_person' && 'История будет рассказываться от лица вашего персонажа. Вы видите мир его глазами и знаете только то, что знает он.'}
              {narrativeMode === 'third_person' && 'История будет описывать события со стороны наблюдателя. Нейтральное повествование без погружения во внутренний мир персонажей.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};