export async function migrateLocalStorageToDb(
  createGame: (gameData: any) => Promise<any>,
  token: string
) {
  try {
    const savedGamesJson = localStorage.getItem('game-saves');
    if (!savedGamesJson) {
      console.log('No old saves to migrate');
      return;
    }

    const savedGames = JSON.parse(savedGamesJson);
    if (!Array.isArray(savedGames) || savedGames.length === 0) {
      console.log('No games to migrate');
      return;
    }

    console.log(`Migrating ${savedGames.length} games from localStorage to PostgreSQL...`);

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

        console.log(`✅ Migrated: ${gameSettings.name}`);
      } catch (error) {
        console.error('Failed to migrate game:', error);
      }
    }

    localStorage.removeItem('game-saves');
    console.log('Migration completed! Old data removed from localStorage.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
