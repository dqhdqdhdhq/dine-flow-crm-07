import React, { useState } from 'react';
import { mockFeedback, mockUsers } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Star, 
  Filter, 
  CheckCircle, 
  XCircle,
  BarChart2,
  Calendar,
  User as UserIcon,
  MessageSquare,
  FileText,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Feedback, FeedbackType, User } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { FeedbackDetails } from '@/components/feedback/FeedbackDetails';
import { FeedbackCard } from '@/components/feedback/FeedbackCard';
import { FeedbackStats } from '@/components/feedback/FeedbackStats';
import { FeedbackEntryForm } from '@/components/feedback/FeedbackEntryForm';

const FeedbackHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [followUpFilter, setFollowUpFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date>();
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<'list' | 'stats'>('list');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);

  // Derive the selected feedback object if an ID is selected
  const selectedFeedback = selectedFeedbackId 
    ? mockFeedback.find(fb => fb.id === selectedFeedbackId) 
    : null;
  
  const filteredFeedback = mockFeedback.filter(fb => {
    const matchesSearch = 
      fb.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.followUpNotes && fb.followUpNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || fb.type === typeFilter;
    
    const matchesFollowUp = 
      followUpFilter === 'all' || 
      (followUpFilter === 'required' && fb.followUpRequired) ||
      (followUpFilter === 'completed' && fb.followUpDone) ||
      (followUpFilter === 'pending' && fb.followUpRequired && !fb.followUpDone);
    
    // Date filtering logic
    const matchesDate = !dateFilter || 
      new Date(fb.createdAt).toDateString() === dateFilter.toDateString();
    
    // Rating filtering
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '5' && fb.rating === 5) ||
      (ratingFilter === '4' && fb.rating === 4) ||
      (ratingFilter === '3' && fb.rating === 3) ||
      (ratingFilter === '2' && fb.rating === 2) ||
      (ratingFilter === '1' && fb.rating === 1);

    // Source filtering (this is a placeholder as we don't have source in the data model yet)
    const matchesSource = sourceFilter === 'all';
    
    return matchesSearch && matchesType && matchesFollowUp && 
           matchesDate && matchesRating && matchesSource;
  });

  // Calculate feedback statistics
  const totalFeedback = filteredFeedback.length;
  const averageRating = filteredFeedback.length > 0 
    ? filteredFeedback.reduce((sum, fb) => sum + fb.rating, 0) / filteredFeedback.length 
    : 0;
  const positiveFeedback = filteredFeedback.filter(fb => fb.type === 'positive').length;
  const negativeFeedback = filteredFeedback.filter(fb => fb.type === 'negative').length;
  const suggestionFeedback = filteredFeedback.filter(fb => fb.type === 'suggestion').length;
  const requireFollowUp = filteredFeedback.filter(fb => fb.followUpRequired && !fb.followUpDone).length;
  
  const handleNewFeedbackFormOpen = () => {
    setIsEntryFormOpen(true);
  };

  const handleFeedbackClick = (id: string) => {
    setSelectedFeedbackId(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest Experience Hub</h1>
          <p className="text-muted-foreground mt-1">
            Centralized feedback management and analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setActiveView(activeView === 'list' ? 'stats' : 'list')}
          >
            {activeView === 'list' ? <BarChart2 className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            {activeView === 'list' ? 'View Stats' : 'View List'}
          </Button>
          <Button 
            className="bg-brand hover:bg-brand-muted"
            onClick={handleNewFeedbackFormOpen}
          >
            <Plus className="mr-2 h-4 w-4" />
            Log Feedback
          </Button>
        </div>
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="requires-action">Requires Action</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {/* Filter section */}
          <div className="bg-card border rounded-md p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Filter Feedback</h3>
              <p className="text-sm text-muted-foreground">Refine results based on multiple criteria</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 flex-wrap">
              {/* Search input */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search feedback..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Type filter */}
              <div className="flex gap-2 items-center">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Follow-up filter */}
              <div className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <Select value={followUpFilter} onValueChange={setFollowUpFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Follow-ups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Follow-ups</SelectItem>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating filter */}
              <div className="flex gap-2 items-center">
                <Star className="h-4 w-4 text-muted-foreground" />
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date filter */}
              <div className="flex gap-2 items-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                    {dateFilter && (
                      <div className="p-3 border-t">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-center"
                          onClick={() => setDateFilter(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          {activeView === 'stats' ? (
            <FeedbackStats 
              totalFeedback={totalFeedback}
              averageRating={averageRating}
              positiveFeedback={positiveFeedback}
              negativeFeedback={negativeFeedback}
              suggestionFeedback={suggestionFeedback}
              requireFollowUp={requireFollowUp}
              filteredFeedback={filteredFeedback}
            />
          ) : selectedFeedback ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FeedbackDetails 
                  feedback={selectedFeedback} 
                  onClose={() => setSelectedFeedbackId(null)}
                  users={mockUsers}
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto">
                      {filteredFeedback.slice(0, 5).map(feedback => (
                        <button 
                          key={feedback.id}
                          onClick={() => setSelectedFeedbackId(feedback.id)}
                          className={cn(
                            "w-full text-left p-3 hover:bg-muted transition-colors border-b last:border-0",
                            selectedFeedback.id === feedback.id && "bg-muted"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{feedback.customerName}</p>
                              <p className="text-sm text-muted-foreground truncate">{feedback.content.substring(0, 60)}...</p>
                            </div>
                            <div className="flex text-amber-400">
                              {Array.from({ length: feedback.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={handleNewFeedbackFormOpen}>
                        <Plus className="mr-2 h-4 w-4" />
                        Log New Feedback
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <UserIcon className="mr-2 h-4 w-4" />
                        View Customer Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map((feedback) => (
                    <div 
                      key={feedback.id} 
                      onClick={() => handleFeedbackClick(feedback.id)}
                      className="cursor-pointer"
                    >
                      <FeedbackCard feedback={feedback} />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center py-8 text-muted-foreground">
                    No feedback found matching your search criteria.
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="requires-action">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFeedback
              .filter(fb => fb.followUpRequired && !fb.followUpDone)
              .map((feedback) => (
                <div 
                  key={feedback.id} 
                  onClick={() => handleFeedbackClick(feedback.id)}
                  className="cursor-pointer"
                >
                  <FeedbackCard feedback={feedback} />
                </div>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="resolved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFeedback
              .filter(fb => fb.followUpRequired && fb.followUpDone)
              .map((feedback) => (
                <div 
                  key={feedback.id} 
                  onClick={() => handleFeedbackClick(feedback.id)}
                  className="cursor-pointer"
                >
                  <FeedbackCard feedback={feedback} />
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Feedback Entry Form Dialog */}
      <FeedbackEntryForm 
        isOpen={isEntryFormOpen} 
        onClose={() => setIsEntryFormOpen(false)} 
      />
    </div>
  );
};

export default FeedbackHub;
