import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRealtime } from '@/context/RealtimeContext';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const NewReservation: React.FC = () => {
  const navigate = useNavigate();
  const { reservations, updateReservation } = useRealtime();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('18:00');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [partySize, setPartySize] = useState<string>('2');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!customerName) {
      toast.error('Please enter a customer name');
      return;
    }
    
    // Create new reservation
    const newReservation = {
      id: `res-${Date.now()}`,
      customerId: `cust-${Date.now()}`, // Adding required customerId
      customerName,
      date: format(date, 'yyyy-MM-dd'),
      time,
      partySize: parseInt(partySize),
      phone,
      email,
      notes,
      specialRequests: notes, // Using notes as specialRequests
      status: 'confirmed' as const,
      tableIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() // Adding required updatedAt
    };
    
    // Add to reservations
    updateReservation(newReservation);
    
    // Show success message
    toast.success('Reservation created successfully');
    
    // Navigate back to reservations
    navigate('/reservations');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Reservation</h1>
      </div>
      
      <Separator />
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Customer Details</h2>
            
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          {/* Reservation Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reservation Details</h2>
            
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <select
                id="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                {Array.from({ length: 16 }, (_, i) => {
                  const hour = Math.floor(i / 2) + 11;
                  const minute = i % 2 === 0 ? '00' : '30';
                  const timeString = `${hour}:${minute}`;
                  const displayHour = hour > 12 ? hour - 12 : hour;
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  return (
                    <option key={timeString} value={timeString}>
                      {`${displayHour}:${minute} ${ampm}`}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partySize">Party Size *</Label>
              <select
                id="partySize"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Special Requests / Notes</Label>
          <textarea
            id="notes"
            className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter any special requests or notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => navigate('/reservations')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-brand hover:bg-brand-muted"
          >
            Create Reservation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewReservation;
