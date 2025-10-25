import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { StoryGenerator } from '@/components/StoryGenerator';
import { InteractiveStory } from '@/components/InteractiveStory';
import { MainTabs } from '@/components/MainTabs';
import { useDataManagement } from '@/hooks/useDataManagement';
import { useStoryGeneration } from '@/hooks/useStoryGeneration';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [selectedNarrativeCharacters, setSelectedNarrativeCharacters] = useState<string[]>([]);
  const [episodeLength, setEpisodeLength] = useState(1500);
  const [imagesPerEpisode, setImagesPerEpisode] = useState(2);
  const [playerInstructions, setPlayerInstructions] = useState('');
  const [autoGenerateNPCs, setAutoGenerateNPCs] = useState(true);
  const [npcCount, setNpcCount] = useState(2);
  const [npcTypes, setNpcTypes] = useState<string[]>([]);
  const [selectedPlot, setSelectedPlot] = useState('');

  const carouselImages = [
    'https://cdn.poehali.dev/files/11a64f46-796a-4ce6-9051-28d80e0c7bdd.jpg',
    'https://cdn.poehali.dev/files/b8e36227-587c-4816-8a2b-9039de9a03b1.jpeg',
    'https://cdn.poehali.dev/files/7b8ad11e-21c5-441e-99ca-9c54c2c89171.jpg',
    'https://cdn.poehali.dev/files/e3766a2e-6760-4742-a80e-e08c62084f78.jpeg',
    'https://cdn.poehali.dev/files/0b50d103-c351-486e-b78d-d92a1e56d99b.jpeg'
  ];

  const {
    characters,
    worlds,
    plots,
    savedStories,
    isLoadingStories,
    profileStats,
    loadCharacters,
    loadWorlds,
    loadPlots,
    loadStories,
    createCharacter,
    createWorld,
    createPlot,
    updateCharacter,
    updateWorld,
    updatePlot,
    deleteCharacter,
    deleteWorld,
    deletePlot,
    deleteStory,
    toggleFavorite
  } = useDataManagement();

  const {
    isGenerating,
    generatedStory,
    storyPrompt,
    setStoryPrompt,
    selectedCharacter,
    setSelectedCharacter,
    selectedWorld,
    setSelectedWorld,
    narrativeMode,
    setNarrativeMode,
    playerCharacterId,
    setPlayerCharacterId,
    showInteractive,
    setShowInteractive,
    setCurrentStoryContext,
    generateStory,
    continueStory
  } = useStoryGeneration();

  const {
    playCardSound,
    playNavigationSound,
    playCreateSound,
    playDeleteSound,
    playStorySound,
    playSaveSound
  } = useSoundEffects();

  useEffect(() => {
    const initData = async () => {
      const loadedChars = await loadCharacters();
      await loadWorlds();
      await loadPlots();
      await loadStories();

      if (!playerCharacterId && loadedChars.length > 0) {
        const firstPlayer = loadedChars.find((c: any) => c.character_type === 'player');
        if (firstPlayer) {
          setPlayerCharacterId(firstPlayer.id);
        }
      }
    };

    initData();
  }, []);

  const nextImage = () => {
    playNavigationSound('next');
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    playNavigationSound('prev');
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleCreateCharacter = async (data: any) => {
    const success = await createCharacter(data);
    if (success) playCreateSound();
  };

  const handleCreateWorld = async (data: any) => {
    const success = await createWorld(data);
    if (success) playCreateSound();
  };

  const handleCreatePlot = async (data: any) => {
    const success = await createPlot(data);
    if (success) playCreateSound();
  };

  const handleDeleteCharacter = async (id: string) => {
    const success = await deleteCharacter(id);
    if (success) playDeleteSound();
  };

  const handleDeleteWorld = async (id: string) => {
    const success = await deleteWorld(id);
    if (success) playDeleteSound();
  };

  const handleDeletePlot = async (id: string) => {
    const success = await deletePlot(id);
    if (success) playDeleteSound();
  };

  const handleUpdateCharacter = async (id: string, data: any) => {
    const success = await updateCharacter(id, data);
    if (success) playCreateSound();
  };

  const handleUpdateWorld = async (id: string, data: any) => {
    const success = await updateWorld(id, data);
    if (success) playCreateSound();
  };

  const handleUpdatePlot = async (id: string, data: any) => {
    const success = await updatePlot(id, data);
    if (success) playCreateSound();
  };

  const handleDeleteStory = async (id: number) => {
    const success = await deleteStory(id);
    if (success) playDeleteSound();
  };

  const handleToggleFavorite = async (id: number) => {
    const success = await toggleFavorite(id);
    if (success) playCardSound();
  };

  const handleGenerateStory = async () => {
    await generateStory(characters, worlds, () => {
      playStorySound();
      playSaveSound();
      loadStories();
    });
  };

  const handleContinueStory = async (playerAction: string) => {
    return await continueStory(playerAction, characters, worlds);
  };

  return (
    <PageLayout
      carouselImages={carouselImages}
      currentImageIndex={currentImageIndex}
      onNextImage={nextImage}
      onPrevImage={prevImage}
      onSelectIndex={setCurrentImageIndex}
    >
      <StoryGenerator
        isOpen={isStoryDialogOpen}
        onOpenChange={(open) => {
          setIsStoryDialogOpen(open);
          if (!open) {
            setShowInteractive(false);
            setCurrentStoryContext('');
          }
        }}
        storyPrompt={storyPrompt}
        setStoryPrompt={setStoryPrompt}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
        selectedWorld={selectedWorld}
        setSelectedWorld={setSelectedWorld}
        isGenerating={isGenerating}
        generatedStory={generatedStory}
        onGenerate={handleGenerateStory}
        characters={characters}
        worlds={worlds}
        plots={plots}
        episodeLength={episodeLength}
        setEpisodeLength={setEpisodeLength}
        imagesPerEpisode={imagesPerEpisode}
        setImagesPerEpisode={setImagesPerEpisode}
        playerInstructions={playerInstructions}
        setPlayerInstructions={setPlayerInstructions}
        autoGenerateNPCs={autoGenerateNPCs}
        setAutoGenerateNPCs={setAutoGenerateNPCs}
        npcCount={npcCount}
        setNpcCount={setNpcCount}
        npcTypes={npcTypes}
        setNpcTypes={setNpcTypes}
        selectedPlot={selectedPlot}
        setSelectedPlot={setSelectedPlot}
        narrativeMode={narrativeMode}
        setNarrativeMode={setNarrativeMode}
        playerCharacterId={playerCharacterId}
        setPlayerCharacterId={setPlayerCharacterId}
        selectedNarrativeCharacters={selectedNarrativeCharacters}
        setSelectedNarrativeCharacters={setSelectedNarrativeCharacters}
      />

      {showInteractive && generatedStory && (
        <div className="max-w-4xl mx-auto mb-8">
          <InteractiveStory
            initialStory={generatedStory}
            narrativeMode={narrativeMode}
            playerCharacter={playerCharacterId ? characters.find(c => c.id === playerCharacterId)?.name || '' : ''}
            npcCharacters={characters.filter(c => c.character_type === 'npc').map(c => c.name).join(', ')}
            world={selectedWorld ? worlds.find(w => w.id === selectedWorld)?.name || '' : ''}
            genre={selectedWorld ? worlds.find(w => w.id === selectedWorld)?.genre || 'фэнтези' : 'фэнтези'}
            onContinue={handleContinueStory}
            onPlaySound={playCardSound}
          />
        </div>
      )}

      <MainTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        characters={characters}
        worlds={worlds}
        plots={plots}
        stories={savedStories}
        favoriteStories={savedStories.filter(s => s.is_favorite)}
        isLoadingStories={isLoadingStories}
        profileStats={profileStats}
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        onOpenStoryDialog={() => setIsStoryDialogOpen(true)}
        onCardClick={playCardSound}
        onDeleteCharacter={handleDeleteCharacter}
        onDeleteWorld={handleDeleteWorld}
        onDeletePlot={handleDeletePlot}
        onDeleteStory={handleDeleteStory}
        onToggleFavorite={handleToggleFavorite}
        onCreateCharacter={handleCreateCharacter}
        onCreateWorld={handleCreateWorld}
        onCreatePlot={handleCreatePlot}
        onUpdateCharacter={handleUpdateCharacter}
        onUpdateWorld={handleUpdateWorld}
        onUpdatePlot={handleUpdatePlot}
      />

      <button
        onClick={() => {
          playStorySound();
          setIsStoryDialogOpen(true);
        }}
        className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-6 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3 group"
      >
        <Icon name="Sparkles" size={24} className="animate-pulse" />
        <span className="font-bold text-lg hidden md:inline">Начать приключение</span>
      </button>
    </PageLayout>
  );
};

export default Index;