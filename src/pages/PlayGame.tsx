import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { GameJournal } from '@/components/game/GameJournal';
import { GameHeader } from '@/components/game/GameHeader';
import { LoadingStages } from '@/components/game/LoadingStages';
import { StoryHistory } from '@/components/game/StoryHistory';
import { CurrentStory } from '@/components/game/CurrentStory';
import { ActionInput } from '@/components/game/ActionInput';
import { parseMetaFromStory } from '@/components/game/MetaParser';

import func2url from '../../backend/func2url.json';

const AI_STORY_URL = func2url['ai-story'];
const IMAGE_GEN_URL = func2url['generate-image'];

interface HistoryEntry {
  user: string;
  ai: string;
  image?: string;
}

type LoadingStage = 'idle' | 'world' | 'story' | 'done';

export default function PlayGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const gameSettings = location.state?.gameSettings;
  const existingSave = location.state?.existingSave;

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentStory, setCurrentStory] = useState<string>('');
  const [userAction, setUserAction] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [gameId, setGameId] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('idle');
  const [stageErrors, setStageErrors] = useState<{world?: string, story?: string}>({});
  const [journalOpen, setJournalOpen] = useState(false);
  const [metaCommand, setMetaCommand] = useState('');
  const [showMetaInput, setShowMetaInput] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([
    {
      episode: 1,
      title: 'Начало приключения',
      time: '10:00, понедельник',
      location: 'Таверна "Золотой дракон"',
      events: [
        'Герой прибыл в город Элдориа',
        'Встреча с загадочным торговцем'
      ],
      npcs: [
        { name: 'Торговец Маркус', relationship: 30, change: 10 },
        { name: 'Бармен Джон', relationship: 15 }
      ],
      emotions: ['Любопытство', 'Лёгкое беспокойство'],
      clues: ['Карта с меткой неизвестного места'],
      questions: ['Кто такой загадочный торговец?', 'Что за место на карте?'],
      plans: ['Изучить карту', 'Собрать информацию в таверне']
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gameStartedRef = useRef(false);
  const storyReceivedRef = useRef(false);

  // DEBUG: Log currentStory changes
  useEffect(() => {
    console.log('🔄 currentStory CHANGED:', {
      length: currentStory?.length,
      hasValue: !!currentStory,
      preview: currentStory?.slice(0, 100)
    });
  }, [currentStory]);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    if (!gameSettings && !existingSave) {
      navigate('/create-game');
      return;
    }
    
    if (existingSave) {
      console.log('📂 Loading existing save:', existingSave);
      setGameId(existingSave.id);
      setHistory(existingSave.history || []);
      setCurrentStory(existingSave.currentStory || '');
      setIsStarting(false);
      setLoadingStage('done');
    } else if (gameSettings) {
      console.log('🎮 Starting new game');
      const id = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setGameId(id);
      startGame();
    }
    
    const savedCharacters = localStorage.getItem('user-characters');
    if (savedCharacters) {
      try {
        const chars = JSON.parse(savedCharacters);
        setSelectedCharacter(chars[0] || null);
      } catch (e) {
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentStory]);

  useEffect(() => {
    console.log('🔍 RENDER CHECK - currentStory:', {
      exists: !!currentStory,
      length: currentStory?.length,
      isStarting,
      preview: currentStory?.slice(0, 50)
    });
    
    if (storyReceivedRef.current && currentStory && currentStory.length > 0 && isStarting) {
      console.log('🎯 Story confirmed in state, closing loading screen');
      console.log('🎯 currentStory:', currentStory.slice(0, 100));
      setIsLoading(false);
      setIsStarting(false);
      storyReceivedRef.current = false;
    }
  }, [currentStory, isStarting]);

  const startGame = async () => {
    console.log('🎮 Starting game with settings:', gameSettings);
    console.log('🔗 AI_STORY_URL:', AI_STORY_URL);
    
    setIsLoading(true);
    setIsStarting(true);
    setStageErrors({});
    
    try {
      setLoadingStage('world');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingStage('story');
      console.log('📡 Fetching story from AI...');
      
      const requestBody = {
        action: 'Начни игру',
        settings: gameSettings,
        history: []
      };
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(AI_STORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Story API error:', response.status, errorText);
        setStageErrors(prev => ({ ...prev, story: `HTTP ${response.status}: ${errorText.slice(0, 100)}` }));
        throw new Error(`Story API failed (${response.status})`);
      }
      
      const data = await response.json();
      console.log('✅ Story received:', data);
      
      const story = String(data.text || 'История началась...');
      
      console.log('📝 Raw story text:', story);
      console.log('📝 Story type:', typeof story);
      console.log('📝 Story length:', story.length);
      console.log('📝 Setting currentStory now...');
      
      // КРИТИЧНО: Используем функцию-колбэк чтобы гарантировать обновление
      setCurrentStory(() => story);
      
      console.log('✅ currentStory state updated');
      console.log('✅ Story preview:', story.slice(0, 100));
      
      storyReceivedRef.current = true;
      setLoadingStage('done');
      saveGame([], story);
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          console.log('📜 Scrolled to bottom after story');
        }
      }, 100);
    } catch (error: any) {
      console.error('💥 Failed to start game:', error);
      console.error('💥 Error stack:', error.stack);
      const errorMsg = error.message || 'Неизвестная ошибка';
      
      if (loadingStage === 'story') {
        setStageErrors(prev => ({ ...prev, story: errorMsg }));
      } else if (loadingStage === 'world') {
        setStageErrors(prev => ({ ...prev, world: errorMsg }));
      }
      
      toast({
        title: 'Ошибка запуска игры',
        description: errorMsg,
        variant: 'destructive'
      });
      setCurrentStory('Не удалось начать игру. Проверьте логи выше.');
      storyReceivedRef.current = true;
    }
  };

  const handleSendAction = async () => {
    if (!userAction.trim() || isLoading) return;

    let action = userAction.trim();
    if (metaCommand.trim()) {
      action = `@[МЕТА-КОМАНДА]: ${metaCommand.trim()}\n\n${action}`;
      setMetaCommand('');
    }
    
    setUserAction('');
    setIsLoading(true);

    try {
      const messagesHistory = history.flatMap(h => [
        { type: 'user', content: h.user },
        { type: 'assistant', content: h.ai }
      ]);

      const response = await fetch(AI_STORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action,
          settings: gameSettings,
          history: messagesHistory
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const story = String(data.text || 'История продолжается...');
        
        console.log('📝 Story continuation:', story);
        console.log('📝 Story type:', typeof story);
        
        const newHistoryEntry: HistoryEntry = { 
          user: action, 
          ai: story
        };
        const updatedHistory = [...history, newHistoryEntry];
        
        setHistory(updatedHistory);
        setCurrentStory(() => story);
        saveGame(updatedHistory, story);
      } else {
        const errorText = await response.text();
        console.error('Story API error:', response.status, errorText);
        toast({
          title: 'Ошибка',
          description: `Не удалось получить ответ (${response.status})`,
          variant: 'destructive'
        });
        setCurrentStory('Ошибка при генерации истории.');
      }
    } catch (error) {
      console.error('Failed to send action:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить действие',
        variant: 'destructive'
      });
      setCurrentStory('Произошла ошибка. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGame = async (historyData: HistoryEntry[], story: string) => {
    if (!gameSettings) return;
    
    const saves = JSON.parse(localStorage.getItem('game-saves') || '[]');
    const existingIndex = saves.findIndex((s: any) => s.id === gameId);
    
    let coverUrl = '';
    if (existingIndex >= 0) {
      coverUrl = saves[existingIndex].coverUrl || '';
    }
    
    if (!coverUrl && historyData.length === 0 && gameSettings.genre && gameSettings.setting) {
      try {
        const coverPrompt = `${gameSettings.genre} game cover art, ${gameSettings.setting}, cinematic, high quality, professional book cover`;
        const imgResponse = await fetch(IMAGE_GEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: coverPrompt })
        });
        
        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          coverUrl = imgData.url || '';
        }
      } catch (error) {
        console.error('Failed to generate cover:', error);
      }
    }
    
    const saveData = {
      id: gameId,
      gameSettings,
      history: historyData,
      currentStory: story,
      savedAt: Date.now(),
      coverUrl,
      episodeCount: historyData.length + 1,
      lastAction: historyData.length > 0 ? historyData[historyData.length - 1].user : 'Начало игры'
    };
    
    if (existingIndex >= 0) {
      saves[existingIndex] = saveData;
    } else {
      saves.push(saveData);
    }
    
    localStorage.setItem('game-saves', JSON.stringify(saves));
  };

  const handleBack = () => {
    saveGame(history, currentStory);
    navigate('/');
  };

  if (!gameSettings) {
    return null;
  }

  const messages = history.flatMap(h => [
    { type: 'user', content: h.user },
    { type: 'ai', content: h.ai }
  ]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <GameHeader
        gameSettings={gameSettings}
        currentEpisode={history.length + 1}
        messages={messages}
        onBack={handleBack}
      />

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 flex flex-col">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6"
          >
            <div className="container mx-auto max-w-4xl">
              <StoryHistory history={history} />
              
              {/* DEBUG: Прямой рендер для проверки */}
              {currentStory && (
                <div className="bg-green-500/20 border border-green-500 p-4 mb-4">
                  <h3 className="font-bold">DEBUG: currentStory существует!</h3>
                  <p>Длина: {currentStory.length}</p>
                  <pre className="text-xs mt-2 whitespace-pre-wrap">{currentStory}</pre>
                </div>
              )}
              
              <CurrentStory currentStory={currentStory} isStarting={isStarting} />
            </div>
          </div>

          <ActionInput
            userAction={userAction}
            metaCommand={metaCommand}
            showMetaInput={showMetaInput}
            isLoading={isLoading}
            onUserActionChange={setUserAction}
            onMetaCommandChange={setMetaCommand}
            onSend={handleSendAction}
          />
        </div>

        {journalOpen && (
          <div className="w-96 border-l bg-card/50 backdrop-blur-sm overflow-y-auto">
            <GameJournal entries={journalEntries} />
          </div>
        )}
      </div>
    </div>
  );
}