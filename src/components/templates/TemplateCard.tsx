import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { GameTemplate } from './gameTemplates';

interface TemplateCardProps {
  template: GameTemplate;
  isSelected: boolean;
  isStarting: boolean;
  onSelect: () => void;
  onStartGame: () => void;
}

export function TemplateCard({ 
  template, 
  isSelected, 
  isStarting, 
  onSelect, 
  onStartGame 
}: TemplateCardProps) {
  return (
    <div
      className="group relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 border-purple-500/30"
      onClick={onSelect}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 rounded-xl transition-all duration-300" />
      
      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/40 transition-all duration-300">
            <Icon name={template.icon} size={32} className="text-purple-300" />
          </div>
          <div className="flex gap-1">
            {template.themes.slice(0, 2).map((theme) => (
              <span key={theme} className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-200">
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-1">{template.title}</h3>
          <p className="text-sm text-purple-300">{template.genre}</p>
        </div>

        <p className="text-sm text-purple-200/80 line-clamp-3">
          {template.description}
        </p>

        {isSelected && (
          <div className="space-y-4 pt-4 border-t border-purple-500/30 animate-fade-in">
            <p className="text-sm text-purple-200/90 max-h-48 overflow-y-auto">
              {template.setting}
            </p>
            
            <div className="flex gap-2 flex-wrap">
              {template.themes.map((theme) => (
                <span key={theme} className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200">
                  {theme}
                </span>
              ))}
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                onStartGame();
              }}
              disabled={isStarting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
            >
              <Icon name="UserCircle" className="mr-2" size={18} />
              Создать персонажа
            </Button>
          </div>
        )}

        {!isSelected && (
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            Подробнее
          </Button>
        )}
      </div>
    </div>
  );
}
