import { supabase } from '../../lib/supabase';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { channel_id } = req.body;

    const { data: followers, error } = await supabase
      .from('followers')
      .select('user_id')
      .eq('channel_id', channel_id);

    if (error) return res.status(400).json({ error: error.message });

    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select('name')
      .eq('id', channel_id)
      .single();

    if (channelError)
      return res.status(400).json({ error: channelError.message });

    for (const follower of followers) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', follower.user_id)
        .single();

      if (profileError)
        return res.status(400).json({ error: profileError.message });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: profile.email,
        subject: `${channel.name} is live!`,
        text: `Hey, ${channel.name} has just started streaming. Join now!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email: ${error}`);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    }

    return res.status(200).json({ message: 'Notifications sent' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
