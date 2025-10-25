import { StoryGenerator } from '@/components/StoryGenerator';
import { useParams } from 'react-router-dom';

const StoryView = () => {
  const { id } = useParams<{ id: string }>();
  return <StoryGenerator storyId={id} />;
};

export default StoryView;