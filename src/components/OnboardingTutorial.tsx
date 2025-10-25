import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export const OnboardingTutorial = ({ onComplete }: OnboardingTutorialProps) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: '👋 Добро пожаловать в генератор историй!',
      description: 'Создавай интерактивные приключения с ИИ без цензуры. Твои персонажи, твои миры, твои правила.',
      icon: 'Sparkles',
      position: 'center'
    },
    {
      title: '✨ Создай персонажа',
      description: 'Перейди во вкладку "Персонажи" и создай своего героя. Опиши его характер, историю и способности.',
      icon: 'User',
      position: 'top-left'
    },
    {
      title: '🌍 Выбери или создай мир',
      description: 'Во вкладке "Миры" можешь создать свою вселенную или использовать готовую (Средиземье, Westeros и др.)',
      icon: 'Globe',
      position: 'top-left'
    },
    {
      title: '🎬 Начни приключение',
      description: 'Нажми кнопку "Начать приключение", выбери персонажа и мир, опиши начальную ситуацию — и вперёд!',
      icon: 'Play',
      position: 'bottom-right'
    },
    {
      title: '🎮 Играй свободно',
      description: 'Описывай действия персонажа, веди диалоги, исследуй. ИИ продолжит историю на основе твоих решений.',
      icon: 'Gamepad2',
      position: 'center'
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
        localStorage.setItem('onboarding_completed', 'true');
      }, 300);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      localStorage.setItem('onboarding_completed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  const positionClasses = {
    'center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'fixed top-24 left-8',
    'bottom-right': 'fixed bottom-24 right-8'
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card 
        className={`
          ${positionClasses[currentStep.position as keyof typeof positionClasses]} 
          max-w-md p-6 shadow-2xl border-2 border-primary/50 
          animate-scale-in
        `}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Icon name={currentStep.icon as any} size={24} className="text-primary" />
                <h3 className="font-bold text-lg">{currentStep.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStep.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-6 w-6 p-0"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 flex-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step 
                      ? 'bg-primary flex-1' 
                      : i < step 
                        ? 'bg-primary/40 w-8' 
                        : 'bg-muted w-8'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {step + 1}/{steps.length}
            </span>
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="gap-1"
              >
                <Icon name="ChevronLeft" size={14} />
                Назад
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1 flex-1"
            >
              {step === steps.length - 1 ? 'Начать' : 'Далее'}
              <Icon name="ChevronRight" size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
