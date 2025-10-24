import { BackgroundVeins } from '@/components/BackgroundVeins';
import { ImageCarousel } from '@/components/ImageCarousel';

interface PageLayoutProps {
  children: React.ReactNode;
  carouselImages: string[];
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onSelectIndex: (index: number) => void;
}

export const PageLayout = ({
  children,
  carouselImages,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onSelectIndex
}: PageLayoutProps) => {
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
          onNext={onNextImage}
          onPrev={onPrevImage}
          onSelectIndex={onSelectIndex}
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

          {children}
        </div>
      </div>
    </div>
  );
};
