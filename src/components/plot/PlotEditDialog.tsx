import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PlotFormFields } from './PlotFormFields';

interface PlotEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    description: string;
    mainConflict: string;
    keyEvents: string;
    resolution: string;
    genres: string[];
  };
  setFormData: (data: any) => void;
  plotGenres: Array<{ value: string; label: string; icon: string }>;
  toggleGenre: (genre: string) => void;
  onGeneratePlot: () => void;
  isGenerating: boolean;
  onUpdate: () => void;
  isCreating: boolean;
}

export const PlotEditDialog = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  plotGenres,
  toggleGenre,
  onGeneratePlot,
  isGenerating,
  onUpdate,
  isCreating
}: PlotEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Редактирование сюжета</DialogTitle>
          <DialogDescription>
            Обнови описание и структуру сюжета
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <PlotFormFields
            formData={formData}
            setFormData={setFormData}
            plotGenres={plotGenres}
            toggleGenre={toggleGenre}
            onGeneratePlot={onGeneratePlot}
            isGenerating={isGenerating}
            isEdit={true}
          />

          <Button 
            className="w-full gap-2" 
            onClick={onUpdate}
            disabled={isCreating || !formData.name}
          >
            {isCreating ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : (
              <Icon name="Save" size={20} />
            )}
            {isCreating ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
