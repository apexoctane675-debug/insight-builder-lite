import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotesService } from '@/lib/notes';
import { Note } from '@/types/notes';
import { useToast } from '@/hooks/use-toast';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const userNotes = await NotesService.getNotes();
      setNotes(userNotes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await NotesService.deleteNote(id);
      await loadNotes();
      toast({
        title: "Note deleted",
        description: "Your note has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              My Notes
            </h1>
            <p className="text-muted-foreground mt-2">
              Organize your thoughts and study materials
            </p>
          </div>
          
          <Button 
            variant="hero"
            size="lg"
            onClick={() => navigate('/notes/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Note
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started with your studies'
              }
            </p>
            {!searchQuery && (
              <Button 
                variant="hero"
                onClick={() => navigate('/notes/create')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card 
                key={note.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-medium hover:scale-105 border-0 shadow-soft bg-gradient-card"
              >
                <CardHeader 
                  className="pb-3"
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {note.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Updated {formatDate(note.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent 
                  className="pt-0"
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {note.content || 'No content'}
                  </p>
                  
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/notes/${note.id}/edit`);
                      }}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;