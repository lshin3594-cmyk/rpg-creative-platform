import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.display_name 
    ? user.display_name.slice(0, 2).toUpperCase()
    : user.username.slice(0, 2).toUpperCase();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon name="User" size={20} />
          Профиль игрока
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user.display_name || user.username}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Mail" size={16} className="text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Shield" size={16} className="text-muted-foreground" />
            <Badge variant="secondary" className="text-xs">
              ID: {user.id}
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={logout}
          >
            <Icon name="LogOut" size={16} />
            Выйти из аккаунта
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
