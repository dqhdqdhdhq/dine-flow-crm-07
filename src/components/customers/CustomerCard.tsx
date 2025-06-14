
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';
import { Customer } from '@/types';

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

interface CustomerCardProps {
  customer: Customer;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const mainTag = customer.tags?.[0];
  const initials = `${customer.firstName[0]}${customer.lastName[0]}`;
  const hasAllergies = customer.allergies && customer.allergies.length > 0;

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
              <Badge variant="secondary" className={`mt-1 ${getBadgeStyle(mainTag)}`}>
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

export default CustomerCard;
