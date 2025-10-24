import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { ImageCarousel } from '@/components/ImageCarousel';
import { BackgroundVeins } from '@/components/BackgroundVeins';
import { StoryGenerator } from '@/components/StoryGenerator';
import { CharactersTab } from '@/components/CharactersTab';
import { WorldsTab } from '@/components/WorldsTab';
import { StoriesTab } from '@/components/StoriesTab';
import { ProfileTab } from '@/components/ProfileTab';
import { NarrativeSettings } from '@/components/NarrativeSettings';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string;
}

interface Story {
  id: number;
  title: string;
  content: string;
  prompt: string;
  character_name: string;
  world_name: string;
  genre: string;
  created_at: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const [profileStats, setProfileStats] = useState({
    charactersCreated: 0,
    worldsCreated: 0,
    storiesGenerated: 0,
    totalWords: 0
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedWorld, setSelectedWorld] = useState<string>('');
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [narrativeMode, setNarrativeMode] = useState('mixed');
  const [playerCharacterId, setPlayerCharacterId] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);
  const [isLoadingWorlds, setIsLoadingWorlds] = useState(false);

  const carouselImages = [
    'https://cdn.poehali.dev/files/11a64f46-796a-4ce6-9051-28d80e0c7bdd.jpg',
    'https://cdn.poehali.dev/files/b8e36227-587c-4816-8a2b-9039de9a03b1.jpeg',
    'https://cdn.poehali.dev/files/7b8ad11e-21c5-441e-99ca-9c54c2c89171.jpg',
    'https://cdn.poehali.dev/files/e3766a2e-6760-4742-a80e-e08c62084f78.jpeg',
    'https://cdn.poehali.dev/files/0b50d103-c351-486e-b78d-d92a1e56d99b.jpeg'
  ];

  const playSound = (frequency: number, duration: number = 0.3) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playCardSound = () => {
    playSound(1000, 0.2);
  };

