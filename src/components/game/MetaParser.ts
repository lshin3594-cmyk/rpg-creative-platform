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
    cleanStory: storyWithoutMeta
  };
};
