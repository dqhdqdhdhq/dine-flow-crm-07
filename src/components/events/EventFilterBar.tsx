
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Calendar, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EventType, EventStatus } from '@/types';
import { eventTypes, eventStatuses } from '@/data/eventsData';

interface EventFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: EventType | 'all';
  setTypeFilter: (type: EventType | 'all') => void;
  statusFilter: EventStatus | 'all';
  setStatusFilter: (status: EventStatus | 'all') => void;
  dateRangeFilter: { from: Date | undefined; to: Date | undefined };
  setDateRangeFilter: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const EventFilterBar: React.FC<EventFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  dateRangeFilter,
  setDateRangeFilter
}) => {
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateRangeFilter({ from: undefined, to: undefined });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery !== '' || 
    typeFilter !== 'all' || 
    statusFilter !== 'all' || 
    dateRangeFilter.from !== undefined || 
    dateRangeFilter.to !== undefined;

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as EventType | 'all')}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.entries(eventTypes).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EventStatus | 'all')}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Event Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {Object.entries(eventStatuses).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left",
              (dateRangeFilter.from || dateRangeFilter.to) && "text-primary"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRangeFilter.from ? (
              dateRangeFilter.to ? (
                <>
                  {format(dateRangeFilter.from, "LLL dd")} -{" "}
                  {format(dateRangeFilter.to, "LLL dd")}
                </>
              ) : (
                format(dateRangeFilter.from, "LLL dd")
              )
            ) : (
              "Date Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRangeFilter.from}
            selected={{
              from: dateRangeFilter.from,
              to: dateRangeFilter.to
            }}
            onSelect={(range) => {
              setDateRangeFilter({
                from: range?.from,
                to: range?.to
              });
            }}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default EventFilterBar;
