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

  update(id: string, updates: Partial<Omit<Universe, 'id' | 'createdAt'>>): Universe | null {
    const universes = this.getAll();
    const index = universes.findIndex(u => u.id === id);
    
    if (index === -1) return null;
    
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
