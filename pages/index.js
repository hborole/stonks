import { useAuth } from '../context/AuthContext';
import ChannelList from '../components/ChannelList';
import Header from '@/components/Header';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user ? (
          <div className="mb-4">
            <h1 className="text-3xl font-bold">Start Watching...</h1>
          </div>
        ) : (
          <div className="mb-4">
            <h1 className="text-3xl font-bold">Channels</h1>
          </div>
        )}
        <ChannelList />
      </div>
    </div>
  );
};

export default Home;
