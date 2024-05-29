import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';

const ChannelPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const fetchChannel = async () => {
    const channelResponse = await fetch(`/api/channels/get-channel?id=${id}`);
    const { channel: data } = await channelResponse.json();
    setChannel(data);

    if (data.is_live) {
      supabase
        .channel('messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            console.log('Change received!', payload.new);
            setMessages((messages) => [...messages, payload.new]);
          }
        )
        .subscribe();
    }
  };

  useEffect(() => {
    if (id) {
      fetchChannel();
    }
  }, [id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    await fetch('/api/messages/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        content: messageInput,
      }),
    });

    setMessageInput('');
  };

  if (!channel) {
    return (
      <Layout>
        <div>Loading channel information...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center">{channel.name}</h1>
      {channel.is_live ? (
        <div className="flex justify-between items-start">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1`}
            title="YouTube video player"
            allowFullScreen
            className="shadow-lg rounded-lg"
          ></iframe>
          <div className="w-80 ml-4">
            <div className="overflow-y-auto h-96 bg-white shadow-lg rounded-lg p-4">
              {messages &&
                messages?.map((msg, index) => (
                  <div key={index} className="mt-2 text-sm">
                    <strong>{msg.username}:</strong> {msg.content}
                  </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="mt-4">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-2 border rounded focus:outline-none focus:shadow-outline"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-center text-xl">
          This channel is not currently live.
        </p>
      )}
    </Layout>
  );
};

export default ChannelPage;
