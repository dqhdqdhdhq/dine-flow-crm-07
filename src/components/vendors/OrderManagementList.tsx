
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from 'lucide-react';
import { PurchaseOrder, OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  draft: "secondary",
  ordered: "default",
  shipped: "warning",
  'partially-received': "warning",
  received: "success",
  cancelled: "destructive",
};

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    draft: ['ordered', 'cancelled'],
    ordered: ['shipped', 'cancelled'],
    shipped: ['partially-received', 'received'],
    'partially-received': ['received', 'cancelled'],
    received: [],
    cancelled: [],
};

type OrderManagementListProps = {
  purchaseOrders: PurchaseOrder[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
};

const OrderManagementList: React.FC<OrderManagementListProps> = ({ purchaseOrders, onUpdateStatus }) => {
  if (purchaseOrders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No purchase orders to manage.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium truncate" style={{maxWidth: '100px'}} title={order.id}>{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{order.supplierName}</TableCell>
                <TableCell>
                  <Badge variant={statusColors[order.status]} className="capitalize">{order.status.replace('-', ' ')}</Badge>
                </TableCell>
                <TableCell>{format(new Date(order.orderDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {statusTransitions[order.status].length > 0 ? (
                        statusTransitions[order.status].map(newStatus => (
                          <DropdownMenuItem key={newStatus} onClick={() => onUpdateStatus(order.id, newStatus)}>
                            Mark as <span className="capitalize ml-1">{newStatus.replace('-', ' ')}</span>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No actions</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderManagementList;
