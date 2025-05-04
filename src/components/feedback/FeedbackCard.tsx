
import React from 'react';
import { Feedback, FeedbackType } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Star } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
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
  );
};
