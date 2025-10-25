import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PlotFormFields } from './PlotFormFields';

interface PlotCreateDialogProps {
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
  onCreate: () => void;
  isCreating: boolean;
}

export const PlotCreateDialog = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  plotGenres,
  toggleGenre,
  onGeneratePlot,
  isGenerating,
  onCreate,
  isCreating
}: PlotCreateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="Plus" size={20} />
          Создать сюжет
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Создание сюжета</DialogTitle>
          <DialogDescription>
            Опишите сюжетную линию для будущих историй
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
          />

          <Button 
            className="w-full gap-2" 
            onClick={onCreate}
            disabled={isCreating || !formData.name}
          >
            {isCreating ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : (
              <Icon name="Plus" size={20} />
            )}
            {isCreating ? 'Создание...' : 'Создать сюжет'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
