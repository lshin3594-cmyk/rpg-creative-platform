import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CanonUniverseForm } from '@/components/universe/CanonUniverseForm';
import { CustomUniverseForm } from '@/components/universe/CustomUniverseForm';
import { CharacterForm } from '@/components/universe/CharacterForm';
import { GenerationSettings } from '@/components/universe/GenerationSettings';
import { SavedUniversesList } from '@/components/universe/SavedUniversesList';
import { EditUniverseDialog } from '@/components/universe/EditUniverseDialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { universeStorage, type Universe } from '@/lib/universeStorage';

interface UniverseData {
  name: string;
  description: string;
  canonSource: string;
  sourceType: 'canon' | 'custom';
  genre: string;
  tags: string[];
}

const CreateFanfic = () => {
  const [step, setStep] = useState<'universe' | 'character' | 'settings' | 'generate'>('universe');
  const [universeData, setUniverseData] = useState<UniverseData | null>(null);
  const [universeId, setUniverseId] = useState<number | null>(null);
  const [characterIds, setCharacterIds] = useState<number[]>([]);
  const [isCreatingUniverse, setIsCreatingUniverse] = useState(false);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [length, setLength] = useState('medium');
  const [style, setStyle] = useState('narrative');
  const [rating, setRating] = useState('teen');
  const [customPrompt, setCustomPrompt] = useState('');

  const [editingUniverse, setEditingUniverse] = useState<Universe | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { toast } = useToast();
  const navigate = useNavigate();

  const carouselImages = [
    'https://cdn.poehali.dev/files/11a64f46-796a-4ce6-9051-28d80e0c7bdd.jpg',
    'https://cdn.poehali.dev/files/b8e36227-587c-4816-8a2b-9039de9a03b1.jpeg',
    'https://cdn.poehali.dev/files/7b8ad11e-21c5-441e-99ca-9c54c2c89171.jpg',
  ];

  const handleUniverseSelect = (universe: Universe) => {
    const data: UniverseData = {
      name: universe.name,
      description: universe.description,
      canonSource: '',
      sourceType: 'custom',
      genre: universe.genre,
      tags: universe.tags,
    };
    handleUniverseCreate(data);
  };

  const handleUniverseCreate = async (data: UniverseData) => {
    setIsCreatingUniverse(true);
    
    try {
      universeStorage.save({
        name: data.name,
        description: data.description,
        genre: data.genre,
        tags: data.tags,
      });

      const response = await fetch('https://functions.poehali.dev/afd406e2-2b81-4659-ad8f-4fe5be7c1242', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          canon_source: data.canonSource,
          source_type: data.sourceType,
          genre: data.genre,
          tags: data.tags
        })
      });

      if (!response.ok) throw new Error('Failed to create universe');
      
      const result = await response.json();
      setUniverseId(result.universe_id);
      setUniverseData(data);
      setStep('character');
      
      toast({
        title: "Вселенная создана!",
        description: `${data.name} сохранена и готова к заселению персонажами`
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать вселенную",
        variant: "destructive"
      });
    } finally {
      setIsCreatingUniverse(false);
    }
  };

  const handleCharacterCreate = async (data: any) => {
    setIsCreatingCharacter(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/bdf99cda-0137-4587-8760-d89f239695a5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          universe_id: universeId
        })
      });

      if (!response.ok) throw new Error('Failed to create character');
      
      const result = await response.json();
      setCharacterIds(prev => [...prev, result.character_id]);
      
      toast({
        title: "Персонаж создан!",
        description: `${data.name} добавлен в историю`
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать персонажа",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCharacter(false);
    }
  };

  const handleGenerate = async () => {
    if (characterIds.length === 0) {
      toast({
        title: "Нужен персонаж",
        description: "Создайте хотя бы одного персонажа",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/397a81f0-4bbd-44c6-af80-eacbd644e110', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universe_id: universeId,
          character_ids: characterIds,
          length,
          style,
          rating,
          custom_prompt: customPrompt
        })
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const result = await response.json();
      
      toast({
        title: "Фанфик готов!",
        description: "История сгенерирована и сохранена"
      });
      
      navigate(`/story/${result.story_id}`);
    } catch (error) {
      toast({
        title: "Ошибка генерации",
        description: "Не удалось создать историю. Попробуйте ещё раз.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepIcon = (currentStep: string) => {
    if (step === 'universe') return currentStep === 'universe' ? 'Globe' : 'Check';
    if (step === 'character') {
      if (currentStep === 'universe') return 'Check';
      if (currentStep === 'character') return 'User';
      return 'Circle';
    }
    if (step === 'settings') {
      if (currentStep === 'settings') return 'Settings';
      if (currentStep === 'generate') return 'Circle';
      return 'Check';
    }
    if (step === 'generate') {
      return currentStep === 'generate' ? 'Sparkles' : 'Check';
    }
    return 'Circle';
  };

  return (
    <PageLayout
      carouselImages={carouselImages}
      currentImageIndex={0}
      onNextImage={() => {}}
      onPrevImage={() => {}}
      onSelectIndex={() => {}}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Icon name="PenTool" size={32} />
            Создать фанфик
          </h1>
          <p className="text-muted-foreground mt-1">
            Пошаговое создание уникальной истории
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          {['universe', 'character', 'settings', 'generate'].map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${step === s ? 'text-primary' : step > s ? 'text-green-500' : 'text-muted-foreground'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === s ? 'bg-primary text-primary-foreground' : step > s ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                  <Icon name={getStepIcon(s) as any} size={20} />
                </div>
                <span className="text-sm font-medium hidden md:inline">
                  {s === 'universe' && 'Вселенная'}
                  {s === 'character' && 'Персонаж'}
                  {s === 'settings' && 'Настройки'}
                  {s === 'generate' && 'Генерация'}
                </span>
              </div>
              {i < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-green-500' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            {step === 'universe' && (
              <Tabs defaultValue="canon">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="canon">
                    <Icon name="Library" size={16} className="mr-2" />
                    Канонические вселенные
                  </TabsTrigger>
                  <TabsTrigger value="custom">
                    <Icon name="Wand2" size={16} className="mr-2" />
                    Своя вселенная
                  </TabsTrigger>
                  <TabsTrigger value="saved">
                    <Icon name="Bookmark" size={16} className="mr-2" />
                    Сохранённые
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="canon">
                  <CanonUniverseForm
                    onSubmit={handleUniverseCreate}
                    isCreating={isCreatingUniverse}
                  />
                </TabsContent>

                <TabsContent value="custom">
                  <CustomUniverseForm
                    onSubmit={handleUniverseCreate}
                    isCreating={isCreatingUniverse}
                  />
                </TabsContent>

                <TabsContent value="saved">
                  <SavedUniversesList
                    key={refreshKey}
                    onSelect={handleUniverseSelect}
                    onEdit={setEditingUniverse}
                  />
                </TabsContent>
              </Tabs>
            )}

            {step === 'character' && universeData && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-1">Вселенная: {universeData.name}</h3>
                  <p className="text-sm text-muted-foreground">{universeData.description}</p>
                </div>

                <CharacterForm
                  onSubmit={handleCharacterCreate}
                  isLoading={isCreatingCharacter}
                />

                {characterIds.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Check" size={20} className="text-green-500" />
                      <span className="text-sm font-medium">
                        Персонажей создано: {characterIds.length}
                      </span>
                    </div>
                    <Button onClick={() => setStep('settings')}>
                      Далее
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 'settings' && (
              <div className="space-y-6">
                <GenerationSettings
                  length={length}
                  style={style}
                  rating={rating}
                  customPrompt={customPrompt}
                  onLengthChange={setLength}
                  onStyleChange={setStyle}
                  onRatingChange={setRating}
                  onCustomPromptChange={setCustomPrompt}
                />

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setStep('character')}>
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                  <Button onClick={() => setStep('generate')}>
                    Далее
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'generate' && universeData && (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Sparkles" size={48} className="text-primary" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">Всё готово к генерации!</h3>
                  <p className="text-muted-foreground">
                    ИИ создаст уникальную историю по вашим параметрам
                  </p>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Вселенная:</span>
                    <span className="font-medium">{universeData.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Персонажей:</span>
                    <span className="font-medium">{characterIds.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Длина:</span>
                    <span className="font-medium capitalize">{length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Стиль:</span>
                    <span className="font-medium capitalize">{style}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Рейтинг:</span>
                    <span className="font-medium capitalize">{rating}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setStep('settings')} disabled={isGenerating}>
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Изменить настройки
                  </Button>
                  <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                    {isGenerating ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Генерация...
                      </>
                    ) : (
                      <>
                        <Icon name="Sparkles" size={20} className="mr-2" />
                        Создать фанфик
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EditUniverseDialog
        universe={editingUniverse}
        open={!!editingUniverse}
        onOpenChange={(open) => !open && setEditingUniverse(null)}
        onSave={() => setRefreshKey(prev => prev + 1)}
      />
    </PageLayout>
  );
};

export default CreateFanfic;