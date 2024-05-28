import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useAuth } from '@/context/AuthContext';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChannels = async () => {
      let fetchedChannels = [];
      if (!user) {
        const { data, error } = await supabase.from('channels').select('*');
        if (error) {
          console.error('Error fetching channels:', error);
        } else {
          fetchedChannels = data;
        }
      } else {
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .neq('user_id', user.id);
        if (error) {
          console.error('Error fetching channels:', error);
        } else {
          fetchedChannels = data;
        }
      }

      if (user) {
        const { data: followersData, error: followersError } = await supabase
          .from('followers')
          .select('channel_id')
          .eq('user_id', user.id);

        if (followersError) {
          console.error('Error fetching followers:', followersError);
        } else {
          const followedChannelIds = followersData.map(
            (follower) => follower.channel_id
          );
          fetchedChannels = fetchedChannels.map((channel) => ({
            ...channel,
            is_followed: followedChannelIds.includes(channel.id),
          }));
        }
      }

      setChannels(fetchedChannels);
      setLoading(false);
    };

    fetchChannels();
  }, [user]);

  const handleFollowToggle = async (channelId, isFollowed) => {
    if (!user) {
      console.error('User not signed in');
      return;
    }

    if (isFollowed) {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('user_id', user.id)
        .eq('channel_id', channelId);

      if (error) {
        console.error('Error unfollowing channel:', error.message);
      } else {
        setChannels((prevChannels) =>
          prevChannels.map((channel) =>
            channel.id === channelId
              ? { ...channel, is_followed: false }
              : channel
          )
        );
        console.log('Successfully unfollowed channel:', channelId);
      }
    } else {
      const { error } = await supabase.from('followers').insert({
        user_id: user.id,
        channel_id: channelId,
      });

      if (error) {
        console.error('Error following channel:', error.message);
      } else {
        setChannels((prevChannels) =>
          prevChannels.map((channel) =>
            channel.id === channelId
              ? { ...channel, is_followed: true }
              : channel
          )
        );
        console.log('Successfully followed channel:', channelId);
      }
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
              <div className="flex items-center flex-col">
                <button
                  onClick={() =>
                    handleFollowToggle(channel.id, channel.is_followed)
                  }
                  className={`mb-2 px-2 py-1 border text-md rounded ${
                    channel.is_followed
                      ? 'border-gray-300 text-gray-500 hover:bg-gray-100'
                      : 'border-blue-500 text-blue-500 hover:bg-blue-100'
                  }`}
                >
                  {channel.is_followed ? 'Following' : 'Follow'}
                </button>
                <div className="text-md flex items-center text-sm text-gray-500 sm:mt-0">
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
