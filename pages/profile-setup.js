import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const ProfileSetup = () => {
  const [username, setUsername] = useState('');
  const [notificationPreferences, setNotificationPreferences] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (username) {
      checkUsernameAvailability(username);
    }
  }, [username]);

  const checkUsernameAvailability = async (username) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username);

    if (error) {
      console.error('Error checking username:', error.message);
      setUsernameAvailable(false);
    } else if (data.length > 0) {
      setUsernameAvailable(false);
    } else {
      setUsernameAvailable(true);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError.message);
      return;
    }

    if (user && usernameAvailable) {
      // Check if the profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', profileError.message);
        return;
      }

      if (existingProfile) {
        // Update the existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username,
            notification_preferences: notificationPreferences,
            email: user.email, // Ensure email is included
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError.message);
        } else {
          router.push('/');
        }
      } else {
        // Insert a new profile
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          username,
          notification_preferences: notificationPreferences,
          email: user.email, // Ensure email is included
        });

        if (insertError) {
          console.error('Error inserting profile:', insertError.message);
        } else {
          router.push('/');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {loading ? (
              <p className="text-blue-500 text-sm mt-2">
                Checking availability...
              </p>
            ) : usernameAvailable === null ? null : usernameAvailable ? (
              <p className="text-green-500 text-sm mt-2">
                Username is available!
              </p>
            ) : (
              <p className="text-red-500 text-sm mt-2">Username is taken!</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                checked={notificationPreferences}
                onChange={(e) => setNotificationPreferences(e.target.checked)}
                className="mr-2 leading-tight"
              />
              Enable Notifications
            </label>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none ${
                !usernameAvailable && 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!usernameAvailable}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
