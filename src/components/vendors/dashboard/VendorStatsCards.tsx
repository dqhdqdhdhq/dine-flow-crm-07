
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PurchaseOrder } from '@/types';
import { DollarSign, Package, AlertTriangle } from 'lucide-react';

interface VendorStatsCardsProps {
    orders: PurchaseOrder[];
}

const VendorStatsCards: React.FC<VendorStatsCardsProps> = ({ orders }) => {
    const openOrders = orders.filter(o => o.status !== 'received' && o.status !== 'cancelled');
    const overdueOrders = orders.filter(o => 
        new Date(o.expectedDeliveryDate) < new Date() && 
        (o.status === 'ordered' || o.status === 'shipped' || o.status === 'partially-received')
    );
    const totalOpenValue = openOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{openOrders.length}</div>
                    <p className="text-xs text-muted-foreground">Total orders not yet received</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Orders Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalOpenValue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total value of open orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Deliveries</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overdueOrders.length}</div>
                    <p className="text-xs text-muted-foreground">Orders past expected delivery date</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorStatsCards;
