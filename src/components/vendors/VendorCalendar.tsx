import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { Package, Truck, Calendar as CalendarIcon, Plus, Edit } from 'lucide-react';
import { PurchaseOrder } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import VendorCalendarWeekView from './VendorCalendarWeekView';
import VendorCalendarDayView from './VendorCalendarDayView';

interface VendorCalendarProps {
  purchaseOrders?: PurchaseOrder[];
  onCreateOrderForDate: (date: Date) => void;
  onEditOrder: (order: PurchaseOrder) => void;
}

const VendorCalendar: React.FC<VendorCalendarProps> = ({ purchaseOrders = [], onCreateOrderForDate, onEditOrder }) => {
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

  const DayContentWithEvents = ({ date }: { date: Date }) => {
    const dayEvents = getEventsForDate(date);

    if (dayEvents.length === 0) {
      return <>{date.getDate()}</>;
    }

    const hasOrder = dayEvents.some(order => isSameDay(new Date(order.orderDate), date));
    const hasDelivery = dayEvents.some(order => isSameDay(new Date(order.expectedDeliveryDate), date));

    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="relative w-full h-full flex items-center justify-center">
            {date.getDate()}
            {(hasOrder || hasDelivery) && (
              <div className="absolute bottom-1.5 flex items-center justify-center w-full">
                <div className="flex space-x-1">
                  {hasOrder && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" title="Order Placed" />}
                  {hasDelivery && <div className="h-1.5 w-1.5 rounded-full bg-green-500" title="Expected Delivery" />}
                </div>
              </div>
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 z-50" side="top" align="center">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{format(date, 'MMM dd, yyyy')}</h4>
            <div className="space-y-3 pt-2">
              {dayEvents.map(order => {
                const isOrderDate = isSameDay(new Date(order.orderDate), date);
                const isDeliveryDate = isSameDay(new Date(order.expectedDeliveryDate), date);
                return (
                  <div key={`${order.id}-${date.toISOString()}`} className="text-sm">
                    <p className="font-medium text-xs">{order.supplierName}</p>
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      {isOrderDate && (
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3 w-3 text-blue-500" />
                          <span>Order Placed</span>
                        </div>
                      )}
                      {isDeliveryDate && (
                        <div className="flex items-center gap-1.5">
                          <Truck className="h-3 w-3 text-green-500" />
                          <span>Expected Delivery</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs defaultValue="month" className="w-full">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Purchase Order Calendar
                </CardTitle>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="month">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border"
                  components={{
                    DayContent: DayContentWithEvents
                  }}
                />
              </TabsContent>
              <TabsContent value="week">
                <VendorCalendarWeekView />
              </TabsContent>
              <TabsContent value="day">
                <VendorCalendarDayView />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Events for {format(selectedDate, 'MMM dd, yyyy')}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => onCreateOrderForDate(selectedDate)}>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
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
                        <div className="flex items-center gap-1">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditOrder(order)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit Order</span>
                          </Button>
                        </div>
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
