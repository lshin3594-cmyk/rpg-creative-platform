import Icon from '@/components/ui/icon';
import { StoryJournalModal } from '@/components/story/StoryJournalModal';
import { CreateCharacterModal } from '@/components/story/CreateCharacterModal';
import { CharactersPanel } from '@/components/game/CharactersPanel';
import { GameHeader } from '@/components/game/GameHeader';
import { StoryMessages } from '@/components/game/StoryMessages';
import { StoryInput } from '@/components/game/StoryInput';
import { EpisodesTimeline } from '@/components/game/EpisodesTimeline';
import { useGameLogic } from '@/components/game/useGameLogic';

interface GameScreenProps {
  gameId?: string;
}

export const GameScreen = ({ gameId }: GameScreenProps) => {
  const {
    messages,
    characters,
    currentInput,
    isProcessing,
    processingTime,
    currentEpisode,
    gameSettings,
    showJournal,
    showCreateChar,
    agentsEnabled,
    autoIllustrations,
    generatingIllustration,
    scrollRef,
    inputRef,
    navigate,
    setCurrentInput,
    setShowJournal,
    setShowCreateChar,
    setAgentsEnabled,
    setAutoIllustrations,
    handleSendMessage,
    handleCharacterCreated,
    handleDiceRoll,
    handleKickAI
  } = useGameLogic();

  if (!gameSettings) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-transparent relative">
      <div className="relative z-10 flex w-full">
        <CharactersPanel
          characters={characters}
          agentsEnabled={agentsEnabled}
          autoIllustrations={autoIllustrations}
          gameSettings={gameSettings}
          onAgentsToggle={setAgentsEnabled}
          onIllustrationsToggle={setAutoIllustrations}
          onCreateCharacter={() => setShowCreateChar(true)}
          onOpenJournal={() => setShowJournal(true)}
          onKickAI={handleKickAI}
        />

        <div className="flex-1 flex flex-col">
        <GameHeader
          gameSettings={gameSettings}
          currentEpisode={currentEpisode}
          messages={messages}
          onBack={() => navigate('/')}
        />

        <StoryMessages
          ref={scrollRef}
          messages={messages}
          gameSettings={gameSettings}
          isProcessing={isProcessing}
          processingTime={processingTime}
          generatingIllustration={generatingIllustration}
        />

        <StoryInput
          ref={inputRef}
          value={currentInput}
          onChange={setCurrentInput}
          onSend={handleSendMessage}
          onDiceRoll={handleDiceRoll}
          isProcessing={isProcessing}
          messagesCount={messages.length}
        />
        </div>
      </div>

      <EpisodesTimeline currentEpisode={currentEpisode} />

      <StoryJournalModal 
        open={showJournal}
        onOpenChange={setShowJournal}
        messages={messages}
        currentEpisode={currentEpisode}
      />

      <CreateCharacterModal
        open={showCreateChar}
        onOpenChange={setShowCreateChar}
        onCharacterCreated={handleCharacterCreated}
        gameSettings={gameSettings}
      />
    </div>
  );
};