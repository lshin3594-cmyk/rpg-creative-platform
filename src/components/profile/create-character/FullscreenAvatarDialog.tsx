import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface FullscreenAvatarDialogProps {
  isOpen: boolean;
  avatarUrl: string;
  onClose: () => void;
}

export const FullscreenAvatarDialog = ({ isOpen, avatarUrl, onClose }: FullscreenAvatarDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] bg-black/95 border-purple-500/30 p-4">
        <DialogHeader>
          <DialogTitle className="text-purple-300 text-2xl flex items-center justify-between">
            <span>Аватар персонажа</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-purple-300 hover:text-purple-100 hover:bg-purple-800/30"
            >
              <Icon name="X" size={24} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center h-full">
          <img 
            src={avatarUrl} 
            alt="Аватар персонажа" 
            className="max-h-full max-w-full object-contain rounded-xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
