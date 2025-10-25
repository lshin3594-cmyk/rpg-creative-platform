export interface Universe {
  id: string;
  name: string;
  description: string;
  lore: string;
  rules: string;
  characters: string;
  locations: string;
  timeline: string;
  canonSource: string;
  isCustom: boolean;
  mainConflict?: string;
  keyEvents?: string;
  resolution?: string;
  genres?: string[];
  learnedAt?: Date;
}

export interface UniverseFormData {
  name: string;
  description: string;
  lore: string;
  rules: string;
  characters: string;
  locations: string;
  timeline: string;
  canonSource: string;
  isCustom: boolean;
  mainConflict: string;
  keyEvents: string;
  resolution: string;
  genres: string[];
}

export const canonUniverses = [
  { 
    name: 'Гарри Поттер', 
    description: 'Магический мир волшебников и магглов',
    icon: 'Wand2',
    source: 'Книги Дж. К. Роулинг, фильмы Warner Bros'
  },
  { 
    name: 'Властелин колец', 
    description: 'Средиземье, мир эльфов, гномов и хоббитов',
    icon: 'Castle',
    source: 'Книги Дж. Р. Р. Толкина'
  },
  { 
    name: 'Звёздные войны', 
    description: 'Галактика далеко-далеко, джедаи и ситхи',
    icon: 'Rocket',
    source: 'Фильмы Lucasfilm, расширенная вселенная'
  },
  { 
    name: 'Marvel', 
    description: 'Вселенная супергероев и злодеев',
    icon: 'Zap',
    source: 'Комиксы Marvel, фильмы MCU'
  },
  { 
    name: 'Игра престолов', 
    description: 'Вестерос, мир интриг и драконов',
    icon: 'Crown',
    source: 'Книги Джорджа Мартина, сериал HBO'
  },
  { 
    name: 'Ведьмак', 
    description: 'Континент, мир монстров и магии',
    icon: 'Sword',
    source: 'Книги Анджея Сапковского, игры CD Projekt Red'
  }
];
