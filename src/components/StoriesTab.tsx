import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface Story {
  id: number;
  title: string;
  content: string;
  prompt: string;
  character_name: string;
  world_name: string;
  genre: string;
  created_at: string;
  is_favorite?: boolean;
}

interface StoriesTabProps {
  stories: Story[];
  isLoading: boolean;
  onCreateNew: () => void;
  onCardClick: () => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  isFavoritesView?: boolean;
}

export const StoriesTab = ({ stories, isLoading, onCreateNew, onCardClick, onDelete, onToggleFavorite, isFavoritesView }: StoriesTabProps) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Удалить эту историю?')) return;
    
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in text-center py-16">
        <Icon name="Loader2" size={64} className="mx-auto mb-6 text-primary/50 animate-spin" />
        <p className="text-muted-foreground">Загружаю истории...</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="animate-fade-in text-center py-16">
        <Icon name={isFavoritesView ? "Star" : "BookMarked"} size={64} className="mx-auto mb-6 text-primary/50" />
        <h2 className="text-3xl font-serif font-semibold mb-4">
          {isFavoritesView ? 'Избранные истории' : 'Библиотека сюжетов'}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          {isFavoritesView 
            ? 'Отмечайте любимые истории звёздочкой, чтобы легко находить их здесь'
            : 'Здесь будут храниться все твои сгенерированные истории и сюжеты'
          }
        </p>
        {!isFavoritesView && (
          <Button size="lg" className="gap-2" onClick={onCreateNew}>
            <Icon name="Sparkles" size={20} />
            Создать первую историю
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-semibold">
          {isFavoritesView ? 'Избранные истории' : 'Библиотека сюжетов'}
        </h2>
        {!isFavoritesView && (
          <Button className="gap-2" onClick={onCreateNew}>
            <Icon name="Plus" size={20} />
            Создать новую историю
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, index) => (
          <Card 
            key={story.id}
            className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-card/80 relative group"
            onClick={() => {
              onCardClick();
              setSelectedStory(story);
            }}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button
                variant={story.is_favorite ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(story.id);
                  onCardClick();
                }}
              >
                <Icon name="Star" size={16} className={story.is_favorite ? 'fill-current' : ''} />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => handleDelete(e, story.id)}
                disabled={deletingId === story.id}
              >
                {deletingId === story.id ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="Trash2" size={16} />
                )}
              </Button>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{story.genre}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(story.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <CardTitle className="text-xl font-serif line-clamp-2">{story.title}</CardTitle>
              {(story.character_name || story.world_name) && (
                <CardDescription className="flex gap-2 flex-wrap mt-2">
                  {story.character_name && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Icon name="User" size={12} />
                      {story.character_name}
                    </Badge>
                  )}
                  {story.world_name && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Icon name="Globe" size={12} />
                      {story.world_name}
                    </Badge>
                  )}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {story.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedStory && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <DialogTitle className="text-2xl font-serif flex-1">{selectedStory.title}</DialogTitle>
                  <Badge variant="secondary">{selectedStory.genre}</Badge>
                </div>
                {(selectedStory.character_name || selectedStory.world_name) && (
                  <DialogDescription className="flex gap-2 flex-wrap">
                    {selectedStory.character_name && (
                      <Badge variant="outline" className="gap-1">
                        <Icon name="User" size={14} />
                        {selectedStory.character_name}
                      </Badge>
                    )}
                    {selectedStory.world_name && (
                      <Badge variant="outline" className="gap-1">
                        <Icon name="Globe" size={14} />
                        {selectedStory.world_name}
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1">
                      <Icon name="Calendar" size={14} />
                      {new Date(selectedStory.created_at).toLocaleString('ru-RU')}
                    </Badge>
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="space-y-4 py-4">
                {selectedStory.prompt && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Промпт:</p>
                    <p className="text-sm text-muted-foreground">{selectedStory.prompt}</p>
                  </div>
                )}
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedStory.content}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};