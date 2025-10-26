import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface GameSettingsProps {
  genres: string[];
  setGenres: (genres: string[]) => void;
  rating: string;
  setRating: (rating: string) => void;
  eloquenceLevel: number;
  setEloquenceLevel: (level: number) => void;
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
  'Приключения'
];

export const GameSettings = ({
  genres,
  setGenres,
  rating,
  setRating,
  eloquenceLevel,
  setEloquenceLevel
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
      </div>

      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <Label className="text-purple-200/80 text-sm mb-3 block">
          Уровень красноречия
        </Label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="5"
              value={eloquenceLevel}
              onChange={(e) => setEloquenceLevel(Number(e.target.value))}
              className="flex-1 h-2 bg-black/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-purple-300 font-bold text-lg min-w-[2rem] text-center">
              {eloquenceLevel}
            </span>
          </div>
          <div className="flex justify-between text-xs text-purple-300/60">
            <span>Простые фразы</span>
            <span>Литературный стиль</span>
          </div>
        </div>
      </div>
    </div>
  );
};
