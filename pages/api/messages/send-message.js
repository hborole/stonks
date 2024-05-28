import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, content } = req.body;

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user_id)
      .single();

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    const { username } = user;
    console.log('username:', username);

    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select('id')
      .eq('user_id', user_id)
      .single();

    if (channelError) {
      return res.status(500).json({ error: channelError.message });
    }

    const { id: channel_id } = channel;
    console.log('channel_id:', channel_id);

    // Insert the message into the database
    const { data, error } = await supabase.from('messages').insert({
      user_id,
      channel_id,
      username,
      content,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Message sent successfully', data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
