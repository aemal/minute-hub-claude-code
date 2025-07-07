import { supabase } from './supabase';
import type { Database } from './supabase';

export type Meeting = Database['public']['Tables']['meetings']['Row'];

export const meetingsService = {
  async getMeetings(page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from('meetings')
      .select('*', { count: 'exact' })
      .order('meeting_date', { ascending: false })
      .range(start, end);

    return { data, error, count };
  },

  async getMeetingById(id: string) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  async createMeeting(meeting: Omit<Meeting, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('meetings')
      .insert([meeting])
      .select()
      .single();

    return { data, error };
  },
};