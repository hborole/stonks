import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { supabase } from '../lib/supabase';

const MyChannel = () => {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }

    const messageSubscription = isStreaming ? subscribeToMessages() : null;
  }, [user, isStreaming]);

  const fetchUserProfile = async () => {
    const response = await fetch(`/api/profiles/profile?user_id=${user.id}`);
    const data = await response.json();
    if (data.username) {
      setUsername(data.username);
    }
  };

  const subscribeToMessages = () => {
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
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    await fetch('/api/messages/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        content: chatInput,
      }),
    });

    setChatInput('');
  };

  const handleToggleStreaming = async () => {
    const newStreamingState = !isStreaming;
    setIsStreaming(newStreamingState);
    await fetch(`/api/streams/toggle-stream`, {
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
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Welcome to your channel, {username || user.email}
        </h1>
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={handleToggleStreaming}
            className={`${
              isStreaming ? 'bg-blue-400' : 'bg-green-400'
            } text-white px-4 py-2 rounded`}
          >
            {isStreaming ? 'Stop' : 'Start'} Streaming
          </button>
        </div>
        <div className="flex justify-between items-start">
          {isStreaming && (
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=${
                isStreaming ? '1' : '0'
              }`}
              title="YouTube video player"
              allowFullScreen
              className="shadow-lg rounded-lg"
            ></iframe>
          )}
          {isStreaming && (
            <div className="w-80 ml-4">
              <div className="overflow-y-auto h-96 bg-white shadow-lg rounded-lg p-4">
                {messages.length > 0 &&
                  messages.map((msg, index) => (
                    <div key={index} className="mt-2 text-sm">
                      <strong>{msg?.username || 'Anonymous'}:</strong>{' '}
                      {msg?.content}
                    </div>
                  ))}
              </div>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="mt-2 w-full p-2 border rounded"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyChannel;
