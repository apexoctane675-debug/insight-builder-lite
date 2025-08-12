import { supabase } from '@/integrations/supabase/client';
import { Note, CreateNoteData, UpdateNoteData } from '@/types/notes';

export class NotesService {
  static async getNotes(): Promise<Note[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    return data.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content || '',
      userId: note.user_id,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    }));
  }

  static async getNote(id: string): Promise<Note | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content || '',
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async createNote(noteData: CreateNoteData): Promise<Note> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: noteData.title,
        content: noteData.content,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content || '',
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async updateNote(id: string, noteData: UpdateNoteData): Promise<Note> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .update({
        title: noteData.title,
        content: noteData.content,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content || '',
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async deleteNote(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }
}