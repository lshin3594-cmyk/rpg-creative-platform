import { GameScreen } from '@/components/GameScreen';
import { useParams } from 'react-router-dom';

const StoryView = () => {
  const { id } = useParams<{ id: string }>();
  return <GameScreen gameId={id} />;
};

export default StoryView;