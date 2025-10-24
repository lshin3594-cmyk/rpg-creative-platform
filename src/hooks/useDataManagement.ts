import { useState } from 'react';

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: string;
  personality: string;
  backstory: string;
  character_type?: string;
}

export interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  prompt: string;
  character_name: string;
  world_name: string;
  genre: string;
  created_at: string;
}

export const useDataManagement = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);
  const [isLoadingWorlds, setIsLoadingWorlds] = useState(false);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [profileStats, setProfileStats] = useState({
    charactersCreated: 0,
    worldsCreated: 0,
    storiesGenerated: 0,
    totalWords: 0
  });

  const loadCharacters = async () => {
    setIsLoadingCharacters(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=characters');
      const data = await response.json();
      const loadedChars = data.map((c: any) => ({
        ...c,
        id: String(c.id)
      }));
      setCharacters(loadedChars);
      setProfileStats(prev => ({ ...prev, charactersCreated: data.length }));
      return loadedChars;
    } catch (error) {
      console.error('Error loading characters:', error);
      return [];
    } finally {
      setIsLoadingCharacters(false);
    }
  };

  const loadWorlds = async () => {
    setIsLoadingWorlds(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=worlds');
      const data = await response.json();
      setWorlds(data.map((w: any) => ({
        ...w,
        id: String(w.id)
      })));
      setProfileStats(prev => ({ ...prev, worldsCreated: data.length }));
    } catch (error) {
      console.error('Error loading worlds:', error);
    } finally {
      setIsLoadingWorlds(false);
    }
  };

  const loadStories = async () => {
    setIsLoadingStories(true);
    try {
      const response = await fetch('https://functions.poehali.dev/4edb076b-0c05-4d7c-853b-526d0c476653');
      const data = await response.json();
      if (data.stories) {
        setSavedStories(data.stories);
        const totalWords = data.stories.reduce((sum: number, story: Story) => {
          return sum + (story.content?.split(' ').length || 0);
        }, 0);
        setProfileStats(prev => ({ 
          ...prev, 
          storiesGenerated: data.stories.length,
          totalWords 
        }));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setIsLoadingStories(false);
    }
  };

  const createCharacter = async (data: Omit<Character, 'id'>) => {
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        await loadCharacters();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating character:', error);
      return false;
    }
  };

  const createWorld = async (data: Omit<World, 'id'>) => {
    try {
      const response = await fetch('https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=worlds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        await loadWorlds();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating world:', error);
      return false;
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=characters&id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadCharacters();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting character:', error);
      return false;
    }
  };

  const deleteWorld = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/f3c359fd-06ee-4643-bf4c-c6d7a7155696?type=worlds&id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadWorlds();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting world:', error);
      return false;
    }
  };

  const deleteStory = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/aaff4c60-19e2-4410-a5a6-48560de30278?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadStories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting story:', error);
      return false;
    }
  };

  return {
    characters,
    worlds,
    savedStories,
    isLoadingCharacters,
    isLoadingWorlds,
    isLoadingStories,
    profileStats,
    loadCharacters,
    loadWorlds,
    loadStories,
    createCharacter,
    createWorld,
    deleteCharacter,
    deleteWorld,
    deleteStory
  };
};
