import { useState } from 'react';
import { useRpgGames } from '@/hooks/useRpgGames';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CharacterCreation, CharacterData } from './CharacterCreation';
import { gameTemplates, GameTemplate } from './templates/gameTemplates';
import { TemplateCard } from './templates/TemplateCard';

export const TemplateLibrary = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { createGame } = useRpgGames();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelectTemplate = (template: GameTemplate) => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите, чтобы начать игру',
        variant: 'destructive'
      });
      return;
    }
    setSelectedTemplate(template);
    setShowCharacterCreation(true);
  };

  const handleCharacterComplete = async (character: CharacterData) => {
    if (!selectedTemplate) return;

    setIsStarting(true);

    try {
      const genderText = character.gender === 'male' ? 'мужчина' : character.gender === 'female' ? 'женщина' : 'небинарная персона';
      
      const characterInfo = `Главный герой: ${character.name} (${genderText}). ${character.description}`;
      
      const enhancedInstructions = `${selectedTemplate.aiInstructions}

ИНФОРМАЦИЯ О ГЛАВНОМ ГЕРОЕ:
${characterInfo}

ВАЖНО: Обращайся к игроку как "${character.name}" и используй соответствующие местоимения согласно полу (${genderText}). Учитывай описание персонажа в повествовании.`;

      const gameSettings = {
        role: 'hero',
        narrativeMode: 'first',
        playerCount: 1,
        genre: selectedTemplate.genre,
        rating: selectedTemplate.rating,
        aiModel: 'deepseek',
        aiInstructions: enhancedInstructions,
        playerCharacter: character,
        initialCharacters: [],
        storyMemory: {
          keyMoments: [],
          characterRelationships: {},
          worldChanges: []
        }
      };

      const newGame = await createGame({
        title: selectedTemplate.title,
        genre: selectedTemplate.genre,
        setting: selectedTemplate.setting,
        difficulty: selectedTemplate.rating,
        story_context: JSON.stringify(gameSettings)
      });

      if (newGame) {
        toast({
          title: 'Поехали! 🚀',
          description: `${character.name} начинает приключение!`
        });
        navigate('/play-game', { state: { gameId: newGame.id } });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать игру',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать игру',
        variant: 'destructive'
      });
    } finally {
      setIsStarting(false);
    }
  };

  if (showCharacterCreation && selectedTemplate) {
    return (
      <CharacterCreation
        templateTitle={selectedTemplate.title}
        templateSetting={selectedTemplate.setting}
        onComplete={handleCharacterComplete}
        onBack={() => {
          setShowCharacterCreation(false);
          setSelectedTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Библиотека шаблонов</h2>
        <p className="text-purple-200/80">Выберите готовую историю и начните играть</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gameTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            isStarting={isStarting}
            onSelect={() => setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)}
            onStartGame={() => handleSelectTemplate(template)}
          />
        ))}
      </div>
    </div>
  );
};
