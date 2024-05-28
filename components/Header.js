import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-900">Stonks</h1>
        {!user ? (
          <div className="text-center">
            <button
              onClick={signInWithGoogle}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white text-md rounded-lg shadow-md focus:outline-none"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={signOut}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white text-md rounded-lg shadow-md focus:outline-none"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
