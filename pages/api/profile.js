import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, username, notification_preferences } = req.body;

    const { error } = await supabase
      .from('profiles')
      .update({ username, notification_preferences })
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: 'Profile updated' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
