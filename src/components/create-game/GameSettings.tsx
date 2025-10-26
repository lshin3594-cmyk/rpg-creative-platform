import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface GameSettingsProps {
  genres: string[];
  setGenres: (genres: string[]) => void;
  rating: string;
  setRating: (rating: string) => void;
  aiModel: 'deepseek' | 'gpt4o';
  setAiModel: (model: 'deepseek' | 'gpt4o') => void;
}

const AVAILABLE_GENRES = [
  'Фэнтези',
  'Киберпанк',
  'Ужасы',
  'Романтика',
  'Детектив',
  'Научная фантастика',
  'Постапокалипсис',
  'Историческое',
  'Драма',
  'Приключения',
  'Боевик',
  'Триллер',
  'Мистика',
  'Комедия',
  'Психологическое',
  'Нуар',
  'Стимпанк',
  'Военное',
  'Шпионское',
  'Космическая опера',
  'Антиутопия',
  'Супергерои',
  'Выживание'
];

export const GameSettings = ({
  genres,
  setGenres,
  rating,
  setRating,
  aiModel,
  setAiModel
}: GameSettingsProps) => {
  const toggleGenre = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 backdrop-blur-md">
      <Label className="text-purple-100 text-base mb-4 block">
        Настройки игры
      </Label>
      
      <div className="space-y-4">
        <div>
          <Label className="text-purple-200/80 text-sm mb-3 block">
            Жанры (можно выбрать несколько)
          </Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`
                  px-3 py-2 rounded-lg border transition-all text-sm
                  ${
                    genres.includes(genre)
                      ? 'bg-purple-500/40 border-purple-400 text-purple-100'
                      : 'bg-black/20 border-purple-500/30 text-purple-300/70 hover:border-purple-400/50 hover:text-purple-200'
                  }
                `}
              >
                {genres.includes(genre) && (
                  <Icon name="Check" size={14} className="inline mr-1" />
                )}
                {genre}
              </button>
            ))}
          </div>
          {genres.length === 0 && (
            <p className="text-purple-300/60 text-xs mt-2">
              Выберите хотя бы один жанр
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="rating" className="text-purple-200/80 text-sm mb-2 block">
            Рейтинг
          </Label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/30 border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none"
          >
            <option value="6+">6+ (Для детей)</option>
            <option value="12+">12+ (Подростки)</option>
            <option value="16+">16+ (Взрослые темы)</option>
            <option value="18+">18+ (Без цензуры)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="aiModel" className="text-purple-200/80 text-sm mb-2 block">
            ИИ модель
          </Label>
          <select
            id="aiModel"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value as 'deepseek' | 'gpt4o')}
            className="w-full p-3 rounded-lg bg-black/30 border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none"
          >
            <option value="gpt4o">GPT-4o (рекомендуется) — лучше следует сеттингу</option>
            <option value="deepseek">DeepSeek — быстрее, но хуже с уникальными мирами</option>
          </select>
          <p className="text-purple-300/60 text-xs mt-2">
            {aiModel === 'gpt4o' 
              ? '✅ GPT-4o точнее следует вашему сеттингу и не добавляет лишних персонажей'
              : '⚠️ DeepSeek может добавлять элементы из других вселенных'}
          </p>
        </div>
      </div>


    </div>
  );
};