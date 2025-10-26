import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ProfileHeaderProps {
  user: {
    username: string;
    email: string;
    display_name?: string;
  };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl text-purple-100">
          <Icon name="User" size={24} />
          Анкета игрока
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-purple-200">Никнейм</Label>
            <Input 
              id="username"
              value={user.username} 
              readOnly
              className="bg-black/30 border-purple-500/30 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-purple-200">Email</Label>
            <Input 
              id="email"
              value={user.email} 
              readOnly
              className="bg-black/30 border-purple-500/30 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_name" className="text-purple-200">Имя персонажа</Label>
          <Input 
            id="display_name"
            placeholder="Как вас называть в игре?"
            defaultValue={user.display_name}
            className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-purple-200">О себе</Label>
          <Textarea 
            id="bio"
            placeholder="Расскажите немного о себе..."
            className="bg-black/30 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};
