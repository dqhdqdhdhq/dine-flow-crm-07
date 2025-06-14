
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Truck, Calendar } from 'lucide-react';
import { PurchaseOrder } from '@/types';

interface UpcomingDeliveriesCardProps {
  deliveries: PurchaseOrder[];
}

const UpcomingDeliveriesCard: React.FC<UpcomingDeliveriesCardProps> = ({ deliveries }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="h-5 w-5 text-primary" />
          Upcoming Deliveries
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deliveries.length > 0 ? (
          <div className="space-y-4">
            {deliveries.slice(0, 3).map((order) => ( // Show top 3
              <div key={order.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">PO-{order.id}</p>
                  <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(order.expectedDeliveryDate), "MMM d, yyyy")}
                  </div>
                </div>
                <Badge variant={order.status === 'shipped' ? 'default' : 'secondary'} className="capitalize">
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No upcoming deliveries</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeliveriesCard;
