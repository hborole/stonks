import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stonks</h1>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.email}</span>
            <button
              onClick={signOut}
              className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none"
            >
              Sign out
            </button>
          </div>
        ) : (
          <span className="text-gray-700">Not signed in</span>
        )}
      </div>
    </header>
  );
};

export default Header;
