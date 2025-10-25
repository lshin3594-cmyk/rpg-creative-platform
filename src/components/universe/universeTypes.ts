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
    source: 'Книги Дж. К. Роулинг, фильмы Warner Bros',
    tags: ['магия', 'школа', 'фэнтези', 'англия']
  },
  { 
    name: 'Властелин колец', 
    description: 'Средиземье, мир эльфов, гномов и хоббитов',
    icon: 'Castle',
    source: 'Книги Дж. Р. Р. Толкина',
    tags: ['фэнтези', 'эпик', 'средневековье', 'эльфы']
  },
  { 
    name: 'Звёздные войны', 
    description: 'Галактика далеко-далеко, джедаи и ситхи',
    icon: 'Rocket',
    source: 'Фильмы Lucasfilm, расширенная вселенная',
    tags: ['космос', 'sci-fi', 'джедаи', 'эпик']
  },
  { 
    name: 'Marvel', 
    description: 'Вселенная супергероев и злодеев',
    icon: 'Zap',
    source: 'Комиксы Marvel, фильмы MCU',
    tags: ['супергерои', 'современность', 'экшн', 'фантастика']
  },
  { 
    name: 'Игра престолов', 
    description: 'Вестерос, мир интриг и драконов',
    icon: 'Crown',
    source: 'Книги Джорджа Мартина, сериал HBO',
    tags: ['фэнтези', 'интриги', 'драконы', 'средневековье']
  },
  { 
    name: 'Ведьмак', 
    description: 'Континент, мир монстров и магии',
    icon: 'Sword',
    source: 'Книги Анджея Сапковского, игры CD Projekt Red',
    tags: ['фэнтези', 'монстры', 'славянская мифология', 'тёмное фэнтези']
  },
  { 
    name: 'Сверхъестественное', 
    description: 'Охотники на демонов, ангелы и апокалипсис',
    icon: 'Ghost',
    source: 'Сериал CW, 15 сезонов',
    tags: ['городское фэнтези', 'демоны', 'ангелы', 'современность', 'мистика']
  },
  { 
    name: 'Mo Dao Zu Shi', 
    description: 'Мир культиваторов, духов и древней магии',
    icon: 'Sparkles',
    source: 'Роман Mo Xiang Tong Xiu, donghua, маньхуа',
    tags: ['уся', 'культивация', 'китайское фэнтези', 'даосизм', 'боевые искусства']
  },
  { 
    name: 'Толкиниана (Хоббит)', 
    description: 'Приключения в Средиземье до событий Властелина Колец',
    icon: 'Mountain',
    source: 'Книга Дж. Р. Р. Толкина "Хоббит"',
    tags: ['фэнтези', 'приключения', 'хоббиты', 'драконы', 'гномы']
  },
  { 
    name: 'DC Universe', 
    description: 'Вселенная Бэтмена, Супермена и Лиги Справедливости',
    icon: 'Shield',
    source: 'Комиксы DC, фильмы Warner Bros',
    tags: ['супергерои', 'готэм', 'метрополис', 'темные истории']
  },
  { 
    name: 'Dune (Дюна)', 
    description: 'Пустынная планета Арракис, специя и политика',
    icon: 'Sun',
    source: 'Книги Фрэнка Герберта',
    tags: ['космическая опера', 'пустыня', 'политика', 'пророчества']
  },
  { 
    name: 'Хроники Нарнии', 
    description: 'Волшебный мир за шкафом, Аслан и вечная зима',
    icon: 'TreePine',
    source: 'Книги К. С. Льюиса',
    tags: ['детское фэнтези', 'магия', 'говорящие животные', 'христианские мотивы']
  },
  { 
    name: 'Avatar: The Last Airbender', 
    description: 'Четыре нации, магия стихий, баланс мира',
    icon: 'Waves',
    source: 'Мультсериал Nickelodeon',
    tags: ['восточная философия', 'магия стихий', 'приключения', 'война']
  },
  { 
    name: 'Warhammer 40000', 
    description: 'Мрачное далёкое будущее вечной войны',
    icon: 'Skull',
    source: 'Настольная игра Games Workshop',
    tags: ['grimdark', 'космос', 'война', 'хаос', 'sci-fi']
  },
  { 
    name: 'Шерлок (BBC)', 
    description: 'Современный Лондон, гениальный детектив',
    icon: 'Search',
    source: 'Сериал BBC',
    tags: ['детектив', 'современность', 'лондон', 'загадки']
  },
  { 
    name: 'Доктор Кто', 
    description: 'Путешествия во времени и пространстве',
    icon: 'Clock',
    source: 'Сериал BBC',
    tags: ['sci-fi', 'время', 'путешествия', 'британский юмор']
  },
  { 
    name: 'Властелин Колец Онлайн', 
    description: 'MMORPG версия Средиземья',
    icon: 'Gamepad2',
    source: 'Игра Standing Stone Games по вселенной Толкина',
    tags: ['фэнтези', 'mmorpg', 'средиземье', 'квесты']
  },
  { 
    name: 'Sword Art Online', 
    description: 'Застрявшие в VRMMO игроки',
    icon: 'Swords',
    source: 'Ранобэ Рэки Кавахары, аниме',
    tags: ['vrmmo', 'исекай', 'игровой мир', 'аниме']
  },
  { 
    name: 'Heaven Official\'s Blessing', 
    description: 'Божества, призраки и судьба в китайской мифологии',
    icon: 'CloudSun',
    source: 'Роман Mo Xiang Tong Xiu, donghua',
    tags: ['уся', 'боги', 'китайское фэнтези', 'романтика']
  },
  { 
    name: 'Тёмная башня', 
    description: 'Стрелок и его путь к центру мироздания',
    icon: 'Landmark',
    source: 'Серия книг Стивена Кинга',
    tags: ['тёмное фэнтези', 'вестерн', 'мультивселенная', 'постапокалипсис']
  }
];