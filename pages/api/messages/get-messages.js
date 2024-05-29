import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get the channel_id from the URL parameters
    const { channel_id } = req.query;

    // Check if channel_id is provided
    if (!channel_id) {
      return res.status(400).json({ error: 'Channel ID is required' });
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channel_id);

      if (error) {
        throw error;
      }

      // If no messages found, return an empty array
      if (data.length === 0) {
        return res.status(404).json({ messages: [] });
      }

      return res.status(200).json({ messages: data });
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Allow only GET requests
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