  const nextImage = () => {
    playSound(900);
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    playSound(600);
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const loadStories = async () => {
    setIsLoadingStories(true);
    try {
      const response = await fetch('https://functions.poehali.dev/4edb076b-0c05-4d7c-853b-526d0c476653');
      const data = await response.json();
      if (data.stories) {
        setSavedStories(data.stories);
        const totalWords = data.stories.reduce((sum: number, story: Story) => {
          return sum + (story.content?.split(' ').length || 0);
        }, 0);
        setProfileStats(prev => ({ 
          ...prev, 
          storiesGenerated: data.stories.length,
          totalWords 
        }));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setIsLoadingStories(false);
    }
  };

  const loadCharacters = async () => {
    setIsLoadingCharacters(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=characters');
      const data = await response.json();
      const loadedChars = data.map((c: any) => ({
        ...c,
        id: String(c.id)
      }));
      setCharacters(loadedChars);
      setProfileStats(prev => ({ ...prev, charactersCreated: data.length }));
      
      if (!playerCharacterId && loadedChars.length > 0) {
        const firstPlayer = loadedChars.find((c: any) => c.character_type === 'player');
        if (firstPlayer) {
          setPlayerCharacterId(firstPlayer.id);
        }
      }
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setIsLoadingCharacters(false);
    }
  };

  const loadWorlds = async () => {
    setIsLoadingWorlds(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=worlds');
      const data = await response.json();
      setWorlds(data.map((w: any) => ({
        ...w,
        id: String(w.id)
      })));
      setProfileStats(prev => ({ ...prev, worldsCreated: data.length }));
    } catch (error) {
      console.error('Error loading worlds:', error);
    } finally {
      setIsLoadingWorlds(false);
    }
  };

  const deleteStory = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/aaff4c60-19e2-4410-a5a6-48560de30278?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        playSound(400, 0.3);
        await loadStories();
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=characters&id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        playSound(400, 0.3);
        await loadCharacters();
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const deleteWorld = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=worlds&id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        playSound(400, 0.3);
        await loadWorlds();
      }
    } catch (error) {
      console.error('Error deleting world:', error);
    }
  };

  const createCharacter = async (data: Omit<Character, 'id'>) => {
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        playSound(1200, 0.4);
        await loadCharacters();
      }
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  const createWorld = async (data: Omit<World, 'id'>) => {
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=worlds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        playSound(1200, 0.4);
        await loadWorlds();
      }
    } catch (error) {
      console.error('Error creating world:', error);
    }
  };

  useEffect(() => {
    loadStories();
    loadCharacters();
    loadWorlds();
  }, []);

  const saveStory = async (storyContent: string) => {
    const character = selectedCharacter ? characters.find(c => c.id === selectedCharacter) : null;
    const world = selectedWorld ? worlds.find(w => w.id === selectedWorld) : null;
    
    try {
      const response = await fetch('https://functions.poehali.dev/71ffaad1-3e69-422c-ad49-81aec9f550de', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: storyPrompt.substring(0, 100),
          content: storyContent,
          prompt: storyPrompt,
          character_name: character?.name || '',
          world_name: world?.name || '',
          genre: world?.genre || 'фэнтези'
        })
      });
      
      const savedStory = await response.json();
      if (savedStory.id) {
        playSound(1500, 0.4);
        await loadStories();
      }
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const generateStory = async () => {
    if (!storyPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const playerChar = playerCharacterId ? characters.find(c => c.id === playerCharacterId) : null;
      const npcChars = characters.filter(c => c.character_type === 'npc');
      const world = selectedWorld ? worlds.find(w => w.id === selectedWorld) : null;
      
      const npcCharactersText = npcChars.map(c => 
        `${c.name} (${c.role}) - ${c.personality}`
      ).join('; ');
      
      const response = await fetch('https://functions.poehali.dev/52ab4d94-b7a4-4399-ab17-b239ff31342a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: storyPrompt,
          character: playerChar ? `${playerChar.name} (${playerChar.role}) - ${playerChar.personality}` : '',
          npc_characters: npcCharactersText,
          world: world ? `${world.name} - ${world.description}` : '',
          genre: world?.genre || 'фэнтези',
          narrative_mode: narrativeMode
        })
      });
      
      const data = await response.json();
      if (data.story) {
        playSound(1200, 0.5);
        setGeneratedStory(data.story);
        await saveStory(data.story);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };



  const veins = [
    { x1: '10%', y1: '20%', x2: '30%', y2: '50%', color: 'rgba(236, 72, 153, 0.3)', delay: '0s' },
    { x1: '70%', y1: '10%', x2: '90%', y2: '40%', color: 'rgba(168, 85, 247, 0.3)', delay: '1s' },
    { x1: '20%', y1: '60%', x2: '50%', y2: '90%', color: 'rgba(236, 72, 153, 0.3)', delay: '2s' },
    { x1: '60%', y1: '50%', x2: '85%', y2: '80%', color: 'rgba(168, 85, 247, 0.3)', delay: '1.5s' },
    { x1: '40%', y1: '30%', x2: '60%', y2: '60%', color: 'rgba(236, 72, 153, 0.3)', delay: '0.5s' },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <BackgroundVeins veins={veins} />
      
      <div className="relative z-10">
        <ImageCarousel 
          images={carouselImages}
          currentIndex={currentImageIndex}
          onNext={nextImage}
          onPrev={prevImage}
          onSelectIndex={setCurrentImageIndex}
        />
        
        <div className="container mx-auto px-4 py-8">
          <header className="mb-16 text-center animate-fade-in relative">
            <div className="inline-block mb-6">
              <div className="w-16 h-1 bg-primary mx-auto mb-8" />
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 tracking-wide">
              <span className="text-foreground">Amazing</span>{' '}
              <span className="text-primary font-bold">ADVENTURES</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Освободись от рутины. Создавай персонажей, миры и истории — 
              это твоё путешествие без границ и цензуры
            </p>
          </header>

          <div className="max-w-4xl mx-auto mb-8">
            <NarrativeSettings 
              narrativeMode={narrativeMode}
              setNarrativeMode={setNarrativeMode}
              playerCharacterId={playerCharacterId}
              setPlayerCharacterId={setPlayerCharacterId}
              characters={characters}
            />
          </div>

          <StoryGenerator
            isOpen={isStoryDialogOpen}
            onOpenChange={setIsStoryDialogOpen}
            storyPrompt={storyPrompt}
            setStoryPrompt={setStoryPrompt}
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
            selectedWorld={selectedWorld}
            setSelectedWorld={setSelectedWorld}
            isGenerating={isGenerating}
            generatedStory={generatedStory}
            onGenerate={generateStory}
            characters={characters}
            worlds={worlds}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="characters" className="gap-2">
                <Icon name="Users" size={18} />
                Персонажи
              </TabsTrigger>
              <TabsTrigger value="worlds" className="gap-2">
                <Icon name="Globe" size={18} />
                Миры
              </TabsTrigger>
              <TabsTrigger value="stories" className="gap-2">
                <Icon name="BookOpen" size={18} />
                Сюжеты
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <Icon name="User" size={18} />
                Профиль
              </TabsTrigger>
            </TabsList>

            <TabsContent value="characters">
              <CharactersTab 
                characters={characters}
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                onCardClick={playCardSound}
                onDelete={deleteCharacter}
                onCreate={createCharacter}
              />
            </TabsContent>

            <TabsContent value="worlds">
              <WorldsTab 
                worlds={worlds}
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                onCardClick={playCardSound}
                onDelete={deleteWorld}
                onCreate={createWorld}
              />
            </TabsContent>

            <TabsContent value="stories">
              <StoriesTab
                stories={savedStories}
                isLoading={isLoadingStories}
                onCreateNew={() => setIsStoryDialogOpen(true)}
                onCardClick={playCardSound}
                onDelete={deleteStory}
              />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileTab 
                stats={profileStats}
                onPlaySound={playCardSound}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;