import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, is_live } = req.body;

    // Update the channel's is_live status
    const { data, error } = await supabase
      .from('channels')
      .update({ is_live })
      .match({ user_id: userId });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(200)
      .json({ message: 'Streaming status updated successfully', data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
