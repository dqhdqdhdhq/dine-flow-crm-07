
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PurchaseOrder } from '@/types';

// Mock timeline events based on purchase orders
interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'order' | 'delivery' | 'communication' | 'invoice';
  status?: string;
  amount?: number;
}

// Mock data
const mockEvents: TimelineEvent[] = [
  {
    id: 'event-1',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Purchase Order Created',
    description: 'PO-4 created for Italian Imports Co.',
    type: 'order',
    status: 'ordered',
    amount: 228.00
  },
  {
    id: 'event-2',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Order Shipped',
    description: 'Supplier has shipped PO-4',
    type: 'order',
    status: 'shipped',
  },
  {
    id: 'event-3',
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Order Received',
    description: 'PO-4 received by Jane Smith',
    type: 'delivery',
    status: 'received',
  },
  {
    id: 'event-4',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Invoice Recorded',
    description: 'Invoice #1234 from Italian Imports Co.',
    type: 'invoice',
    amount: 228.00
  },
  {
    id: 'event-5',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Phone Call',
    description: 'Marco called to discuss next delivery',
    type: 'communication',
  },
  {
    id: 'event-6',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Purchase Order Created',
    description: 'PO-1 created for Italian Imports Co.',
    type: 'order',
    status: 'ordered',
    amount: 378.75
  },
];

interface VendorTimelineProps {
  vendorId: string | null;
}

const VendorTimeline: React.FC<VendorTimelineProps> = ({ vendorId }) => {
  if (!vendorId) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Please select a vendor to view their timeline</p>
      </div>
    );
  }

  // We could filter events by vendorId here if we had more data
  const events = mockEvents;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Timeline</CardTitle>
        <CardDescription>Chronological history of all interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border before:content-['']">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                {event.type === 'order' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                    <path d="M16.5 9.4 7.55 4.24" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                    <line x1="12" y1="22" x2="12" y2="12" />
                    <circle cx="18.5" cy="15.5" r="2.5" />
                    <path d="M20.27 17.27 22 19" />
                  </svg>
                )}
                {event.type === 'delivery' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                )}
                {event.type === 'communication' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h8" />
                    <path d="M8 17h8" />
                    <path d="M8 9h2" />
                  </svg>
                )}
                {event.type === 'invoice' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect width="16" height="20" x="4" y="2" rx="2" />
                    <path d="M8 10h8" />
                    <path d="M8 14h4" />
                  </svg>
                )}
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border bg-card shadow">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <h4 className="font-medium">{event.title}</h4>
                  {event.status && (
                    <Badge variant={
                      event.status === 'received' ? 'success' : 
                      event.status === 'partially-received' ? 'warning' :
                      event.status === 'cancelled' ? 'destructive' :
                      event.status === 'shipped' ? 'default' : 'secondary'
                    }>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  )}
                </div>
                <time className="block text-xs text-muted-foreground mb-2">
                  {format(new Date(event.date), 'MMMM d, yyyy')}
                </time>
                <div className="text-sm">{event.description}</div>
                {event.amount !== undefined && (
                  <div className="mt-2 text-right">
                    <span className="text-sm font-medium">${event.amount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorTimeline;
