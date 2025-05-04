
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Feedback, FeedbackType } from '@/types';
import { 
  Star, 
  Search, 
  Calendar 
} from 'lucide-react';
import { mockCustomers } from '@/data/mockData';

interface FeedbackEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feedback: Feedback) => void;
}

export const FeedbackEntryForm: React.FC<FeedbackEntryFormProps> = ({ 
  isOpen, 
  onClose,
  onSave
}) => {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('positive');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [requireFollowUp, setRequireFollowUp] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  
  const filteredCustomers = customerSearch
    ? mockCustomers.filter(customer => 
        `${customer.firstName} ${customer.lastName}`
          .toLowerCase()
          .includes(customerSearch.toLowerCase())
      )
    : [];
  
  const handleSelectCustomer = (customerId: string, name: string) => {
    setSelectedCustomerId(customerId);
    setManualCustomerName(name);
    setShowCustomerSearch(false);
  };
  
  const resetForm = () => {
    setSelectedCustomerId(null);
    setManualCustomerName('');
    setFeedbackType('positive');
    setRating(5);
    setContent('');
    setRequireFollowUp(false);
    setShowCustomerSearch(false);
    setCustomerSearch('');
  };
  
  const handleSubmit = () => {
    // Create new feedback object
    const newFeedback: Feedback = {
      id: uuidv4(),
      customerId: selectedCustomerId || uuidv4(),
      customerName: manualCustomerName,
      type: feedbackType,
      rating,
      content,
      createdAt: new Date().toISOString(),
      followUpRequired: requireFollowUp,
      followUpDone: false,
      followUpNotes: '',
      assignedTo: ''
    };
    
    // Call the save function
    onSave(newFeedback);
    
    // Reset form and close dialog
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Log New Feedback</DialogTitle>
          <DialogDescription>
            Record customer feedback collected in-person or from review platforms
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="customer">Customer Name</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => setShowCustomerSearch(!showCustomerSearch)}
              >
                {showCustomerSearch ? "Enter manually" : "Search customers"}
              </Button>
            </div>
            
            {showCustomerSearch ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
                
                {customerSearch && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-muted transition-colors border-b last:border-0 flex justify-between items-center"
                          onClick={() => handleSelectCustomer(
                            customer.id, 
                            `${customer.firstName} ${customer.lastName}`
                          )}
                        >
                          <span>{customer.firstName} {customer.lastName}</span>
                          <span className="text-xs text-muted-foreground">
                            {customer.visits} visits
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">
                        No customers found
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Input
                id="customer"
                placeholder="Enter customer name"
                value={manualCustomerName}
                onChange={(e) => setManualCustomerName(e.target.value)}
                required
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Feedback Type</Label>
              <Select 
                value={feedbackType} 
                onValueChange={(value) => setFeedbackType(value as FeedbackType)}
              >
                <SelectTrigger id="feedback-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select 
                value={rating.toString()} 
                onValueChange={(value) => setRating(parseInt(value, 10))}
              >
                <SelectTrigger id="rating">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Stars ⭐⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="4">4 Stars ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="3">3 Stars ⭐⭐⭐</SelectItem>
                  <SelectItem value="2">2 Stars ⭐⭐</SelectItem>
                  <SelectItem value="1">1 Star ⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback-content">Feedback Content</Label>
            <Textarea
              id="feedback-content"
              placeholder="Enter customer's feedback..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="require-followup" 
              checked={requireFollowUp}
              onCheckedChange={() => setRequireFollowUp(!requireFollowUp)} 
            />
            <label
              htmlFor="require-followup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This feedback requires follow-up
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!manualCustomerName || !content}
          >
            Save Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
