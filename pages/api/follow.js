import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { user_id, channel_id } = req.body;

  if (req.method === 'POST') {
    // Follow a channel
    const { error } = await supabase
      .from('followers')
      .insert({ user_id, channel_id });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res
      .status(200)
      .json({ message: 'Successfully followed the channel' });
  } else if (req.method === 'DELETE') {
    // Unfollow a channel
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('user_id', user_id)
      .eq('channel_id', channel_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res
      .status(200)
      .json({ message: 'Successfully unfollowed the channel' });
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
