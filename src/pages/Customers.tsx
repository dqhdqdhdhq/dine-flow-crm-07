import React, { useState } from 'react';
import { mockCustomers } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, SlidersHorizontal, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Customer } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastVisit');
  const [hasAllergies, setHasAllergies] = useState<boolean | null>(null);
  
  // Get unique tags from all customers
  const allTags = Array.from(
    new Set(mockCustomers.flatMap(customer => customer.tags))
  ).sort();
  
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.preferences.some(pref => pref.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customer.allergies.some(allergy => allergy.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = tagFilter === 'all' || customer.tags.includes(tagFilter);
    
    const matchesAllergies = 
      hasAllergies === null || 
      (hasAllergies === true && customer.allergies.length > 0) ||
      (hasAllergies === false && customer.allergies.length === 0);
    
    return matchesSearch && matchesTag && matchesAllergies;
  });
  
  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case 'visits':
        return b.visits - a.visits; // Most visits first
      case 'lastVisit':
        // Handle null last visits
        if (!a.lastVisit) return 1;
        if (!b.lastVisit) return -1;
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime(); // Most recent first
      case 'loyaltyPoints':
        return b.loyaltyPoints - a.loyaltyPoints; // Most points first
      default:
        return 0;
    }
  });
  
  const getBadgeStyle = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vip':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'regular':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'new customer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Link to="/customers/new">
          <Button className="bg-brand hover:bg-brand-muted">
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter & Sort
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Sort By</h4>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lastVisit">Recent Visit</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="visits">Most Visits</SelectItem>
                        <SelectItem value="loyaltyPoints">Loyalty Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Filter by Tag</h4>
                    <Select value={tagFilter} onValueChange={setTagFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Tags" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tags</SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Dietary Restrictions</h4>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant={hasAllergies === true ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setHasAllergies(hasAllergies === true ? null : true)}
                      >
                        Has Allergies
                      </Button>
                      <Button 
                        variant={hasAllergies === false ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setHasAllergies(hasAllergies === false ? null : false)}
                      >
                        No Allergies
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
            </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedCustomers.length > 0 ? (
          sortedCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} badgeStyle={getBadgeStyle} />
          ))
        ) : (
          <p className="col-span-full text-center py-8 text-muted-foreground">
            No customers found matching your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

interface CustomerCardProps {
  customer: Customer;
  badgeStyle: (tag: string) => string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, badgeStyle }) => {
  const mainTag = customer.tags[0];
  const initials = `${customer.firstName[0]}${customer.lastName[0]}`;
  const hasAllergies = customer.allergies.length > 0;

  return (
    <Link to={`/customers/${customer.id}`} className="block h-full">
      <Card className="customer-card h-full hover:shadow-lg transition-shadow duration-300 group bg-card">
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customer.avatarUrl} alt={`${customer.firstName} ${customer.lastName}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-base font-semibold truncate" title={`${customer.firstName} ${customer.lastName}`}>{customer.firstName} {customer.lastName}</h4>
            {mainTag && (
              <Badge variant="secondary" className={`mt-1 ${badgeStyle(mainTag)}`}>
                {mainTag}
              </Badge>
            )}
          </div>
          {hasAllergies && (
            <div title="This customer has allergies.">
              <Circle className="h-3 w-3 text-red-500 fill-red-500 flex-shrink-0" />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          <span>Last visit: {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Customers;
