
import React from 'react';
import { PurchaseOrder } from '@/types';

interface VendorCalendarProps {
  purchaseOrders?: PurchaseOrder[];
}

const VendorCalendar: React.FC<VendorCalendarProps> = ({ purchaseOrders = [] }) => {
  return (
    <div className="bg-muted/30 p-8 rounded-lg text-center">
      <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
      <p className="text-muted-foreground">
        Calendar view for upcoming vendor deliveries, scheduled orders, and important dates.
      </p>
    </div>
  );
};

export default VendorCalendar;
