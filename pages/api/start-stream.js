import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { channel_id, is_live } = req.body;

    const { error } = await supabase
      .from('channels')
      .update({ is_live })
      .eq('id', channel_id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: 'Stream status updated' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
