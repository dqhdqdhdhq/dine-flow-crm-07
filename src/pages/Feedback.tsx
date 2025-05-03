
import React, { useState } from 'react';
import { mockFeedback } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Star, Filter, CheckCircle, XCircle } from 'lucide-react';
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
import { Feedback, FeedbackType } from '@/types';

const FeedbackPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [followUpFilter, setFollowUpFilter] = useState<string>('');
  
  const filteredFeedback = mockFeedback.filter(fb => {
    const matchesSearch = 
      fb.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.followUpNotes && fb.followUpNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === '' || fb.type === typeFilter;
    
    const matchesFollowUp = 
      followUpFilter === '' || 
      (followUpFilter === 'required' && fb.followUpRequired) ||
      (followUpFilter === 'completed' && fb.followUpDone) ||
      (followUpFilter === 'pending' && fb.followUpRequired && !fb.followUpDone);
    
    return matchesSearch && matchesType && matchesFollowUp;
  });
  
  const getTypeBadge = (type: FeedbackType) => {
    switch (type) {
      case 'positive':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Positive</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Negative</Badge>;
      case 'suggestion':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Suggestion</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Other</Badge>;
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Customer Feedback</h1>
        <Link to="/feedback/new">
          <Button className="bg-brand hover:bg-brand-muted">
            <Plus className="mr-2 h-4 w-4" />
            New Feedback
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
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
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={followUpFilter} onValueChange={setFollowUpFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Follow-ups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Follow-ups</SelectItem>
              <SelectItem value="required">Required</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((feedback) => (
            <FeedbackCard 
              key={feedback.id} 
              feedback={feedback} 
              getTypeBadge={getTypeBadge}
              renderStars={renderStars}
            />
          ))
        ) : (
          <p className="col-span-full text-center py-8 text-muted-foreground">
            No feedback found matching your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

interface FeedbackCardProps {
  feedback: Feedback;
  getTypeBadge: (type: FeedbackType) => React.ReactNode;
  renderStars: (rating: number) => React.ReactNode;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ 
  feedback, 
  getTypeBadge,
  renderStars
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Link to={`/feedback/${feedback.id}`}>
      <Card className="h-full hover:shadow-md transition-all">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-lg">{feedback.customerName}</CardTitle>
            <div className="mt-1">{renderStars(feedback.rating)}</div>
          </div>
          {getTypeBadge(feedback.type)}
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm line-clamp-3 text-gray-600">{feedback.content}</p>
          {feedback.followUpNotes && (
            <div className="mt-2 p-2 bg-gray-50 rounded-sm text-xs">
              <p className="font-medium">Follow-up Notes:</p>
              <p className="text-gray-600 line-clamp-2">{feedback.followUpNotes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {formatDate(feedback.createdAt)}
          </div>
          <div>
            {feedback.followUpRequired && (
              <Badge 
                variant="outline" 
                className={feedback.followUpDone ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}
              >
                {feedback.followUpDone ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Resolved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    <span>Follow-up needed</span>
                  </div>
                )}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default FeedbackPage;
