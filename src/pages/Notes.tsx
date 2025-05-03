
import React, { useState } from 'react';
import { mockNotes } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Star, StarOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Note, NoteCategory } from '@/types';

const Notes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  
  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.updatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || note.category === categoryFilter;
    const matchesStarred = !showStarredOnly || note.isStarred;
    
    return matchesSearch && matchesCategory && matchesStarred;
  });
  
  const getCategoryBadge = (category: NoteCategory) => {
    switch (category) {
      case 'reservation':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Reservation</Badge>;
      case 'customer':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Customer</Badge>;
      case 'staff':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Staff</Badge>;
      case 'incident':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Incident</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Other</Badge>;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <Link to="/notes/new">
          <Button className="bg-brand hover:bg-brand-muted">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="reservation">Reservation</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="incident">Incident</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowStarredOnly(!showStarredOnly)}
        >
          {showStarredOnly ? (
            <>
              <StarOff className="h-4 w-4" />
              Show All
            </>
          ) : (
            <>
              <Star className="h-4 w-4 text-amber-400" />
              Starred Only
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              getCategoryBadge={getCategoryBadge} 
            />
          ))
        ) : (
          <p className="col-span-full text-center py-8 text-muted-foreground">
            No notes found matching your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  getCategoryBadge: (category: NoteCategory) => React.ReactNode;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, getCategoryBadge }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Link to={`/notes/${note.id}`}>
      <Card className="note-card h-full">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-lg flex-1 pr-2">{note.title}</CardTitle>
          {note.isStarred && (
            <Star className="h-4 w-4 text-amber-400 flex-shrink-0" />
          )}
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm line-clamp-3 text-gray-600">{note.content}</p>
        </CardContent>
        <CardFooter className="pt-4 flex flex-wrap justify-between gap-2 items-center">
          <div className="flex items-center gap-2">
            {getCategoryBadge(note.category)}
            {(note.customerId || note.reservationId) && (
              <Badge variant="outline">
                {note.customerId ? 'Customer' : 'Reservation'}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(note.createdAt)} by {note.updatedBy}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Notes;
