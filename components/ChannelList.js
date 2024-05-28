import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase.from('channels').select('*');
      if (error) {
        console.error('Error fetching channels:', error);
      } else {
        setChannels(data);
      }
      setLoading(false);
    };

    fetchChannels();
  }, []);

  if (loading) {
    return <div>Loading channels...</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {channels.map((channel) => (
          <li key={channel.id} className="px-4 py-4 sm:px-6">
            <Link href={`/channel/${channel.id}`}>
              <a className="block hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-lg leading-6 font-medium text-indigo-600">
                    {channel.name}
                  </p>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {channel.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Live: {channel.is_live ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
