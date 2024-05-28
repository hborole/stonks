import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChannels = async () => {
      const userId = user ? user.id : null;
      const response = await fetch(
        `/api/channels/get-channel${userId ? `?user_id=${userId}` : ''}`
      );
      const data = await response.json();

      if (response.ok) {
        setChannels(data);
      } else {
        console.error('Error fetching channels:', data.error);
      }
      setLoading(false);
    };

    fetchChannels();
  }, [user]);

  const handleFollowToggle = async (channelId, isFollowed) => {
    if (!user) {
      console.error('User not signed in');
      return;
    }

    const method = isFollowed ? 'DELETE' : 'POST';
    const response = await fetch('/api/profiles/follow', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user.id, channel_id: channelId }),
    });

    const data = await response.json();

    if (response.ok) {
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel.id === channelId
            ? { ...channel, is_followed: !isFollowed }
            : channel
        )
      );
      console.log(data.message);
    } else {
      console.error('Error following/unfollowing channel:', data.error);
    }
  };

  if (loading) {
    return <div>Loading channels...</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {channels.map((channel) => (
          <li
            key={channel.id}
            className="px-4 py-4 sm:px-6 flex justify-between items-center"
          >
            <Link
              href={`/channel/${channel.id}`}
              className="block hover:bg-gray-50 flex-1"
            >
              <div>
                <p className="text-lg leading-6 font-medium text-indigo-600">
                  {channel.name}
                </p>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {channel.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            {user && (
              <div className="flex flex-col items-center">
                <button
                  onClick={() =>
                    handleFollowToggle(channel.id, channel.is_followed)
                  }
                  className={`mb-2 px-2 py-1 border rounded ${
                    channel.is_followed
                      ? 'border-gray-300 text-gray-500 hover:bg-gray-100'
                      : 'border-blue-300 text-blue-500 hover:bg-blue-100'
                  }`}
                >
                  {channel.is_followed ? 'Following' : 'Follow'}
                </button>

                <div className="mt-2 flex items-center text-md text-gray-500 sm:mt-0">
                  <p>Live: {channel.is_live ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
