import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  personality?: string;
}

interface CharactersListProps {
  characters: Character[];
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const CharactersList = ({ characters, onDelete, onCreateNew }: CharactersListProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/40 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl text-purple-100">
            <Icon name="Users" size={20} />
            Мои персонажи
          </CardTitle>
          <Button
            onClick={onCreateNew}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
          >
            <Icon name="Plus" size={16} />
            Создать
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {characters.map((char) => (
            <div
              key={char.id}
              className="relative group p-4 rounded-lg bg-black/20 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex gap-4">
                <Avatar className="w-16 h-16 border-2 border-purple-500/50">
                  <AvatarImage 
                    src={char.avatar} 
                    alt={char.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-purple-900/50 text-purple-100">
                    {char.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-purple-100 truncate">{char.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(char.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                  <Badge variant="outline" className="mt-1 border-purple-500/50 text-purple-300">
                    {char.role}
                  </Badge>
                  {char.personality && (
                    <p className="text-sm text-purple-300/70 mt-2 line-clamp-2">
                      {char.personality}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {characters.length === 0 && (
          <div className="text-center py-8 text-purple-300/50">
            <Icon name="UserPlus" size={48} className="mx-auto mb-3 opacity-50" />
            <p>Пока нет персонажей</p>
            <p className="text-sm mt-1">Создайте своего первого героя!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
