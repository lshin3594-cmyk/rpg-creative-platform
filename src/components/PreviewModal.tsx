import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

const images = [
  'https://cdn.poehali.dev/files/c19e4ac5-2e9a-4d33-bf30-5feb9d18b59a.jpeg',
  'https://cdn.poehali.dev/files/4daf9621-731a-496f-bee4-2fce70da4831.jpeg',
  'https://cdn.poehali.dev/files/9864b885-64e5-4a14-b61f-b2691b8526d9.jpg',
  'https://cdn.poehali.dev/files/d97d3887-cd7f-44d9-985b-553c1953b10e.jpg',
];

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewModal = ({ open, onOpenChange }: PreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-purple-900/50 via-blue-900/40 to-black/70 border border-purple-500/40 shadow-2xl">
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/40 via-black/20 to-transparent" />
          </div>

          <div className="relative aspect-video w-full">
            <img
              src={images[currentIndex]}
              alt={`Preview ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-purple-500/30 transition-all"
          >
            <Icon name="ChevronLeft" size={28} className="text-white" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-purple-500/30 transition-all"
          >
            <Icon name="ChevronRight" size={28} className="text-white" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-purple-500 w-8'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};