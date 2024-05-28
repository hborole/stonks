import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { channel_id, user_id, content } = req.body;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ channel_id, user_id, content }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
