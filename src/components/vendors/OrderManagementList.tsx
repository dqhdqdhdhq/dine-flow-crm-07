import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FileText, ChevronDown } from 'lucide-react';
import { PurchaseOrder, OrderStatus } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onBulkUpdateStatus: (orderIds: string[], status: OrderStatus) => void;
};

const OrderManagementList: React.FC<OrderManagementListProps> = ({ purchaseOrders, onUpdateStatus, onBulkUpdateStatus }) => {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const selectedOrders = useMemo(() =>
    purchaseOrders.filter(po => selectedOrderIds.includes(po.id)),
    [selectedOrderIds, purchaseOrders]
  );
  
  const handleSelectAll = (checked: boolean) => {
    setSelectedOrderIds(checked ? purchaseOrders.map(po => po.id) : []);
  };
  
  const handleSelectOne = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(prev => [...prev, orderId]);
    } else {
      setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
    }
  };

  const possibleBulkTransitions = useMemo(() => {
    if (selectedOrders.length === 0) return [];
    
    // Find common possible transitions for all selected orders
    const firstOrderTransitions = statusTransitions[selectedOrders[0].status];
    return firstOrderTransitions.filter(status => 
      selectedOrders.every(order => statusTransitions[order.status].includes(status))
    );
  }, [selectedOrders]);


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
        {selectedOrderIds.length > 0 && (
          <div className="flex items-center justify-between gap-4 mb-4 p-3 bg-muted/50 rounded-lg animate-fade-in">
            <div className="text-sm font-medium">
              {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected
            </div>
            <div className="flex items-center gap-2">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Update Status
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {possibleBulkTransitions.length > 0 ? (
                    possibleBulkTransitions.map(newStatus => (
                       <DropdownMenuItem key={newStatus} onClick={() => {
                        onBulkUpdateStatus(selectedOrderIds, newStatus);
                        setSelectedOrderIds([]);
                      }}>
                        Mark as <span className="capitalize ml-1">{newStatus.replace('-', ' ')}</span>
                       </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No common actions</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrderIds([])}>
                Clear
              </Button>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedOrderIds.length === purchaseOrders.length && purchaseOrders.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
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
              <TableRow key={order.id} data-state={selectedOrderIds.includes(order.id) ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrderIds.includes(order.id)}
                    onCheckedChange={(checked) => handleSelectOne(order.id, !!checked)}
                    aria-label={`Select order ${order.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium truncate" style={{maxWidth: '100px'}} title={order.id}>
                  <div className="flex items-center gap-2">
                     {order.templateId && (
                       <TooltipProvider>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <FileText className="h-4 w-4 text-muted-foreground" />
                           </TooltipTrigger>
                           <TooltipContent>
                             <p>From template: {order.templateName}</p>
                           </TooltipContent>
                         </Tooltip>
                       </TooltipProvider>
                     )}
                    <span>{order.id.substring(0, 8)}...</span>
                  </div>
                </TableCell>
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
