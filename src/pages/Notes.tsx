
import React, { useState } from 'react';
import { mockNotes } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  StarOff, 
  Folder, 
  Tag as TagIcon,
  ListFilter,
  Bookmark,
  Layout,
  LayoutGrid,
  ChevronDown 
} from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note, NoteCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Sample folders for demo purposes
const folders = [
  { id: 'all', name: 'All Notes' },
  { id: 'shift-handovers', name: 'Shift Handovers' },
  { id: 'maintenance', name: 'Maintenance Issues' },
  { id: 'training', name: 'Staff Training' },
  { id: 'menu', name: 'Menu Updates' },
  { id: 'incidents', name: 'Incident Reports' }
];

// Sample custom tags for demo purposes
const customTags = [
  { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'followup', name: 'Follow-up Needed', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: '86ed', name: '86ed Item', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'vip', name: 'VIP', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'cleaning', name: 'Cleaning Task', color: 'bg-green-100 text-green-800 border-green-300' },
];

// Assign random folders and tags to notes for demo purposes
const enhancedMockNotes = mockNotes.map(note => ({
  ...note,
  folderId: folders[Math.floor(Math.random() * folders.length)].id,
  customTags: Array.from({ length: Math.floor(Math.random() * 3) }, () => 
    customTags[Math.floor(Math.random() * customTags.length)].id
  ),
  hasAttachment: Math.random() > 0.7,
  assignedTo: Math.random() > 0.7 ? 'John Smith' : null,
  comments: Math.floor(Math.random() * 5)
}));

