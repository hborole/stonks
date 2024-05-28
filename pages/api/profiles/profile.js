import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const { username, user_id } = req.query;
      if (user_id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user_id);

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        if (data.length > 0) {
          return res.status(200).json(data[0]);
        } else {
          return res.status(404).json({ message: 'Profile not found.' });
        }
      }

      if (username) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username);

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ isAvailable: data.length === 0 });
      } else {
        return res
          .status(400)
          .json({ message: 'Username parameter is missing.' });
      }

    case 'POST':
      // POST request to create or update a profile along with a channel
      const {
        user,
        username: newUsername,
        firstName,
        lastName,
        email,
        notificationPreferences,
        channelName,
        description,
      } = req.body;

      try {
        const { data: channelData, error: channelError } = await supabase
          .from('channels')
          .insert({
            name: channelName,
            description: description,
            user_id: user.id,
          });

        if (channelError) throw channelError;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              username: newUsername,
              email,
              notification_preferences: notificationPreferences,
              channel_name: channelName,
            },
            {
              returning: 'minimal',
            }
          );

        // Add channel id to the profile
        const { data: profileChannelData, error: profileChannelError } =
          await supabase
            .from('profiles')
            .update({ channel_id: channelData[0].id })
            .eq('id', user.id);

        if (profileError) throw profileError;

        return res
          .status(200)
          .json({ message: 'Profile and channel created successfully.' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
