import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query; // Get the channel ID from the query parameters

  try {
    // Fetch the channel information
    const { data: channelData, error: channelError } = await supabase
      .from('channels')
      .select('*')
      .eq('id', id)
      .single();

    if (channelError) {
      throw channelError;
    }

    if (!channelData) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    return res.status(200).json({
      channel: channelData,
    });
  } catch (error) {
    console.error('Fetch channel error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
