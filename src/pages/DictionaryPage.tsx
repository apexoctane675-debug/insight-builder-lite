import React, { useState } from 'react';
import { Search, Volume2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';

interface Phonetic {
  text?: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryEntry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

const DictionaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchWord = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a word",
        description: "Type a word to search for its definition.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm.trim()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Word not found. Please check the spelling and try again.');
        }
        throw new Error('Failed to fetch definition. Please try again.');
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Definition found!",
        description: `Found definition for "${searchTerm}"`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const playPronunciation = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      toast({
        title: "Audio not available",
        description: "Unable to play pronunciation audio.",
        variant: "destructive",
      });
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchWord();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-green-400 flex items-center justify-center shadow-medium">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Word Lookup</h1>
          <p className="text-muted-foreground text-lg">
            Search and learn new words with definitions, pronunciations, and examples
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-center">Dictionary Search</CardTitle>
              <CardDescription className="text-center">
                Enter a word to get its definition, pronunciation, and examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter a word to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={loading}
                />
                <Button 
                  onClick={searchWord} 
                  disabled={loading}
                  className="px-6"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {!loading && <span className="ml-2">Search</span>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p className="font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6">
            {results.map((entry, entryIndex) => (
              <Card key={entryIndex} className="border-0 shadow-soft bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold text-primary">
                        {entry.word}
                      </CardTitle>
                      
                      {/* Pronunciation */}
                      <div className="flex items-center gap-4 mt-2">
                        {entry.phonetics.map((phonetic, phoneticIndex) => (
                          <div key={phoneticIndex} className="flex items-center gap-2">
                            {phonetic.text && (
                              <span className="text-muted-foreground font-mono text-lg">
                                {phonetic.text}
                              </span>
                            )}
                            {phonetic.audio && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => playPronunciation(phonetic.audio!)}
                                className="h-8 w-8 p-0"
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )).filter(Boolean)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Meanings */}
                  {entry.meanings.map((meaning, meaningIndex) => (
                    <div key={meaningIndex} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm font-medium">
                          {meaning.partOfSpeech}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {meaning.definitions.map((definition, defIndex) => (
                          <div key={defIndex} className="bg-muted/30 rounded-lg p-4 space-y-2">
                            <p className="text-foreground leading-relaxed">
                              <span className="font-medium">Definition:</span> {definition.definition}
                            </p>
                            
                            {definition.example && (
                              <p className="text-muted-foreground italic">
                                <span className="font-medium not-italic">Example:</span> "{definition.example}"
                              </p>
                            )}
                            
                            {definition.synonyms && definition.synonyms.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium">Synonyms:</span>
                                {definition.synonyms.slice(0, 5).map((synonym, synIndex) => (
                                  <Badge key={synIndex} variant="outline" className="text-xs">
                                    {synonym}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to search</h3>
            <p className="text-muted-foreground">
              Enter a word in the search box above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryPage;