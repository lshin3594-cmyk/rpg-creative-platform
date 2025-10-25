import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl?: string;
  title?: string;
  description?: string;
}

export const PreviewModal = ({ 
  open, 
  onOpenChange,
  imageUrl = 'https://cdn.poehali.dev/files/d5999954-beff-4865-b356-8f841e8530a8.png',
  title = 'Мы запустились!',
  description = 'Подпишись на наши соц. сети, будем рады любой обратной связи'
}: PreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-black/60 border border-purple-500/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover blur-[2px]"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            <div className="absolute top-6 left-6 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-purple-500/30">
              <p className="text-white font-medium">{title}</p>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider leading-tight">
                {description}
              </h2>
              
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white border-none gap-2"
                  onClick={() => window.open('https://t.me/yourchannеl', '_blank')}
                >
                  <Icon name="Send" size={20} />
                  Telegram
                </Button>
                
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none gap-2"
                  onClick={() => window.open('https://vk.com/yourgroup', '_blank')}
                >
                  <Icon name="MessageCircle" size={20} />
                  VK
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-purple-500/50 hover:bg-purple-500/20 text-white gap-2"
                  onClick={() => onOpenChange(false)}
                >
                  <Icon name="X" size={20} />
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
