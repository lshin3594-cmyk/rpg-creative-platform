import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {veins.map((vein, index) => (
          <line
            key={index}
            x1={vein.x1}
            y1={vein.y1}
            x2={vein.x2}
            y2={vein.y2}
            stroke={vein.color}
            strokeWidth="3"
            filter="url(#glow)"
            style={{
              animation: `pulse-slow 3s ease-in-out infinite`,
              animationDelay: vein.delay
            }}
          />
        ))}
      </svg>
      
      <div className="relative z-10">
        <div className="w-full h-64 md:h-96 relative overflow-hidden mb-8">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${carouselImages[currentImageIndex]})`,
              filter: 'blur(0px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all z-20"
          >
            <Icon name="ChevronLeft" size={24} className="text-primary" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all z-20"
          >
            <Icon name="ChevronRight" size={24} className="text-primary" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
        
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="characters" className="gap-2">
              <Icon name="Users" size={18} />
              Персонажи
            </TabsTrigger>
            <TabsTrigger value="worlds" className="gap-2">
              <Icon name="Globe" size={18} />
              Миры
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-serif font-semibold">Библиотека персонажей</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={20} />
                    Создать персонажа
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">Создание персонажа</DialogTitle>
                    <DialogDescription>
                      Опиши своего персонажа, и ИИ сгенерирует его портрет
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="char-name">Имя персонажа</Label>
                      <Input id="char-name" placeholder="Введите имя..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="char-role">Роль/Класс</Label>
                      <Input id="char-role" placeholder="Воин, маг, вор..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="char-appearance">Внешность</Label>
                      <Textarea 
                        id="char-appearance" 
                        placeholder="Опиши внешний вид для генерации портрета..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="char-stats">Характеристики</Label>
                      <Input id="char-stats" placeholder="Сила: 15, Ловкость: 12..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="char-personality">Характер</Label>
                      <Textarea 
                        id="char-personality" 
                        placeholder="Опиши личность персонажа..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="char-backstory">Предыстория</Label>
                      <Textarea 
                        id="char-backstory" 
                        placeholder="Расскажи историю персонажа..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="char-behavior">Поведенческие правила</Label>
                      <Textarea 
                        id="char-behavior" 
                        placeholder="Как персонаж должен реагировать на события? Какие у него запреты и принципы?"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button className="gap-2">
                      <Icon name="Sparkles" size={18} />
                      Создать с ИИ
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleCharacters.map((character) => (
                <Card 
                  key={character.id} 
                  className="group hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 border border-primary/30 hover:border-primary bg-card/40 backdrop-blur-xl relative overflow-hidden cursor-pointer"
                  style={{ filter: 'blur(0px)', transition: 'all 0.5s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'}
                  onClick={playCardSound}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-20 h-20 border-2 border-primary/50 ring-4 ring-primary/20 shadow-lg shadow-primary/30">
                        <AvatarImage src={character.avatar} alt={character.name} />
                        <AvatarFallback>{character.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="font-serif text-xl mb-2">{character.name}</CardTitle>
                        <Badge variant="secondary" className="mb-2">
                          {character.role}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{character.stats}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1 text-primary">Характер:</h4>
                        <p className="text-sm text-muted-foreground">{character.personality}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1 text-primary">История:</h4>
                        <p className="text-sm text-muted-foreground">{character.backstory}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 gap-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Icon name="Edit" size={16} />
                        Редактировать
                      </Button>
                      <Button size="sm" className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Icon name="Play" size={16} />
                        Играть
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed border-2 border-border hover:border-primary transition-all duration-300 flex items-center justify-center min-h-[300px] cursor-pointer group hover:bg-card/50">
                <div className="text-center p-6" onClick={() => setIsCreateDialogOpen(true)}>
                  <Icon name="Plus" size={48} className="mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    Создать персонажа
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="worlds" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-serif font-semibold">Библиотека миров</h2>
              <Button className="gap-2">
                <Icon name="Plus" size={20} />
                Создать мир
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleWorlds.map((world) => (
                <Card 
                  key={world.id}
                  className="group hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 border border-primary/30 hover:border-primary bg-card/40 backdrop-blur-xl overflow-hidden relative cursor-pointer"
                  style={{ filter: 'blur(0px)', transition: 'all 0.5s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'}
                  onClick={playCardSound}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={world.image} 
                      alt={world.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      {world.genre}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">{world.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {world.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Icon name="Edit" size={16} />
                        Редактировать
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Icon name="Eye" size={16} />
                        Открыть
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed border-2 border-border hover:border-primary transition-all duration-300 flex items-center justify-center min-h-[300px] cursor-pointer group hover:bg-card/50">
                <div className="text-center p-6">
                  <Icon name="Plus" size={48} className="mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    Создать мир
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="border border-primary/30 bg-card/40 backdrop-blur-xl hover:border-primary hover:scale-105 transition-all duration-500 group relative overflow-hidden hover:shadow-xl hover:shadow-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon name="Brain" size={24} className="text-primary" />
                </div>
                <CardTitle className="font-serif">Лора-память</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                ИИ запоминает всю историю сюжета и детали твоего мира для длинных арок
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-primary/30 bg-card/40 backdrop-blur-xl hover:border-primary hover:scale-105 transition-all duration-500 group relative overflow-hidden hover:shadow-xl hover:shadow-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Icon name="Shield" size={24} className="text-secondary" />
                </div>
                <CardTitle className="font-serif">Без цензуры</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Полная свобода творчества — создавай любые сюжеты без ограничений
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-primary/30 bg-card/40 backdrop-blur-xl hover:border-primary hover:scale-105 transition-all duration-500 group relative overflow-hidden hover:shadow-xl hover:shadow-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Icon name="Wand2" size={24} className="text-accent" />
                </div>
                <CardTitle className="font-serif">ИИ-генерация</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Автоматическое создание портретов персонажей и изображений локаций
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <div className="fixed bottom-8 right-8 z-50">
          <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all px-8">
            <Icon name="Sparkles" size={20} />
            Начать путешествие
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Index;