import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { CharactersTab } from '@/components/CharactersTab';
import { WorldsTab } from '@/components/WorldsTab';
import { StoriesTab } from '@/components/StoriesTab';
import { ProfileTab } from '@/components/ProfileTab';
import type { Character, World, Story } from '@/hooks/useDataManagement';

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  characters: Character[];
  worlds: World[];
  stories: Story[];
  isLoadingStories: boolean;
  profileStats: {
    charactersCreated: number;
    worldsCreated: number;
    storiesGenerated: number;
    totalWords: number;
  };
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onOpenStoryDialog: () => void;
  onCardClick: () => void;
  onDeleteCharacter: (id: string) => void;
  onDeleteWorld: (id: string) => void;
  onDeleteStory: (id: number) => void;
  onCreateCharacter: (data: Omit<Character, 'id'>) => void;
  onCreateWorld: (data: Omit<World, 'id'>) => void;
  onUpdateCharacter?: (id: string, data: Partial<Character>) => void;
  onUpdateWorld?: (id: string, data: Partial<World>) => void;
}

export const MainTabs = ({
  activeTab,
  setActiveTab,
  characters,
  worlds,
  stories,
  isLoadingStories,
  profileStats,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onOpenStoryDialog,
  onCardClick,
  onDeleteCharacter,
  onDeleteWorld,
  onDeleteStory,
  onCreateCharacter,
  onCreateWorld,
  onUpdateCharacter,
  onUpdateWorld
}: MainTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
        <TabsTrigger value="characters" className="gap-2 tab-trigger-active transition-all">
          <Icon name="Users" size={18} />
          Персонажи
        </TabsTrigger>
        <TabsTrigger value="worlds" className="gap-2 tab-trigger-active transition-all">
          <Icon name="Globe" size={18} />
          Миры
        </TabsTrigger>
        <TabsTrigger value="stories" className="gap-2 tab-trigger-active transition-all">
          <Icon name="BookOpen" size={18} />
          Сюжеты
        </TabsTrigger>
        <TabsTrigger value="profile" className="gap-2 tab-trigger-active transition-all">
          <Icon name="User" size={18} />
          Профиль
        </TabsTrigger>
      </TabsList>

      <TabsContent value="characters" className="tab-content-enter">
        <CharactersTab 
          characters={characters}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          onCardClick={onCardClick}
          onDelete={onDeleteCharacter}
          onCreate={onCreateCharacter}
          onUpdate={onUpdateCharacter}
        />
      </TabsContent>

      <TabsContent value="worlds" className="tab-content-enter">
        <WorldsTab 
          worlds={worlds}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          onCardClick={onCardClick}
          onDelete={onDeleteWorld}
          onCreate={onCreateWorld}
          onUpdate={onUpdateWorld}
        />
      </TabsContent>

      <TabsContent value="stories" className="tab-content-enter">
        <StoriesTab
          stories={stories}
          isLoading={isLoadingStories}
          onCreateNew={onOpenStoryDialog}
          onCardClick={onCardClick}
          onDelete={onDeleteStory}
        />
      </TabsContent>

      <TabsContent value="profile" className="tab-content-enter">
        <ProfileTab 
          stats={profileStats}
          onPlaySound={onCardClick}
        />
      </TabsContent>
    </Tabs>
  );
};