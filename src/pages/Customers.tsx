
import React, { useState } from 'react';
import { mockCustomers } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Customer } from '@/types';

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
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
  return (
    <Link to={`/customers/${customer.id}`}>
      <Card className="customer-card h-full">
        <CardHeader className="pb-2">
          <CardTitle>{customer.firstName} {customer.lastName}</CardTitle>
          <CardDescription>{customer.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pb-0">
          <p className="text-sm">{customer.phone}</p>
          <div className="flex flex-wrap gap-1">
            {customer.tags.map((tag, i) => (
              <Badge key={i} className={badgeStyle(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
          {customer.allergies.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-600">Allergies:</p>
              <p className="text-xs text-gray-600">{customer.allergies.join(', ')}</p>
            </div>
          )}
          {customer.preferences.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600">Preferences:</p>
              <p className="text-xs text-gray-600">{customer.preferences.join(', ')}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 flex justify-between">
          <div className="text-xs text-muted-foreground">
            {customer.visits} {customer.visits === 1 ? 'visit' : 'visits'}
          </div>
          <div className="text-xs text-muted-foreground">
            Last visit: {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Customers;
