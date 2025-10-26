import { useNavigate } from 'react-router-dom';

const IndexTest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">
          🚀 TEST PAGE - Midnight Chronicles
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/create-game')}
            className="block w-full px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            НАЧАТЬ ИГРУ
          </button>
          
          <button
            onClick={() => navigate('/game-saves')}
            className="block w-full px-8 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
          >
            МОИ ИГРЫ
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="block w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ПРОФИЛЬ
          </button>
        </div>
        
        <p className="text-purple-300">
          Если видишь этот текст - React работает ✅
        </p>
      </div>
    </div>
  );
};

export default IndexTest;
