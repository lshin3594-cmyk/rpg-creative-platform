import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';
import Icon from './icon';
import { Textarea } from './textarea';

interface InputWithAIProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => Promise<void>;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  required?: boolean;
}

export const InputWithAI = ({
  label,
  id,
  value,
  onChange,
  onGenerate,
  placeholder,
  multiline = false,
  className,
  required = false
}: InputWithAIProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="h-7 gap-1.5 text-xs"
        >
          <Icon 
            name={isGenerating ? "Loader2" : "Sparkles"} 
            size={14} 
            className={isGenerating ? "animate-spin" : ""} 
          />
          {isGenerating ? 'Генерация...' : 'ИИ'}
        </Button>
      </div>
      <InputComponent
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </div>
  );
};