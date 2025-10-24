import Icon from '@/components/ui/icon';

interface ImageCarouselProps {
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
}

export const ImageCarousel = ({ images, currentIndex, onNext, onPrev, onSelectIndex }: ImageCarouselProps) => {
  return (
    <div className="w-full h-64 md:h-96 relative overflow-hidden mb-8">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          filter: 'blur(0px)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all z-20"
      >
        <Icon name="ChevronLeft" size={24} className="text-primary" />
      </button>
      
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all z-20"
      >
        <Icon name="ChevronRight" size={24} className="text-primary" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
