import { useState } from 'react';
import type { Character, World } from './useDataManagement';

export const useStoryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [storyPrompt, setStoryPrompt] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedWorld, setSelectedWorld] = useState<string>('');
  const [narrativeMode, setNarrativeMode] = useState('mixed');
  const [playerCharacterId, setPlayerCharacterId] = useState('');
  const [showInteractive, setShowInteractive] = useState(false);
  const [currentStoryContext, setCurrentStoryContext] = useState('');

  const saveStory = async (
    storyContent: string,
    prompt: string,
    characters: Character[],
    worlds: World[],
    selectedChar: string,
    selectedWrld: string
  ) => {
    const character = selectedChar ? characters.find(c => c.id === selectedChar) : null;
    const world = selectedWrld ? worlds.find(w => w.id === selectedWrld) : null;
    
    try {
      const response = await fetch('https://functions.poehali.dev/71ffaad1-3e69-422c-ad49-81aec9f550de', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: prompt.substring(0, 100),
          content: storyContent,
          prompt: prompt,
          character_name: character?.name || '',
          world_name: world?.name || '',
          genre: world?.genre || 'фэнтези'
        })
      });
      
      const savedStory = await response.json();
      return savedStory.id ? true : false;
    } catch (error) {
      console.error('Error saving story:', error);
      return false;
    }
  };

  const generateStory = async (
    characters: Character[],
    worlds: World[],
    onSaved?: () => void
  ) => {
    if (!storyPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const playerChar = playerCharacterId ? characters.find(c => c.id === playerCharacterId) : null;
      const npcChars = characters.filter(c => c.character_type === 'npc');
      const world = selectedWorld ? worlds.find(w => w.id === selectedWorld) : null;
      
      const npcCharactersText = npcChars.map(c => 
        `${c.name} (${c.role}) - ${c.personality}`
      ).join('; ');
      
      const response = await fetch('https://functions.poehali.dev/52ab4d94-b7a4-4399-ab17-b239ff31342a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: storyPrompt,
          character: playerChar ? `${playerChar.name} (${playerChar.role}) - ${playerChar.personality}` : '',
          npc_characters: npcCharactersText,
          world: world ? `${world.name} - ${world.description}` : '',
          genre: world?.genre || 'фэнтези',
          narrative_mode: narrativeMode
        })
      });
      
      const data = await response.json();
      if (data.story) {
        setGeneratedStory(data.story);
        setCurrentStoryContext(data.story);
        await saveStory(data.story, storyPrompt, characters, worlds, selectedCharacter, selectedWorld);
        if (onSaved) onSaved();
        setShowInteractive(true);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const continueStory = async (
    playerAction: string,
    characters: Character[],
    worlds: World[]
  ) => {
    const playerChar = playerCharacterId ? characters.find(c => c.id === playerCharacterId) : null;
    const npcChars = characters.filter(c => c.character_type === 'npc');
    const world = selectedWorld ? worlds.find(w => w.id === selectedWorld) : null;
    
    const npcCharactersText = npcChars.map(c => 
      `${c.name} (${c.role}) - ${c.personality}`
    ).join('; ');
    
    const response = await fetch('https://functions.poehali.dev/52ab4d94-b7a4-4399-ab17-b239ff31342a', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        story_context: currentStoryContext,
        player_action: playerAction,
        character: playerChar ? `${playerChar.name} (${playerChar.role}) - ${playerChar.personality}` : '',
        npc_characters: npcCharactersText,
        world: world ? `${world.name} - ${world.description}` : '',
        genre: world?.genre || 'фэнтези',
        narrative_mode: narrativeMode
      })
    });
    
    const data = await response.json();
    if (data.continuation) {
      setCurrentStoryContext(currentStoryContext + '\n\n' + playerAction + '\n\n' + data.continuation);
      return data.continuation;
    }
    return '';
  };

  return {
    isGenerating,
    generatedStory,
    storyPrompt,
    setStoryPrompt,
    selectedCharacter,
    setSelectedCharacter,
    selectedWorld,
    setSelectedWorld,
    narrativeMode,
    setNarrativeMode,
    playerCharacterId,
    setPlayerCharacterId,
    showInteractive,
    setShowInteractive,
    currentStoryContext,
    setCurrentStoryContext,
    generateStory,
    continueStory
  };
};
