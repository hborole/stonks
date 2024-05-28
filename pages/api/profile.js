import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // GET request to check username availability or fetch profile details
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
      // POST request to create or update a profile
      const {
        user,
        username: newUsername,
        email,
        notificationPreferences,
      } = req.body;

      const { data, error } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          username: newUsername,
          email,
          notification_preferences: notificationPreferences,
        },
        {
          returning: 'minimal',
        }
      );

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Profile updated successfully.' });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
