import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { user_id } = req.query;

  let query = supabase.from('channels').select('*');

  if (user_id) {
    query = query.neq('user_id', user_id);
  }

  let { data: channels, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (user_id) {
    const { data: followersData, error: followersError } = await supabase
      .from('followers')
      .select('channel_id')
      .eq('user_id', user_id);

    if (followersError) {
      return res.status(500).json({ error: followersError.message });
    }

    const followedChannelIds = followersData.map(
      (follower) => follower.channel_id
    );
    channels = channels.map((channel) => ({
      ...channel,
      is_followed: followedChannelIds.includes(channel.id),
    }));
  }

  res.status(200).json(channels);
}
