export const parseMetaFromStory = (story: string, episodeNum: number) => {
  const metaMatch = story.match(/\*\*\[МЕТА\]\*\*([\s\S]*?)---/);
  if (!metaMatch) return null;

  const metaText = metaMatch[1];
  
  const timeMatch = metaText.match(/⏰[^:]*:\s*(.+)/);
  const eventsMatch = metaText.match(/🎬[^:]*:\s*(.+)/);
  const relationsMatch = metaText.match(/💕[^:]*:\s*(.+)/);
  const emotionsMatch = metaText.match(/🧠[^:]*:\s*(.+)/);
  const cluesMatch = metaText.match(/🔍[^:]*:\s*(.+)/);
  const questionsMatch = metaText.match(/❓[^:]*:\s*(.+)/);
  const plansMatch = metaText.match(/🎯[^:]*:\s*(.+)/);
  const inventoryMatch = metaText.match(/🎒[^:]*:\s*(.+)/);
  const resourcesMatch = metaText.match(/💰[^:]*:\s*(.+)/);

  // Парсинг инвентаря: "Меч (1), Зелье здоровья (3)"
  const inventory = inventoryMatch 
    ? inventoryMatch[1].split(',').map(item => {
        const match = item.trim().match(/(.+?)\s*\((\d+)\)/);
        if (match) {
          return { name: match[1].trim(), quantity: parseInt(match[2]) };
        }
        return { name: item.trim() };
      })
    : [];

  // Парсинг ресурсов: "Золото: 150 (+50), Здоровье: 80 (-20)"
  const resources = resourcesMatch
    ? resourcesMatch[1].split(',').map(res => {
        const match = res.trim().match(/(.+?):\s*(\d+)\s*(?:\(([+-]\d+)\))?/);
        if (match) {
          return {
            name: match[1].trim(),
            value: parseInt(match[2]),
            change: match[3] ? parseInt(match[3]) : undefined
          };
        }
        return null;
      }).filter(Boolean) as { name: string; value: number; change?: number }[]
    : [];

  const storyWithoutMeta = story.replace(/\*\*\[МЕТА\]\*\*[\s\S]*?---\s*/, '');

  return {
    episode: episodeNum,
    title: `Эпизод ${episodeNum}`,
    time: timeMatch ? timeMatch[1].trim() : undefined,
    location: timeMatch ? timeMatch[1].split(',').pop()?.trim() : undefined,
    events: eventsMatch ? [eventsMatch[1].trim()] : [],
    npcs: [],
    emotions: emotionsMatch ? [emotionsMatch[1].trim()] : [],
    clues: cluesMatch ? [cluesMatch[1].trim()] : [],
    questions: questionsMatch ? [questionsMatch[1].trim()] : [],
    plans: plansMatch ? [plansMatch[1].trim()] : [],
    inventory,
    resources,
    cleanStory: storyWithoutMeta
  };
};