import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { StoryGenerator } from '@/components/StoryGenerator';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);

  if (gameStarted) {
    return <StoryGenerator />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2">
        <CardContent className="p-12 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
              <Icon name="BookOpen" size={48} className="text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Твоя история</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Ролевая новелла без ограничений. Создай свой мир, управляй персонажами, твори приключения.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 py-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Icon name="Sparkles" size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold">Генерация ИИ</h3>
              <p className="text-sm text-muted-foreground">История развивается с помощью нейросети</p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Icon name="Users" size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold">Живые персонажи</h3>
              <p className="text-sm text-muted-foreground">Взаимодействуй с героями истории</p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Icon name="Zap" size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold">Без цензуры</h3>
              <p className="text-sm text-muted-foreground">Полная свобода сюжета</p>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full h-16 text-xl gap-3 shadow-lg hover:shadow-xl transition-all"
            onClick={() => setGameStarted(true)}
          >
            <Icon name="Play" size={24} />
            Начать новую историю
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Просто опиши что хочешь и история начнётся
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
