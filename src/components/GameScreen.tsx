import Icon from '@/components/ui/icon';
import { StoryJournalModal } from '@/components/story/StoryJournalModal';
import { CreateCharacterModal } from '@/components/story/CreateCharacterModal';
import { CharactersPanel } from '@/components/game/CharactersPanel';
import { GameHeader } from '@/components/game/GameHeader';
import { StoryMessages } from '@/components/game/StoryMessages';
import { StoryInput } from '@/components/game/StoryInput';
import { EpisodesTimeline } from '@/components/game/EpisodesTimeline';
import { useGameLogic } from '@/components/game/useGameLogic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GameScreenProps {
  gameId?: string;
}

export const GameScreen = ({ gameId }: GameScreenProps) => {
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  
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
      {/* Мобильная кнопка открытия панели */}
      <Button
        onClick={() => setShowMobilePanel(!showMobilePanel)}
        className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-full p-0 bg-primary/20 hover:bg-primary/30 border border-primary/40"
      >
        <Icon name={showMobilePanel ? 'X' : 'Menu'} size={24} />
      </Button>

      <div className="relative z-10 flex w-full h-full">
        {/* Оверлей для мобилки */}
        {showMobilePanel && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowMobilePanel(false)}
          />
        )}
        
        {/* Панель персонажей */}
        <div className={`
          fixed md:relative z-40 md:z-auto
          transition-transform duration-300 ease-in-out
          ${showMobilePanel ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
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
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <GameHeader
            gameSettings={gameSettings}
            currentEpisode={currentEpisode}
            messages={messages}
            onBack={() => navigate('/')}
          />

          <div className="flex-1 min-h-0 overflow-hidden">
            <StoryMessages
              ref={scrollRef}
              messages={messages}
              gameSettings={gameSettings}
              isProcessing={isProcessing}
              processingTime={processingTime}
              generatingIllustration={generatingIllustration}
            />
          </div>

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