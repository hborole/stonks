import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '../../../lib/supabase';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (!data) {
        const { error } = await supabase.from('profiles').insert([{ email }]);
        if (error) throw new Error(error.message);
      }

      return true;
    },
    async session({ session, token }) {
      const { email } = session.user;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      session.user.id = data.id;
      session.user.username = data.username;
      session.user.notification_preferences = data.notification_preferences;
      return session;
    },
  },
});
