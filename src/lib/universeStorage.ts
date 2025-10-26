export interface Universe {
  id: string;
  name: string;
  description: string;
  genre: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'fanfic_universes';

export const universeStorage = {
  getAll(): Universe[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save(universe: Omit<Universe, 'id' | 'createdAt' | 'updatedAt'>): Universe {
    const universes = this.getAll();
    const newUniverse: Universe = {
      ...universe,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    universes.push(newUniverse);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(universes));
    return newUniverse;
  },

  async update(id: string, updates: Partial<Omit<Universe, 'id' | 'createdAt'>>): Promise<Universe | null> {
    const universes = this.getAll();
    const universe = universes.find(u => u.id === id);
    
    if (!universe) return null;
    
    try {
      const response = await fetch('https://functions.poehali.dev/3075b346-65de-494b-be4b-4fc1cc68b759', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(id),
          name: updates.name || universe.name,
          description: updates.description || universe.description,
          genre: updates.genre || universe.genre,
          tags: updates.tags || universe.tags,
          source_type: 'custom'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update universe');
      }
    } catch (error) {
    }
    
    const index = universes.findIndex(u => u.id === id);
    universes[index] = {
      ...universes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(universes));
    return universes[index];
  },

  delete(id: string): boolean {
    const universes = this.getAll();
    const filtered = universes.filter(u => u.id !== id);
    
    if (filtered.length === universes.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getById(id: string): Universe | null {
    return this.getAll().find(u => u.id === id) || null;
  },
};