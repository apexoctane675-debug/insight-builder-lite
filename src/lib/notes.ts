import { Note, CreateNoteData, UpdateNoteData } from '@/types/notes';
import { AuthService } from './auth';

const NOTES_STORAGE_KEY = 'smartstudy_notes';

export class NotesService {
  static getNotes(): Note[] {
    const user = AuthService.getCurrentUser();
    if (!user) return [];
    
    const notesData = localStorage.getItem(NOTES_STORAGE_KEY);
    try {
      const allNotes = notesData ? JSON.parse(notesData) : [];
      return allNotes.filter((note: Note) => note.userId === user.id);
    } catch {
      return [];
    }
  }

  static getNote(id: string): Note | null {
    const notes = this.getNotes();
    return notes.find(note => note.id === id) || null;
  }

  static createNote(data: CreateNoteData): Note {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const note: Note = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const allNotes = this.getAllNotes();
    allNotes.push(note);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
    
    return note;
  }

  static updateNote(id: string, data: UpdateNoteData): Note {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const allNotes = this.getAllNotes();
    const noteIndex = allNotes.findIndex(note => note.id === id && note.userId === user.id);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    const updatedNote = {
      ...allNotes[noteIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    allNotes[noteIndex] = updatedNote;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
    
    return updatedNote;
  }

  static deleteNote(id: string): void {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const allNotes = this.getAllNotes();
    const filteredNotes = allNotes.filter(note => !(note.id === id && note.userId === user.id));
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
  }

  private static getAllNotes(): Note[] {
    const notesData = localStorage.getItem(NOTES_STORAGE_KEY);
    try {
      return notesData ? JSON.parse(notesData) : [];
    } catch {
      return [];
    }
  }
}