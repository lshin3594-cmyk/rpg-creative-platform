export async function migrateLocalStorageToDb(
  createGame: (gameData: any) => Promise<any>,
  token: string
) {
  try {
    const savedGamesJson = localStorage.getItem('game-saves');
    if (!savedGamesJson) {
      return;
    }

    const savedGames = JSON.parse(savedGamesJson);
    if (!Array.isArray(savedGames) || savedGames.length === 0) {
      return;
    }

    for (const oldGame of savedGames) {
      try {
        const gameSettings = oldGame.gameSettings || oldGame.settings || {};
        
        await createGame({
          title: gameSettings.name || 'Игра без названия',
          genre: gameSettings.genre || 'Фэнтези',
          setting: gameSettings.setting || '',
          difficulty: gameSettings.rating || 'normal',
          story_context: JSON.stringify(gameSettings),
          actions_log: oldGame.history || [],
          current_chapter: oldGame.currentStory || oldGame.lastAction || ''
        });
      } catch (error) {
        // Failed to migrate game
      }
    }

    localStorage.removeItem('game-saves');
  } catch (error) {
    // Migration failed
  }
}