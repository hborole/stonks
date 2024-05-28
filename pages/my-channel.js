import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout'; // Adjust path as necessary

const MyChannel = () => {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const response = await fetch(`/api/profile?user_id=${user.id}`);
        const data = await response.json();
        if (data.username) {
          setUsername(data.username);
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  const handleToggleStreaming = async () => {
    const newStreamingState = !isStreaming;
    setIsStreaming(newStreamingState);
    // API call to update the streaming status
    await fetch(`/api/is-live`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, is_live: newStreamingState }),
    });
  };

  if (!user) {
    return (
      <Layout>
        <div>Please log in to view your channel.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to your channel, {username || user.username}
        </h1>
        <button
          onClick={handleToggleStreaming}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300"
        >
          {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
        </button>
        {isStreaming && (
          <div className="mt-4">
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="shadow-lg rounded-lg"
            ></iframe>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyChannel;
