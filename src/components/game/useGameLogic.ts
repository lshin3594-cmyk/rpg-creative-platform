import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Character, Message, GameSettings, AI_STORY_URL, IMAGE_GEN_URL, SAVE_STORY_URL } from './types';
import { useRpgGames } from '@/hooks/useRpgGames';

export const useGameLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [turnsInEpisode, setTurnsInEpisode] = useState(0);
  const [imagesInEpisode, setImagesInEpisode] = useState(0);
  const [totalSymbolsInEpisode, setTotalSymbolsInEpisode] = useState(0);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [showJournal, setShowJournal] = useState(false);
  const [showCreateChar, setShowCreateChar] = useState(false);
  const [agentsEnabled, setAgentsEnabled] = useState(true);
  const [autoIllustrations, setAutoIllustrations] = useState(true);
  const [generatingIllustration, setGeneratingIllustration] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const turnCountRef = useRef(0);
  const storyInitializedRef = useRef(false);
  const timerIntervalRef = useRef<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { getGame, updateGame } = useRpgGames();

  useEffect(() => {
    const loadGameFromDB = async () => {
      const state = location.state as { gameId?: number };
      
      if (!state?.gameId) {
        console.log('Нет gameId, редирект на главную');
        toast({
          title: 'Игра не найдена',
          description: 'Сначала создайте игру',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      try {
        const game = await getGame(state.gameId);
        
        if (!game) {
          toast({
            title: 'Игра не найдена',
            description: 'Не удалось загрузить игру',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }

        setCurrentGameId(game.id);

        let settings: any = {};
        try {
          if (game.story_context) {
            settings = JSON.parse(game.story_context);
          }
        } catch (e) {
          console.error('Failed to parse story_context', e);
        }

        setGameSettings({
          name: game.title,
          setting: game.setting || '',
          genre: game.genre || 'Фэнтези',
          rating: game.difficulty || '18+',
          eloquenceLevel: settings.eloquenceLevel || 3,
          aiModel: 'deepseek',
          role: settings.role || 'hero',
          narrativeMode: settings.narrativeMode || 'third',
          playerCount: settings.playerCount || 1,
          aiInstructions: settings.aiInstructions || '',
          initialCharacters: settings.initialCharacters || []
        });

        if (settings.initialCharacters && settings.initialCharacters.length > 0) {
          const validChars = settings.initialCharacters.filter((c: any) => c.name && c.role);
          if (validChars.length > 0) {
            setCharacters(validChars);
          }
        }

        if (game.actions_log && Array.isArray(game.actions_log) && game.actions_log.length > 0) {
          setMessages(game.actions_log.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })));
          storyInitializedRef.current = true;
        } else {
          storyInitializedRef.current = false;
        }

        if (game.current_chapter) {
          setCurrentEpisode(parseInt(game.current_chapter) || 1);
        }
      } catch (e) {
        console.error('Ошибка загрузки игры', e);
        navigate('/');
      }
    };

    loadGameFromDB();
  }, [location.state, navigate, toast, getGame]);



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && currentGameId && gameSettings) {
      const saveGameToDB = async () => {
        try {
          const lastMessage = messages[messages.length - 1];
          await updateGame(currentGameId, {
            actions_log: messages,
            current_chapter: lastMessage.content.slice(0, 200),
            story_context: JSON.stringify(gameSettings)
          });
        } catch (error) {
          console.error('Failed to save game progress', error);
        }
      };

      const timeoutId = setTimeout(() => {
        saveGameToDB();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, currentGameId, gameSettings, updateGame]);

  const getAgentPrompt = () => {
    turnCountRef.current += 1;
    const turns = turnCountRef.current;

    if (!agentsEnabled) return '';

    if (turns % 3 === 0) {
      return '\n\n[АГЕНТ-НАБЛЮДАТЕЛЬ: Не забывай про сюжетные линии и персонажей. Время идёт, что-то должно происходить!]';
    }
    
    if (turns % 5 === 0) {
      return '\n\n[АГЕНТ-ВРЕМЕНИ: Напомни про время суток, погоду, атмосферу. Мир должен жить!]';
    }

    if (turns % 7 === 0 && characters.length > 0) {
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      return `\n\n[АГЕНТ-ПЕРСОНАЖЕЙ: А что делает ${randomChar.name}? Покажи их действия и эмоции!]`;
    }

    return '';
  };

  const shouldGenerateIllustration = (): boolean => {
    if (!autoIllustrations) return false;
    if (imagesInEpisode >= 4) return false;
    
    const imageInterval = Math.floor(5 / 4);
    return turnsInEpisode % Math.max(imageInterval, 1) === 0 || turnsInEpisode === 0;
  };

  const generateIllustration = async (aiText: string): Promise<string | undefined> => {
    if (!shouldGenerateIllustration()) return undefined;

    try {
      const sceneDescription = aiText.slice(0, 500);
      const prompt = `${gameSettings?.setting ? gameSettings.setting + ', ' : ''}${sceneDescription}, cinematic scene, detailed illustration, high quality art`;
      
      const response = await fetch(IMAGE_GEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) return undefined;
      
      const data = await response.json();
      setImagesInEpisode(prev => prev + 1);
      
      return data.url;
    } catch (error) {
      return undefined;
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isProcessing || !gameSettings) return;

    const userMessage: Message = {
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
      id: Date.now().toString(),
      episode: currentEpisode
    };

    setMessages(prev => [...prev, userMessage]);
    const userAction = currentInput.trim();
    const agentPrompt = getAgentPrompt();
    
    setCurrentInput('');
    setIsProcessing(true);
    setProcessingTime(0);
    
    // Запускаем таймер
    timerIntervalRef.current = window.setInterval(() => {
      setProcessingTime(prev => prev + 1);
    }, 1000);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      
      const response = await fetch(AI_STORY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: userAction + agentPrompt,
          settings: gameSettings,
          history: messages.map(m => ({ type: m.type, content: m.content }))
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      
      const decisionAnalysis = data.decisionAnalysis || {};
      
      const aiMessage: Message = {
        type: 'ai',
        content: data.text,
        timestamp: new Date(),
        id: (Date.now() + 1).toString(),
        episode: data.episode || currentEpisode
      };

      setMessages(prev => {
        const updated = [...prev, aiMessage];
        
        if (decisionAnalysis.isMajorChoice) {
          const lastUserMsg = updated.filter(m => m.type === 'user').pop();
          if (lastUserMsg) {
            lastUserMsg.emotionalTone = decisionAnalysis.emotionalTone;
            lastUserMsg.keyDecisions = [decisionAnalysis.playerWords];
          }
        }
        
        return updated;
      });
      
      const aiTextLength = data.text.length;
      const newTotalSymbols = totalSymbolsInEpisode + aiTextLength;
      const newTurns = Math.floor(newTotalSymbols / 600);
      const episodeChanged = newTurns >= 5;
      
      // Проверяем ПЕРЕД обновлением состояния
      const shouldGenImage = autoIllustrations && 
                            imagesInEpisode < 4 && 
                            (turnsInEpisode % Math.max(Math.floor(5 / 4), 1) === 0 || turnsInEpisode === 0);
      
      console.log('Image generation check:', { 
        autoIllustrations, 
        imagesInEpisode, 
        turnsInEpisode,
        shouldGenImage 
      });
      
      setTotalSymbolsInEpisode(newTotalSymbols);
      setTurnsInEpisode(newTurns);
      
      if (episodeChanged) {
        setCurrentEpisode(prev => prev + 1);
        setTurnsInEpisode(0);
        setImagesInEpisode(0);
        setTotalSymbolsInEpisode(0);
      }

      if (shouldGenImage) {
        console.log('Starting image generation for message:', aiMessage.id);
        setGeneratingIllustration(true);
        setImagesInEpisode(prev => prev + 1);
        generateIllustration(data.text).then(illustrationUrl => {
          if (illustrationUrl) {
            setMessages(prev => prev.map(m => 
              m.id === aiMessage.id ? { ...m, illustration: illustrationUrl } : m
            ));
          }
          setGeneratingIllustration(false);
        }).catch(() => setGeneratingIllustration(false));
      }

      if (data.characters && data.characters.length > 0) {
        setCharacters(prev => {
          const existingNames = prev.map(c => c.name);
          const newChars = data.characters.filter(
            (c: Character) => !existingNames.includes(c.name)
          );
          return [...prev, ...newChars];
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: 'Время ожидания истекло',
          description: 'ИИ слишком долго думает. Попробуйте упростить запрос или повторить позже.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Ошибка ИИ',
          description: 'Не удалось получить ответ. Попробуйте ещё раз.',
          variant: 'destructive'
        });
      }
    } finally {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setIsProcessing(false);
    }
  };

  const handleCharacterCreated = (character: Character) => {
    setCharacters(prev => [...prev, character]);
  };

  // Автосохранение игры с памятью
  useEffect(() => {
    if (!gameSettings || messages.length === 0 || !currentGameId) return;

    const updateStoryMemory = () => {
      const keyMoments = messages
        .filter(m => m.type === 'user' && m.keyDecisions && m.keyDecisions.length > 0)
        .map((m, idx) => ({
          turn: idx + 1,
          playerAction: m.keyDecisions![0],
          consequence: messages[messages.indexOf(m) + 1]?.content.slice(0, 200) || '',
          emotionalWeight: m.emotionalTone === 'romantic' ? 100 : m.emotionalTone === 'aggressive' ? -50 : 0
        }));
      
      const characterRelationships: Record<string, number> = {};
      characters.forEach(char => {
        const romanticMoments = messages.filter(
          m => m.type === 'user' && m.emotionalTone === 'romantic' && 
          m.content.toLowerCase().includes(char.name.toLowerCase())
        ).length;
        const aggressiveMoments = messages.filter(
          m => m.type === 'user' && m.emotionalTone === 'aggressive' && 
          m.content.toLowerCase().includes(char.name.toLowerCase())
        ).length;
        const friendlyMoments = messages.filter(
          m => m.type === 'user' && m.emotionalTone === 'friendly' && 
          m.content.toLowerCase().includes(char.name.toLowerCase())
        ).length;
        
        characterRelationships[char.name] = (romanticMoments * 20 + friendlyMoments * 10 - aggressiveMoments * 15);
      });
      
      return {
        keyMoments: keyMoments.slice(-5),
        characterRelationships,
        worldChanges: []
      };
    };

    const saveGameToDB = async () => {
      try {
        const storyMemory = updateStoryMemory();
        
        await updateGame(currentGameId, {
          actions_log: messages.map(m => ({
            type: m.type,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
            id: m.id,
            episode: m.episode,
            illustration: m.illustration,
            keyDecisions: m.keyDecisions,
            emotionalTone: m.emotionalTone
          })),
          story_context: JSON.stringify({
            ...gameSettings,
            storyMemory
          })
        });
      } catch (error) {
        console.error('Ошибка автосохранения в БД:', error);
      }
    };

    const timeoutId = setTimeout(saveGameToDB, 2000);
    return () => clearTimeout(timeoutId);
  }, [messages, currentEpisode, gameSettings, characters, currentGameId, updateGame]);

  const handleDiceRoll = () => {
    const actions = [
      'Осмотреться вокруг',
      'Поговорить с ближайшим персонажем',
      'Исследовать интересный объект',
      'Попытаться что-то неожиданное',
      'Вспомнить что-то важное',
      'Предложить план действий'
    ];
    setCurrentInput(actions[Math.floor(Math.random() * actions.length)]);
  };

  const handleKickAI = async () => {
    // Создаём звуковой эффект пинка
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const kickSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    };

    kickSound();

    if (isProcessing) {
      toast({
        title: '👟 ИИ пнут!',
        description: 'Ускоряем процесс... Попробуйте отправить запрос снова.',
      });
      setIsProcessing(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    const kickPrompts = [
      'Продолжи историю! Что-то должно произойти!',
      'Эй, ИИ! Давай развивать сюжет дальше!',
      'Не тормози! Что происходит дальше?',
      'Хватит молчать! Покажи драму!',
      'Действие! Нужно больше действия!'
    ];

    const randomKick = kickPrompts[Math.floor(Math.random() * kickPrompts.length)];
    setCurrentInput(randomKick);
    
    toast({
      title: '👟 Пинок отправлен!',
      description: 'ИИ получил мотивацию продолжить историю',
    });
  };

  useEffect(() => {
    if (storyInitializedRef.current) return;
    if (!gameSettings) return;
    if (messages.length > 0) return;
    if (isProcessing) return;
    
    storyInitializedRef.current = true;
    
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 90000);
    
    const startStory = async () => {
      setIsProcessing(true);
      setProcessingTime(0);
      
      const timerInterval = window.setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
      
      try {
        const startAction = gameSettings.setting 
          ? `Начни историю в сеттинге: ${gameSettings.setting}`
          : 'Начни захватывающую историю';

        const response = await fetch(AI_STORY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: startAction,
            settings: gameSettings,
            history: []
          }),
          signal: abortController.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`AI request failed: ${response.status}`);

        const data = await response.json();
        
        const aiMessage: Message = {
          type: 'ai',
          content: data.text,
          timestamp: new Date(),
          id: Date.now().toString(),
          episode: data.episode || 1
        };

        setMessages([aiMessage]);
        setCurrentEpisode(data.episode || 1);

        if (data.characters && data.characters.length > 0) {
          setCharacters(data.characters);
        }

        if (autoIllustrations) {
          setGeneratingIllustration(true);
          generateIllustration(data.text).then(illustrationUrl => {
            if (illustrationUrl) {
              setMessages([{ ...aiMessage, illustration: illustrationUrl }]);
            }
            setGeneratingIllustration(false);
          }).catch(() => setGeneratingIllustration(false));
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          storyInitializedRef.current = false;
          return;
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast({
          title: 'Ошибка запуска',
          description: `Не удалось начать историю: ${errorMessage}`,
          variant: 'destructive'
        });
        storyInitializedRef.current = false;
      } finally {
        clearInterval(timerInterval);
        setIsProcessing(false);
      }
    };

    startStory();
    
    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [gameSettings, messages.length, autoIllustrations, toast]);

  return {
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
  };
};