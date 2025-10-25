import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { CustomUniverseForm } from './CustomUniverseForm';
import { CanonUniverseForm } from './CanonUniverseForm';
import { UniverseFormData, canonUniverses } from './universeTypes';

interface UniverseCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UniverseFormData;
  setFormData: (data: UniverseFormData) => void;
  toggleGenre: (genre: string) => void;
  handleGeneratePlot: () => void;
  isGeneratingPlot: boolean;
  handleCreate: () => void;
  isCreating: boolean;
}

export const UniverseCreateDialog = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  toggleGenre,
  handleGeneratePlot,
  isGeneratingPlot,
  handleCreate,
  isCreating
}: UniverseCreateDialogProps) => {
  const handleCanonSelect = (canon: typeof canonUniverses[0]) => {
    setFormData({
      name: canon.name,
      description: canon.description,
      lore: '',
      rules: '',
      characters: '',
      locations: '',
      timeline: '',
      canonSource: canon.source,
      isCustom: false,
      mainConflict: '',
      keyEvents: '',
      resolution: '',
      genres: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="Plus" size={20} />
          Создать вселенную
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Создание вселенной</DialogTitle>
          <DialogDescription>
            Выберите каноническую вселенную или создайте свою со всеми деталями
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="custom" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="custom">Своя вселенная</TabsTrigger>
            <TabsTrigger value="canon">Каноническая</TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom">
            <CustomUniverseForm
              formData={formData}
              setFormData={setFormData}
              toggleGenre={toggleGenre}
              handleGeneratePlot={handleGeneratePlot}
              isGeneratingPlot={isGeneratingPlot}
              handleCreate={handleCreate}
              isCreating={isCreating}
            />
          </TabsContent>
          
          <TabsContent value="canon">
            <CanonUniverseForm
              formData={formData}
              setFormData={setFormData}
              handleCanonSelect={handleCanonSelect}
              handleCreate={handleCreate}
              isCreating={isCreating}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
