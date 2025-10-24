import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { ImageCarousel } from '@/components/ImageCarousel';
import { BackgroundVeins } from '@/components/BackgroundVeins';
import { StoryGenerator } from '@/components/StoryGenerator';
import { CharactersTab } from '@/components/CharactersTab';
import { WorldsTab } from '@/components/WorldsTab';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedWorld, setSelectedWorld] = useState<string>('');

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

  const generateStory = async () => {
    if (!storyPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const character = selectedCharacter ? sampleCharacters.find(c => c.id === selectedCharacter) : null;
      const world = selectedWorld ? sampleWorlds.find(w => w.id === selectedWorld) : null;
      
      const response = await fetch('https://functions.poehali.dev/52ab4d94-b7a4-4399-ab17-b239ff31342a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: storyPrompt,
          character: character ? `${character.name} (${character.role}) - ${character.personality}` : '',
          world: world ? `${world.name} - ${world.description}` : '',
          genre: world?.genre || 'фэнтези'
        })
      });
      
      const data = await response.json();
      if (data.story) {
        playSound(1200, 0.5);
        setGeneratedStory(data.story);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleCharacters: Character[] = [
    {
      id: '1',
      name: 'Тёмный Страж',
      role: 'Воин',
      avatar: 'https://cdn.poehali.dev/projects/c21ad508-1761-44f1-bdd8-2abd832bea95/files/8a4f7878-b4ca-4762-b15c-5879af2c116e.jpg',
      stats: 'Сила: 18, Ловкость: 14, Интеллект: 10',
      personality: 'Суровый, молчаливый защитник древних тайн',
      backstory: 'Последний из ордена Ночных Стражей, поклявшийся защищать врата между мирами'
    },
    {
      id: '2',
      name: 'Элария',
      role: 'Маг',
      avatar: 'https://cdn.poehali.dev/projects/c21ad508-1761-44f1-bdd8-2abd832bea95/files/e7080da7-04de-430d-ab30-58d0c54ffef0.jpg',
      stats: 'Сила: 8, Ловкость: 12, Интеллект: 20',
      personality: 'Мудрая, загадочная хранительница древней магии',
      backstory: 'Эльфийская архимагиня, изучающая забытые заклинания тысячелетней давности'
    }
  ];

  const sampleWorlds: World[] = [
    {
      id: '1',
      name: 'Замок Теней',
      description: 'Древняя крепость, пронизанная тёмной магией и хранящая секреты прошлого',
      image: 'https://cdn.poehali.dev/projects/c21ad508-1761-44f1-bdd8-2abd832bea95/files/d7267011-d16c-486a-b7f3-2eaacc6f6499.jpg',
      genre: 'Тёмное фэнтези'
    }
  ];

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

          <nav className="mb-12 flex justify-center gap-6">
            <Button variant="ghost" className="gap-2 hover:text-primary transition-colors">
              <Icon name="Home" size={20} />
              Главная
            </Button>
            <Button variant="ghost" className="gap-2 hover:text-primary transition-colors">
              <Icon name="Map" size={20} />
              Приключения
            </Button>
            <Button variant="ghost" className="gap-2 hover:text-primary transition-colors">
              <Icon name="BookOpen" size={20} />
              Сюжеты
            </Button>
            <Button variant="ghost" className="gap-2 hover:text-primary transition-colors">
              <Icon name="User" size={20} />
              Профиль
            </Button>
          </nav>

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
            characters={sampleCharacters}
            worlds={sampleWorlds}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
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
            </TabsList>

            <TabsContent value="characters">
              <CharactersTab 
                characters={sampleCharacters}
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                onCardClick={playCardSound}
              />
            </TabsContent>

            <TabsContent value="worlds">
              <WorldsTab 
                worlds={sampleWorlds}
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                onCardClick={playCardSound}
              />
            </TabsContent>

            <TabsContent value="stories">
              <div className="animate-fade-in text-center py-16">
                <Icon name="BookMarked" size={64} className="mx-auto mb-6 text-primary/50" />
                <h2 className="text-3xl font-serif font-semibold mb-4">Библиотека сюжетов</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Здесь будут храниться все твои сгенерированные истории и сюжеты
                </p>
                <Button size="lg" className="gap-2" onClick={() => setIsStoryDialogOpen(true)}>
                  <Icon name="Sparkles" size={20} />
                  Создать первую историю
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;