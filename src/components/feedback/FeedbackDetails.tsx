
import React, { useState } from 'react';
import { Feedback, User } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  X, 
  Calendar,
  User as UserIcon,
  MessageSquare,
  Link
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FeedbackDetailsProps {
  feedback: Feedback;
  onClose: () => void;
  users: User[];
}

export const FeedbackDetails: React.FC<FeedbackDetailsProps> = ({ 
  feedback, 
  onClose,
  users
}) => {
  const [requiresFollowUp, setRequiresFollowUp] = useState(feedback.followUpRequired);
  const [followUpDone, setFollowUpDone] = useState(feedback.followUpDone);
  const [followUpNotes, setFollowUpNotes] = useState(feedback.followUpNotes);
  const [assignedTo, setAssignedTo] = useState<string>('');
  
  const handleFollowUpToggle = () => {
    setRequiresFollowUp(!requiresFollowUp);
    if (!requiresFollowUp) {
      setFollowUpDone(false);
    }
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would update the feedback in the database
    // For now, we just close the detail view
    onClose();
  };
  
  const getTypeBadge = () => {
    switch (feedback.type) {
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
            className={`h-5 w-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              Feedback from {feedback.customerName} 
              {getTypeBadge()}
            </CardTitle>
            <div className="mt-2">
              {renderStars(feedback.rating)}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> 
            {formatDate(feedback.createdAt)}
          </span>
          {feedback.reservationId && (
            <span className="flex items-center gap-1">
              <Link className="h-4 w-4" /> 
              Reservation #{feedback.reservationId.split('-')[1]}
            </span>
          )}
        </div>
        
        <div className="border rounded-md p-4 bg-slate-50">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Feedback Content</h3>
          <p className="text-base">{feedback.content}</p>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-3">Follow-up Management</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="requires-followup" 
                checked={requiresFollowUp} 
                onCheckedChange={handleFollowUpToggle}
              />
              <label 
                htmlFor="requires-followup" 
                className="font-medium cursor-pointer"
              >
                Requires Follow-up
              </label>
            </div>
            
            {requiresFollowUp && (
              <>
                <div>
                  <label className="text-sm font-medium">Assign to:</label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Follow-up Notes:</label>
                  <Textarea 
                    value={followUpNotes} 
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    placeholder="Enter notes about follow-up actions taken..."
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="followup-completed" 
                    checked={followUpDone} 
                    onCheckedChange={() => setFollowUpDone(!followUpDone)}
                  />
                  <label 
                    htmlFor="followup-completed" 
                    className="font-medium cursor-pointer"
                  >
                    Follow-up Completed
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            View Customer Profile
          </Button>
          {feedback.reservationId && (
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              View Reservation
            </Button>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <span className="text-sm text-muted-foreground">
          Feedback ID: {feedback.id}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
