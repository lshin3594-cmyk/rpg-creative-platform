export interface SavedStory {
  id: string;
  title: string;
  messages: Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    id: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

const STORAGE_KEY = 'midnight-chronicles-stories';

export const storyStorage = {
  getAll(): SavedStory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const stories = JSON.parse(data);
      return stories.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
    } catch {
      return [];
    }
  },

  save(story: SavedStory): void {
    const stories = this.getAll();
    const index = stories.findIndex(s => s.id === story.id);
    
    if (index >= 0) {
      stories[index] = { ...story, updatedAt: new Date() };
    } else {
      stories.push(story);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  },

  delete(id: string): void {
    const stories = this.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  },

  getById(id: string): SavedStory | null {
    return this.getAll().find(s => s.id === id) || null;
  }
};
