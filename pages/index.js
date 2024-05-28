import Login from '../components/Login';
import ChannelList from '../components/ChannelList';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!user ? (
          <div className="flex items-center justify-center min-h-screen">
            <Login />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Hello, {user.email}!
            </h2>
            <ChannelList />
          </div>
        )}
      </main>
    </div>
  );
}
