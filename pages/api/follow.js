import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, channel_id } = req.body;

    const { error } = await supabase
      .from('followers')
      .insert([{ user_id, channel_id }]);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: 'Followed channel' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
