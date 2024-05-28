import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        {!user ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Sign in to Stonks</h2>
            <button
              onClick={signInWithGoogle}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
            <p className="mb-4">Signed in as {user.email}</p>
            <button
              onClick={signOut}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
