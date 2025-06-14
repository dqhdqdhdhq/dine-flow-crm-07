
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Package, Truck, Calendar as CalendarIcon } from 'lucide-react';
import { PurchaseOrder } from '@/types';

interface VendorCalendarProps {
  purchaseOrders?: PurchaseOrder[];
}

const VendorCalendar: React.FC<VendorCalendarProps> = ({ purchaseOrders = [] }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return purchaseOrders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const deliveryDate = new Date(order.expectedDeliveryDate);
      
      return isSameDay(orderDate, date) || isSameDay(deliveryDate, date);
    });
  };

  // Get all dates that have events
  const getDatesWithEvents = () => {
    const dates: Date[] = [];
    purchaseOrders.forEach(order => {
      dates.push(new Date(order.orderDate));
      dates.push(new Date(order.expectedDeliveryDate));
    });
    return dates;
  };

  const eventsForSelectedDate = getEventsForDate(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-yellow-100 text-yellow-800';
      case 'partially-received': return 'bg-orange-100 text-orange-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Purchase Order Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={{
                hasEvents: getDatesWithEvents(),
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: 'rgb(99 102 241)',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              Events for {format(selectedDate, 'MMM dd, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events for this date</p>
            ) : (
              <div className="space-y-3">
                {eventsForSelectedDate.map(order => {
                  const orderDate = new Date(order.orderDate);
                  const deliveryDate = new Date(order.expectedDeliveryDate);
                  const isOrderDate = isSameDay(orderDate, selectedDate);
                  const isDeliveryDate = isSameDay(deliveryDate, selectedDate);

                  return (
                    <div key={order.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{order.supplierName}</h4>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {isOrderDate && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Package className="h-4 w-4" />
                            Order placed
                          </div>
                        )}
                        {isDeliveryDate && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Truck className="h-4 w-4" />
                            Expected delivery
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorCalendar;
