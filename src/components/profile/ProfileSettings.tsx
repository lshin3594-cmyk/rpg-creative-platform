import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';

interface ProfileSettingsProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const ProfileSettings = ({ onLogout, onNavigateHome }: ProfileSettingsProps) => {
  const { isPlaying, toggle } = useBackgroundMusic();

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl text-purple-100">
          <Icon name="Settings" size={20} />
          Настройки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Icon name={isPlaying ? 'Volume2' : 'VolumeX'} size={20} className="text-purple-300" />
            <div>
              <div className="font-medium text-purple-100">Фоновая музыка</div>
              <div className="text-sm text-purple-300/70">
                {isPlaying ? 'Включена' : 'Выключена'}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggle}
            className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
          >
            {isPlaying ? 'Выключить' : 'Включить'}
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onNavigateHome}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
          >
            <Icon name="Home" size={18} />
            На главную
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/20 gap-2"
          >
            <Icon name="LogOut" size={18} />
            Выйти
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
