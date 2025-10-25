import { useState } from 'react';

export const useAIGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (prompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('DeepSeek API key not found');
      return '';
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150
        })
      });

      if (!response.ok) {
        console.error('Generation failed:', response.statusText);
        return '';
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('AI Generation error:', error);
      return '';
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating };
};
