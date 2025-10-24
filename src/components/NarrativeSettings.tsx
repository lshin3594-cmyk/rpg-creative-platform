import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  selectedNarrativeCharacters?: string[];
  setSelectedNarrativeCharacters?: (ids: string[]) => void;
}

export const NarrativeSettings = ({
  narrativeMode,
  setNarrativeMode,
  playerCharacterId,
  setPlayerCharacterId,
  characters,
  selectedNarrativeCharacters = [],
  setSelectedNarrativeCharacters
}: NarrativeSettingsProps) => {
  const playerCharacters = characters.filter(c => c.character_type === 'player');
  const [showExample, setShowExample] = useState(false);

  const narrativeExamples = {
    mixed: {
      title: 'Смешанный (Многоперсонажный)',
      parts: [
        { type: 'normal', text: 'Ты медленно подходишь к древнему алтарю, чувствуя как воздух становится тяжелее. Твоя рука тянется к светящемуся кристаллу.' },
        { type: 'thought', text: 'Эльфийка Лира напрягается, наблюдая за тобой. "Нет... если он прикоснётся к артефакту, печать сломается. Но я не могу остановить его силой — он мне доверяет. Что мне делать?"' },
        { type: 'normal', text: 'Её пальцы незаметно скользят к мешочку с защитными рунами.' },
        { type: 'normal', text: 'Ты оборачиваешься и видишь её бледное лицо. "Лира, всё в порядке?" — спрашиваешь ты, не подозревая о её внутренней борьбе.' },
        { type: 'thought', text: '"Он не знает правды, — думает она, борясь с желанием всё рассказать. — Я должна защитить его... даже если это будет стоить мне его доверия."' }
      ],
      description: 'Вы видите мысли и чувства всех персонажей, понимаете скрытые мотивы и конфликты'
    },
    first_person: {
      title: 'От первого лица',
      parts: [
        { type: 'normal', text: 'Я медленно подхожу к древнему алтарю, чувствуя как воздух становится тяжелее с каждым шагом. Моя рука тянется к светящемуся кристаллу — он манит меня, обещая невероятную силу.' },
        { type: 'normal', text: 'Позади я слышу тихий вздох Лиры. Оборачиваюсь — её лицо выглядит странно бледным в голубоватом свете артефакта. "Лира, всё в порядке?" — спрашиваю я, пытаясь понять, что её так беспокоит.' },
        { type: 'normal', text: 'Она медлит с ответом, и я замечаю, как её рука скользит к поясу. Неужели она мне не доверяет? Или здесь таится опасность, о которой я не знаю?' }
      ],
      description: 'Только ваша точка зрения, ваши мысли и то, что вы можете наблюдать'
    },
    third_person: {
      title: 'От третьего лица',
      parts: [
        { type: 'normal', text: 'Искатель медленно приблизился к древнему алтарю. Его рука потянулась к светящемуся кристаллу, который пульсировал мягким голубым светом.' },
        { type: 'normal', text: 'Эльфийка Лира застыла у входа в зал, наблюдая за происходящим. Её лицо побледнело, рука незаметно скользнула к поясу, где висел мешочек с рунами.' },
        { type: 'normal', text: '"Лира, всё в порядке?" — обернулся к ней путник. Она медлила с ответом, её взгляд метался между ним и артефактом. Напряжение в зале нарастало с каждой секундой.' }
      ],
      description: 'Объективное описание событий, без погружения во внутренний мир'
    }
  };

  const currentExample = narrativeExamples[narrativeMode as keyof typeof narrativeExamples];

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

        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              {narrativeMode === 'mixed' && 'Повествование ведётся от разных персонажей в разные моменты. Вы узнаете мысли, чувства и мотивы действий как вашего персонажа, так и NPC. Это позволяет видеть что другие думают о вас и понимать их скрытые намерения.'}
              {narrativeMode === 'first_person' && 'История будет рассказываться от лица вашего персонажа. Вы видите мир его глазами и знаете только то, что знает он.'}
              {narrativeMode === 'third_person' && 'История будет описывать события со стороны наблюдателя. Нейтральное повествование без погружения во внутренний мир персонажей.'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => setShowExample(!showExample)}
          >
            <Icon name={showExample ? "EyeOff" : "Eye"} size={16} />
            {showExample ? 'Скрыть пример' : 'Показать пример'}
          </Button>

          {showExample && currentExample && (
            <Card className="border border-primary/30 bg-primary/5 animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Sparkles" size={16} className="text-primary" />
                  {currentExample.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {currentExample.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentExample.parts.map((part, index) => (
                    <p
                      key={index}
                      className={`text-sm leading-relaxed ${
                        part.type === 'thought'
                          ? 'italic text-primary/90 pl-4 border-l-2 border-primary/50 bg-primary/10 py-2 rounded-r'
                          : 'text-foreground/90'
                      }`}
                    >
                      {part.text}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};