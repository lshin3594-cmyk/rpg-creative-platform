import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { CharactersList, Character } from '@/components/profile/CharactersList';
import { CreateCharacterDialog } from '@/components/profile/CreateCharacterDialog';
import { EditCharacterDialog } from '@/components/profile/EditCharacterDialog';

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const savedCharacters = localStorage.getItem('user-characters');
    if (savedCharacters) {
      try {
        const parsed = JSON.parse(savedCharacters);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCharacters(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved characters:', e);
      }
    }
    
    const defaultChar = [{
      id: '1',
      name: 'Космический Рейнджер',
      role: 'Исследователь',
      avatar: 'https://cdn.poehali.dev/files/179eeb57-770d-43b9-b464-f8c287a1afbb.png',
      personality: 'Отважный защитник галактики'
    }];
    setCharacters(defaultChar);
    localStorage.setItem('user-characters', JSON.stringify(defaultChar));
  }, []);

  const handleCreateCharacter = (newCharacter: { name: string; role: string; personality: string; avatar: string; scenes?: string; quotes?: string; ideas?: string; isMainCharacter?: boolean }) => {
    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name,
      role: newCharacter.role,
      avatar: newCharacter.avatar || '',
      personality: newCharacter.personality,
      scenes: newCharacter.scenes,
      quotes: newCharacter.quotes,
      ideas: newCharacter.ideas,
      isMainCharacter: newCharacter.isMainCharacter
    };

    const updatedCharacters = [...characters, character];
    setCharacters(updatedCharacters);
    localStorage.setItem('user-characters', JSON.stringify(updatedCharacters));
    
    const charType = newCharacter.isMainCharacter ? 'Главный герой' : 'NPC';
    toast({ title: `${charType} создан! 🎭`, description: `${newCharacter.name} добавлен в список персонажей` });
  };

  const handleDeleteCharacter = (id: string) => {
    const updatedCharacters = characters.filter(c => c.id !== id);
    setCharacters(updatedCharacters);
    localStorage.setItem('user-characters', JSON.stringify(updatedCharacters));
    toast({ title: 'Персонаж удалён', description: 'Персонаж успешно удалён из списка' });
  };

  const handleEditCharacter = () => {
    const savedCharacters = localStorage.getItem('user-characters');
    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters));
    }
    setEditingCharacter(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="w-full space-y-6">
      <ProfileHeader user={user} />
      <ProfileSettings onLogout={handleLogout} onNavigateHome={handleNavigateHome} />
      <CharactersList 
        characters={characters} 
        onDelete={handleDeleteCharacter}
        onCreateNew={() => setIsCreateDialogOpen(true)}
        onEdit={setEditingCharacter}
      />
      <CreateCharacterDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCharacter}
      />
      <EditCharacterDialog
        character={editingCharacter}
        open={!!editingCharacter}
        onOpenChange={(open) => !open && setEditingCharacter(null)}
        onSave={handleEditCharacter}
      />
    </div>
  );
};