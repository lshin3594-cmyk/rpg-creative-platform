import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { canonUniverses, UniverseFormData } from './universeTypes';

interface CanonUniverseFormProps {
  formData: UniverseFormData;
  setFormData: (data: UniverseFormData) => void;
  handleCanonSelect: (canon: typeof canonUniverses[0]) => void;
  handleCreate: () => void;
  isCreating: boolean;
}

export const CanonUniverseForm = ({
  formData,
  setFormData,
  handleCanonSelect,
  handleCreate,
  isCreating
}: CanonUniverseFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <p className="text-sm text-muted-foreground">
        ИИ изучит каноническую вселенную и будет следовать её правилам
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {canonUniverses.map((canon, idx) => (
          <Card 
            key={idx}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => handleCanonSelect(canon)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon name={canon.icon as any} size={20} />
                {canon.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {canon.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Источник: {canon.source}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {formData.canonSource && (
        <div className="space-y-4 pt-4 border-t animate-fade-in">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <h3 className="font-semibold">Выбрано: {formData.name}</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="canon-description">Дополнительное описание (опционально)</Label>
            <Textarea 
              id="canon-description"
              placeholder="Укажите конкретный период или аспект вселенной..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="min-h-[80px]"
            />
          </div>
          <Button 
            className="w-full gap-2" 
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : (
              <Icon name="Download" size={20} />
            )}
            {isCreating ? 'Изучаю вселенную...' : 'Добавить и изучить'}
          </Button>
        </div>
      )}
    </div>
  );
};
