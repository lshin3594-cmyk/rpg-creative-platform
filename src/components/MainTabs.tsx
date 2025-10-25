import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { CharactersTab } from '@/components/CharactersTab';
import { WorldsTab } from '@/components/WorldsTab';
import { PlotTab } from '@/components/PlotTab';
import { StoriesTab } from '@/components/StoriesTab';
import { ProfileTab } from '@/components/ProfileTab';
import type { Character, World, Story } from '@/hooks/useDataManagement';

interface Plot {
  id: string;
  name: string;
  description: string;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  plotType: string;
}

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  characters: Character[];
  worlds: World[];
  plots: Plot[];
  stories: Story[];
  favoriteStories: Story[];
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
  onToggleFavorite: (id: number) => void;
  onCreateCharacter: (data: Omit<Character, 'id'>) => void;
  onCreateWorld: (data: Omit<World, 'id'>) => void;
  onCreatePlot: (data: Omit<Plot, 'id'>) => void;
  onUpdateCharacter?: (id: string, data: Partial<Character>) => void;
  onUpdateWorld?: (id: string, data: Partial<World>) => void;
  onUpdatePlot?: (id: string, data: Partial<Plot>) => void;
  onDeletePlot: (id: string) => void;
}

export const MainTabs = ({
  activeTab,
  setActiveTab,
  characters,
  worlds,
  plots,
  stories,
  favoriteStories,
  isLoadingStories,
  profileStats,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onOpenStoryDialog,
  onCardClick,
  onDeleteCharacter,
  onDeleteWorld,
  onDeletePlot,
  onDeleteStory,
  onToggleFavorite,
  onCreateCharacter,
  onCreateWorld,
  onCreatePlot,
  onUpdateCharacter,
  onUpdateWorld,
  onUpdatePlot
}: MainTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
        <TabsTrigger value="characters" className="gap-2 tab-trigger-active transition-all">
          <Icon name="Users" size={18} />
          Персонажи
        </TabsTrigger>
        <TabsTrigger value="world-story" className="gap-2 tab-trigger-active transition-all">
          <Icon name="Map" size={18} />
          Мир & Сюжет
        </TabsTrigger>
        <TabsTrigger value="favorites" className="gap-2 tab-trigger-active transition-all">
          <Icon name="Star" size={18} />
          Избранное
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

      <TabsContent value="world-story" className="tab-content-enter">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon name="Globe" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Миры</h2>
                <p className="text-sm text-muted-foreground">Создайте вселенную со своими законами и правилами</p>
              </div>
            </div>
            <WorldsTab 
              worlds={worlds}
              isCreateDialogOpen={false}
              setIsCreateDialogOpen={() => {}}
              onCardClick={onCardClick}
              onDelete={onDeleteWorld}
              onCreate={onCreateWorld}
              onUpdate={onUpdateWorld}
            />
          </div>

          <div className="border-t border-border pt-8">
            <PlotTab
              plots={plots}
              onCardClick={onCardClick}
              onDelete={onDeletePlot}
              onCreate={onCreatePlot}
              onUpdate={onUpdatePlot}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="favorites" className="tab-content-enter">
        <StoriesTab
          stories={favoriteStories}
          isLoading={isLoadingStories}
          onCreateNew={onOpenStoryDialog}
          onCardClick={onCardClick}
          onDelete={onDeleteStory}
          onToggleFavorite={onToggleFavorite}
          isFavoritesView
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