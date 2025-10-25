import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { NarrativeSettings } from '@/components/NarrativeSettings';
import { CharacterWorldSelectors } from '@/components/story-generator/CharacterWorldSelectors';
import { PlotSelector } from '@/components/story-generator/PlotSelector';
import { StoryPromptInput } from '@/components/story-generator/StoryPromptInput';
import { AdvancedSettings } from '@/components/story-generator/AdvancedSettings';
import { NPCSettings } from '@/components/story-generator/NPCSettings';
import { GenerationStatus } from '@/components/story-generator/GenerationStatus';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string;
}

interface Plot {
  id: string;
  name: string;
  description: string;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  genres: string[];
}

interface StoryGeneratorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storyPrompt: string;
  setStoryPrompt: (prompt: string) => void;
  selectedCharacter: string;
  setSelectedCharacter: (id: string) => void;
  selectedWorld: string;
  setSelectedWorld: (id: string) => void;
  isGenerating: boolean;
  generatedStory: string;
  onGenerate: () => void;
  onStartStory?: () => void;
  characters: Character[];
  worlds: World[];
  plots: Plot[];
  episodeLength?: number;
  setEpisodeLength?: (value: number) => void;
  imagesPerEpisode?: number;
  setImagesPerEpisode?: (value: number) => void;
  playerInstructions?: string;
  setPlayerInstructions?: (value: string) => void;
  autoGenerateNPCs?: boolean;
  setAutoGenerateNPCs?: (value: boolean) => void;
  npcCount?: number;
  setNpcCount?: (value: number) => void;
  npcTypes?: string[];
  setNpcTypes?: (value: string[]) => void;
  selectedPlot?: string;
  setSelectedPlot?: (id: string) => void;
  narrativeMode?: string;
  setNarrativeMode?: (mode: string) => void;
  playerCharacterId?: string;
  setPlayerCharacterId?: (id: string) => void;
  selectedNarrativeCharacters?: string[];
  setSelectedNarrativeCharacters?: (ids: string[]) => void;
}

export const StoryGenerator = ({
  isOpen,
  onOpenChange,
  storyPrompt,
  setStoryPrompt,
  selectedCharacter,
  setSelectedCharacter,
  selectedWorld,
  setSelectedWorld,
  isGenerating,
  generatedStory,
  onGenerate,
  onStartStory,
  characters,
  worlds,
  plots,
  episodeLength = 1500,
  setEpisodeLength,
  imagesPerEpisode = 2,
  setImagesPerEpisode,
  playerInstructions = '',
  setPlayerInstructions,
  autoGenerateNPCs = true,
  setAutoGenerateNPCs,
  npcCount = 2,
  setNpcCount,
  npcTypes = [],
  setNpcTypes,
  selectedPlot = '',
  setSelectedPlot,
  narrativeMode = 'story',
  setNarrativeMode,
  playerCharacterId = '',
  setPlayerCharacterId,
  selectedNarrativeCharacters = [],
  setSelectedNarrativeCharacters
}: StoryGeneratorProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPlotDetails, setShowPlotDetails] = useState(false);

  return (
    <div className="flex justify-center mb-8">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-3 text-lg py-7 px-10 bg-primary hover:bg-primary/90 shadow-2xl hover:scale-105 transition-all">
            <Icon name="Sparkles" size={28} className="animate-pulse" />
            Начать приключение
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Генератор историй</DialogTitle>
            <DialogDescription>
              Опиши сюжет, и DeepSeek создаст уникальную историю без цензуры
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <NarrativeSettings
              narrativeMode={narrativeMode}
              setNarrativeMode={setNarrativeMode!}
              playerCharacterId={playerCharacterId}
              setPlayerCharacterId={setPlayerCharacterId!}
              characters={characters}
              selectedNarrativeCharacters={selectedNarrativeCharacters}
              setSelectedNarrativeCharacters={setSelectedNarrativeCharacters}
            />
            
            <CharacterWorldSelectors
              selectedCharacter={selectedCharacter}
              setSelectedCharacter={setSelectedCharacter}
              selectedWorld={selectedWorld}
              setSelectedWorld={setSelectedWorld}
              characters={characters}
              worlds={worlds}
            />

            <PlotSelector
              plots={plots}
              selectedPlot={selectedPlot}
              setSelectedPlot={setSelectedPlot}
              showPlotDetails={showPlotDetails}
              setShowPlotDetails={setShowPlotDetails}
            />

            <StoryPromptInput
              storyPrompt={storyPrompt}
              setStoryPrompt={setStoryPrompt}
              selectedPlot={selectedPlot}
            />

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <Icon 
                  name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                />
                {showAdvanced ? 'Скрыть' : 'Показать'} расширенные настройки
              </button>

              {showAdvanced && (
                <div className="space-y-4 animate-fade-in">
                  <AdvancedSettings
                    episodeLength={episodeLength}
                    setEpisodeLength={setEpisodeLength}
                    imagesPerEpisode={imagesPerEpisode}
                    setImagesPerEpisode={setImagesPerEpisode}
                    playerInstructions={playerInstructions}
                    setPlayerInstructions={setPlayerInstructions}
                  />

                  <NPCSettings
                    autoGenerateNPCs={autoGenerateNPCs}
                    setAutoGenerateNPCs={setAutoGenerateNPCs}
                    npcCount={npcCount}
                    setNpcCount={setNpcCount}
                    npcTypes={npcTypes}
                    setNpcTypes={setNpcTypes}
                  />
                </div>
              )}
            </div>

            <GenerationStatus
              isGenerating={isGenerating}
              generatedStory={generatedStory}
              onGenerate={onGenerate}
              onStartStory={onStartStory}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