const Notes: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  
  const filteredNotes = enhancedMockNotes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.updatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
    const matchesFolder = folderFilter === 'all' || note.folderId === folderFilter;
    const matchesTag = tagFilter === 'all' || (note.customTags && note.customTags.includes(tagFilter));
    const matchesStarred = !showStarredOnly || note.isStarred;
    
    return matchesSearch && matchesCategory && matchesFolder && matchesTag && matchesStarred;
  });

  // Sort notes based on the selected criteria
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
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

  const getCustomTagBadge = (tagId: string) => {
    const tag = customTags.find(t => t.id === tagId);
    if (!tag) return null;
    return <Badge className={`${tag.color} mr-1 mb-1`}>{tag.name}</Badge>;
  };
  
  const handleCreateNote = () => {
    toast({
      title: "Create Note",
      description: "Opening note editor...",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internal Logbook</h1>
          <p className="text-muted-foreground">Knowledge base and operational notes</p>
        </div>
        <Link to="/notes/new">
          <Button className="bg-brand hover:bg-brand-muted" onClick={handleCreateNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="starred">
            <Star className="h-4 w-4 mr-1 text-amber-400" />
            Starred
          </TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with folders and tags */}
          <div className="w-full md:w-64 space-y-6">
            <div className="bg-card border rounded-md p-4 space-y-4">
              <div>
                <h3 className="font-medium flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  Folders
                </h3>
                <ul className="mt-2 space-y-1">
                  {folders.map(folder => (
                    <li key={folder.id}>
                      <button 
                        className={`w-full text-left px-2 py-1 rounded-md text-sm ${folderFilter === folder.id ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
                        onClick={() => setFolderFilter(folder.id)}
                      >
                        {folder.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center">
                  <TagIcon className="h-4 w-4 mr-2" />
                  Tags
                </h3>
                <ul className="mt-2 space-y-1">
                  <li>
                    <button 
                      className={`w-full text-left px-2 py-1 rounded-md text-sm ${tagFilter === 'all' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
                      onClick={() => setTagFilter('all')}
                    >
                      All Tags
                    </button>
                  </li>
                  {customTags.map(tag => (
                    <li key={tag.id}>
                      <button 
                        className={`w-full text-left px-2 py-1 rounded-md text-sm flex items-center ${tagFilter === tag.id ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
                        onClick={() => setTagFilter(tag.id)}
                      >
                        <span className={`w-2 h-2 rounded-full ${tag.color.split(' ')[0]} mr-2`}></span>
                        {tag.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            <TabsContent value="all" className="space-y-4 mt-0">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative w-full max-w-sm">
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
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="reservation">Reservation</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ListFilter className="h-4 w-4" />
                        {sortBy === 'recent' ? 'Recent' : 'Alphabetical'}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy('recent')}>
                        Recent First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('title')}>
                        Alphabetical
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className={viewMode === 'list' ? 'bg-muted' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <Layout className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={viewMode === 'grid' ? 'bg-muted' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : 
                "space-y-4"
              }>
                {sortedNotes.length > 0 ? (
                  sortedNotes.map((note) => (
                    viewMode === 'grid' ? (
                      <NoteCard 
                        key={note.id} 
                        note={note} 
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    ) : (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    )
                  ))
                ) : (
                  <p className="col-span-full text-center py-8 text-muted-foreground">
                    No notes found matching your search criteria.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="starred" className="space-y-4 mt-0">
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : 
                "space-y-4"
              }>
                {enhancedMockNotes.filter(note => note.isStarred).length > 0 ? (
                  enhancedMockNotes.filter(note => note.isStarred).map((note) => (
                    viewMode === 'grid' ? (
                      <NoteCard 
                        key={note.id} 
                        note={note} 
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    ) : (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    )
                  ))
                ) : (
                  <p className="col-span-full text-center py-8 text-muted-foreground">
                    No starred notes found.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4 mt-0">
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : 
                "space-y-4"
              }>
                {enhancedMockNotes
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 6)
                  .map((note) => (
                    viewMode === 'grid' ? (
                      <NoteCard 
                        key={note.id} 
                        note={note} 
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    ) : (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    )
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="assigned" className="space-y-4 mt-0">
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : 
                "space-y-4"
              }>
                {enhancedMockNotes.filter(note => note.assignedTo === 'John Smith').length > 0 ? (
                  enhancedMockNotes.filter(note => note.assignedTo === 'John Smith').map((note) => (
                    viewMode === 'grid' ? (
                      <NoteCard 
                        key={note.id} 
                        note={note} 
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    ) : (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        getCategoryBadge={getCategoryBadge}
                        getCustomTagBadge={getCustomTagBadge}
                      />
                    )
                  ))
                ) : (
                  <p className="col-span-full text-center py-8 text-muted-foreground">
                    No notes assigned to you.
                  </p>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

interface NoteCardProps {
  note: any; // Using any for the enhanced mock notes
  getCategoryBadge: (category: NoteCategory) => React.ReactNode;
  getCustomTagBadge: (tagId: string) => React.ReactNode;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, getCategoryBadge, getCustomTagBadge }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Link to={`/notes/${note.id}`}>
      <Card className="note-card h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-lg flex-1 pr-2">{note.title}</CardTitle>
          {note.isStarred && (
            <Star className="h-4 w-4 text-amber-400 flex-shrink-0" />
          )}
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm line-clamp-3 text-gray-600">{note.content}</p>
          {note.customTags && note.customTags.length > 0 && (
            <div className="mt-3 flex flex-wrap">
              {note.customTags.map((tagId: string) => (
                <React.Fragment key={tagId}>
                  {getCustomTagBadge(tagId)}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 flex flex-wrap justify-between gap-2 items-center">
          <div className="flex items-center gap-2">
            {getCategoryBadge(note.category)}
            {note.comments > 0 && (
              <Badge variant="outline" className="text-xs">
                {note.comments} comments
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(note.createdAt)} • {note.updatedBy}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

const NoteListItem: React.FC<NoteCardProps> = ({ note, getCategoryBadge, getCustomTagBadge }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Link to={`/notes/${note.id}`}>
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium">{note.title}</h3>
              {note.isStarred && <Star className="h-4 w-4 ml-2 text-amber-400" />}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{note.content}</p>
            
            <div className="flex items-center mt-3 gap-2 flex-wrap">
              {getCategoryBadge(note.category)}
              {note.customTags && note.customTags.map((tagId: string) => (
                <React.Fragment key={tagId}>{getCustomTagBadge(tagId)}</React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-right text-muted-foreground">
            {formatDate(note.createdAt)}
            <div className="mt-1">{note.updatedBy}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Notes;
