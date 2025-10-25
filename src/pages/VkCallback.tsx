import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const VkCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    console.log('VK Callback - code:', code);

    if (!code) {
      console.error('No code in URL');
      toast({ title: 'Ошибка авторизации VK', variant: 'destructive' });
      navigate('/');
      return;
    }

    const requestData = {
      provider: 'vk',
      code,
      redirect_uri: `${window.location.origin}/auth/vk/callback`
    };

    console.log('Sending to OAuth API:', requestData);

    fetch('https://functions.poehali.dev/cd68042f-5d2d-437d-83a5-6139b999a084', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Response data:', data);
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          toast({ title: 'Вы вошли через ВКонтакте!' });
          navigate('/');
          window.location.reload();
        } else {
          throw new Error(data.error || 'Ошибка авторизации');
        }
      })
      .catch(err => {
        console.error('OAuth error:', err);
        toast({ 
          title: 'Ошибка входа через ВКонтакте', 
          description: err.message,
          variant: 'destructive' 
        });
        navigate('/');
      });
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Вход через ВКонтакте...</p>
      </div>
    </div>
  );
};

export default VkCallback;