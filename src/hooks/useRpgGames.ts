import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const RPG_GAMES_URL = 'https://functions.poehali.dev/4576de82-0376-4554-bc5f-79570bb283e9';

export interface RpgGame {
  id: number;
  user_id: number;
  title: string;
  genre?: string;
  setting?: string;
  difficulty?: string;
  current_chapter?: string;
  story_context?: string;
  actions_log?: any[];
  inventory?: any[];
  stats?: Record<string, any>;
  combat_log?: any[];
  player_character_id?: number;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
  last_played?: string;
}

export function useRpgGames() {
  const { user, token } = useAuth();
  const [games, setGames] = useState<RpgGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGames = async () => {
    if (!user || !token) {
      setGames([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(RPG_GAMES_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load games');
      }

      const data = await response.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (gameData: Partial<RpgGame>): Promise<RpgGame | null> => {
    if (!user || !token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(RPG_GAMES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(gameData)
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const newGame = await response.json();
      await loadGames();
      return newGame;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  const updateGame = async (gameId: number, updates: Partial<RpgGame>): Promise<RpgGame | null> => {
    if (!user || !token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${RPG_GAMES_URL}?id=${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update game');
      }

      const updatedGame = await response.json();
      await loadGames();
      return updatedGame;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  const deleteGame = async (gameId: number): Promise<boolean> => {
    if (!user || !token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${RPG_GAMES_URL}?id=${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      await loadGames();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  const getGame = async (gameId: number): Promise<RpgGame | null> => {
    if (!user || !token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${RPG_GAMES_URL}?id=${gameId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load game');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  useEffect(() => {
    loadGames();
  }, [user, token]);

  return {
    games,
    loading,
    error,
    loadGames,
    createGame,
    updateGame,
    deleteGame,
    getGame
  };
}
