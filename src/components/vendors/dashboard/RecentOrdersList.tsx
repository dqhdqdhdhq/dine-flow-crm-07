
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, ChevronsRight } from 'lucide-react';
import { PurchaseOrder } from '@/types';

interface RecentOrdersListProps {
  orders: PurchaseOrder[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'received': return 'success';
    case 'partially-received': return 'warning';
    case 'cancelled': return 'destructive';
    case 'shipped': return 'default';
    default: return 'secondary';
  }
};

const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ orders }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Order History</CardTitle>
        <CardDescription>A detailed timeline of the latest purchase orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.slice(0, 5).map((order) => ( // Show latest 5
              <div key={order.id} className="relative pl-8">
                <div className="absolute left-0 top-1 h-full w-px bg-border -translate-x-px"></div>
                <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-primary -translate-x-[5px]"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">PO-{order.id}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(order.orderDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>Due by {format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                      {order.status.replace('-', ' ')}
                    </Badge>
                    <span className="font-bold text-base">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-3 border-l-2 border-dashed border-border/80 pl-4 space-y-1 text-sm">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-muted-foreground">
                      <div className="flex items-center gap-2">
                         <ChevronsRight className="h-3 w-3 text-primary/50" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs">{item.quantity} {item.unit} @ ${item.unitPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No order history to display</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersList;
