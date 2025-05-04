
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { PurchaseOrder, OrderStatus } from '@/types';
import { format } from 'date-fns';

// Mock data for demonstration
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    supplierId: 'supplier-1',
    supplierName: 'Italian Imports Co.',
    status: 'ordered',
    orderDate: new Date().toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    items: [
      {
        id: 'item-1',
        inventoryItemId: '1',
        name: 'Parmigiano Reggiano',
        quantity: 10,
        unit: 'kg',
        unitPrice: 28.5,
        receivedQuantity: 0,
        notes: ''
      },
      {
        id: 'item-2',
        inventoryItemId: '3',
        name: 'Truffle Oil',
        quantity: 5,
        unit: 'bottle',
        unitPrice: 18.75,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 285 + 93.75,
    notes: 'Regular monthly order',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    supplierId: 'supplier-2',
    supplierName: 'Premium Wines',
    status: 'partially-received',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    expectedDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    items: [
      {
        id: 'item-3',
        inventoryItemId: '2',
        name: 'Cabernet Sauvignon',
        quantity: 12,
        unit: 'bottle',
        unitPrice: 35.0,
        receivedQuantity: 8,
        notes: '4 bottles on backorder'
      }
    ],
    totalAmount: 12 * 35,
    notes: '',
    receivedBy: 'John Smith',
    receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    supplierId: 'supplier-3',
    supplierName: 'Local Produce',
    status: 'received',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    expectedDeliveryDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    items: [
      {
        id: 'item-4',
        inventoryItemId: '4',
        name: 'Organic Tomatoes',
        quantity: 20,
        unit: 'kg',
        unitPrice: 4.5,
        receivedQuantity: 20,
        notes: 'Excellent quality'
      }
    ],
    totalAmount: 20 * 4.5,
    notes: '',
    receivedBy: 'Jane Doe',
    receivedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface PurchaseOrdersProps {
  searchQuery: string;
}

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ searchQuery }) => {
  const filteredOrders = mockPurchaseOrders.filter(order => 
    order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'ordered':
        return <Badge variant="secondary">Ordered</Badge>;
      case 'shipped':
        return <Badge variant="primary">Shipped</Badge>;
      case 'partially-received':
        return <Badge variant="warning">Partially Received</Badge>;
      case 'received':
        return <Badge variant="success">Received</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>PO-{order.id}</TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  <TableCell>{format(new Date(order.orderDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {order.status === 'ordered' || order.status === 'shipped' || order.status === 'partially-received' ? (
                          <DropdownMenuItem>Receive Items</DropdownMenuItem>
                        ) : null}
                        {order.status === 'draft' ? (
                          <DropdownMenuItem>Place Order</DropdownMenuItem>
                        ) : null}
                        {(order.status === 'draft' || order.status === 'ordered') ? (
                          <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No purchase orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrders;
