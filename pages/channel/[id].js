import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import ChatBox from '../../components/ChatBox';

export async function getServerSideProps(context) {
  const { id } = context.params;
  const { data: channel } = await supabase
    .from('channels')
    .select('*')
    .eq('id', id)
    .single();

  return {
    props: { channel },
  };
}

export default function Channel({ channel }) {
  const [isStreaming, setIsStreaming] = useState(channel.is_live);
  const router = useRouter();

  const handleStreamToggle = async () => {
    const newState = !isStreaming;
    setIsStreaming(newState);

    await fetch('/api/start-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel_id: channel.id, is_live: newState }),
    });

    if (newState) {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel_id: channel.id }),
      });
    }
  };

  return (
    <div>
      <h1>Channel: {channel.name}</h1>
      <button onClick={handleStreamToggle}>
        {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
      </button>
      {isStreaming && (
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/jfKfPfyJRdk"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      )}
      <ChatBox channelId={channel.id} />
    </div>
  );
}
