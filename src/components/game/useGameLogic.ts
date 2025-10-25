import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Character, Message, GameSettings, AI_STORY_URL, IMAGE_GEN_URL } from './types';

export const useGameLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [showJournal, setShowJournal] = useState(false);
  const [showCreateChar, setShowCreateChar] = useState(false);
  const [agentsEnabled, setAgentsEnabled] = useState(true);
  const [autoIllustrations, setAutoIllustrations] = useState(true);
  const [generatingIllustration, setGeneratingIllustration] = useState(false);
  const turnCountRef = useRef(0);
  const storyInitializedRef = useRef(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const settingsJson = localStorage.getItem('current-game-settings');
    if (settingsJson) {
      setGameSettings(JSON.parse(settingsJson));
      storyInitializedRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const generateIllustration = async (aiText: string): Promise<string | undefined> => {
    if (!autoIllustrations) return undefined;

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
      return data.url;
    } catch (error) {
      console.error('Illustration generation failed:', error);
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

    try {
      const response = await fetch(AI_STORY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: userAction + agentPrompt,
          settings: gameSettings,
          history: messages.map(m => ({ type: m.type, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      
      const aiMessage: Message = {
        type: 'ai',
        content: data.text,
        timestamp: new Date(),
        id: (Date.now() + 1).toString(),
        episode: data.episode || currentEpisode
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentEpisode(data.episode || currentEpisode);

      if (autoIllustrations) {
        setGeneratingIllustration(true);
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
      console.error('Error:', error);
      toast({
        title: 'Ошибка ИИ',
        description: 'Не удалось получить ответ. Попробуйте ещё раз.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCharacterCreated = (character: Character) => {
    setCharacters(prev => [...prev, character]);
  };

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

  useEffect(() => {
    if (gameSettings && messages.length === 0 && !isProcessing && !storyInitializedRef.current) {
      storyInitializedRef.current = true;
      setIsProcessing(true);
      
      const abortController = new AbortController();
      
      const startStory = async () => {
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
            console.log('Auto-start aborted');
            return;
          }
          console.error('Auto-start error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Error details:', errorMessage);
          toast({
            title: 'Ошибка запуска',
            description: `Не удалось начать историю: ${errorMessage}`,
            variant: 'destructive'
          });
        } finally {
          setIsProcessing(false);
        }
      };

      startStory();
      
      return () => {
        abortController.abort();
      };
    }
  }, [gameSettings, messages.length, isProcessing, autoIllustrations, toast]);

  return {
    messages,
    characters,
    currentInput,
    isProcessing,
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
    handleDiceRoll
  };
};