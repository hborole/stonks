import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create a new channel
    const { userId, channelName, description } = req.body;

    const { data, error } = await supabase.from('channels').insert({
      user_id: userId,
      name: channelName,
      description,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(200)
      .json({ message: 'Channel created successfully.', channel: data });
  } else if (req.method === 'PUT') {
    // Update an existing channel
    const { channelId, channelName, description } = req.body;

    const { data, error } = await supabase
      .from('channels')
      .update({
        name: channelName,
        description,
      })
      .match({
        id: channelId,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(200)
      .json({ message: 'Channel updated successfully.', channel: data });
  } else {
    res.setHeader('Allow', ['POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
