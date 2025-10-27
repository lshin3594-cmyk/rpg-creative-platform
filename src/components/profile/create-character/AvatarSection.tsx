import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AvatarSectionProps {
  generatedAvatar: string;
  isGeneratingAvatar: boolean;
  isUploadingImage: boolean;
  onGenerateAvatar: () => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarClick: () => void;
}

export const AvatarSection = ({
  generatedAvatar,
  isGeneratingAvatar,
  isUploadingImage,
  onGenerateAvatar,
  onUploadImage,
  onAvatarClick
}: AvatarSectionProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        {generatedAvatar ? (
          <div 
            className="w-96 h-96 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 cursor-pointer transition-transform hover:scale-105"
            onClick={onAvatarClick}
          >
            <img 
              src={generatedAvatar} 
              alt="Аватар персонажа" 
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
              <Icon name="Maximize2" size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <div className="w-96 h-96 rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/30 flex items-center justify-center">
            <Icon name="User" size={64} className="text-purple-400/50" />
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={onGenerateAvatar}
          disabled={isGeneratingAvatar || isUploadingImage}
          size="lg"
          className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/50"
        >
          {isGeneratingAvatar ? (
            <>
              <Icon name="Loader2" size={18} className="animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <Icon name="Sparkles" size={18} />
              {generatedAvatar ? 'Перегенерировать' : 'Сгенерировать аватар'}
            </>
          )}
        </Button>
        
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={onUploadImage}
            disabled={isGeneratingAvatar || isUploadingImage}
            className="hidden"
          />
          <Button 
            type="button"
            size="lg"
            disabled={isGeneratingAvatar || isUploadingImage}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/50"
            onClick={(e) => {
              e.preventDefault();
              (e.currentTarget.parentElement as HTMLLabelElement)?.querySelector('input')?.click();
            }}
          >
            {isUploadingImage ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="Upload" size={18} />
                Загрузить свою картинку
              </>
            )}
          </Button>
        </label>
      </div>
    </div>
  );
};
