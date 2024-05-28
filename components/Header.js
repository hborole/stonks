import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-900">Stonks</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/my-channel"
                className="text-blue-500 hover:text-gray-900"
              >
                My Channel
              </Link>
              <button
                onClick={signOut}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white text-md rounded-lg shadow-md focus:outline-none"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
