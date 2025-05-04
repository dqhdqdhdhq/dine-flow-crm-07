
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Mail, Phone, Check, AlertTriangle, Clock } from 'lucide-react';
import { Supplier } from '@/types';

interface VisibleColumns {
  name: boolean;
  contactPerson: boolean;
  contactInfo: boolean;
  productsSupplied: boolean;
}

interface VendorsListProps {
  searchQuery: string;
  statusFilter?: string[];
  visibleColumns?: VisibleColumns;
  onSelectVendor?: (vendorId: string) => void;
  suppliers: Supplier[];
}

const VendorsList: React.FC<VendorsListProps> = ({ 
  searchQuery, 
  statusFilter = [], 
  visibleColumns = { name: true, contactPerson: true, contactInfo: true, productsSupplied: true },
  onSelectVendor,
  suppliers 
}) => {
  const filteredSuppliers = suppliers.filter(supplier => {
    // Apply text search filter
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.productsSupplied.some(product => 
        product.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Apply status filter if any are selected
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(supplier.status || 'active');
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string = 'active') => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="flex items-center gap-1"><Check className="h-3 w-3" />Active</Badge>;
      case 'inactive':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Inactive</Badge>;
      case 'pending':
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Count visible columns to determine colSpan for empty state
  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length + 2; // +2 for status and actions columns

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.name && <TableHead>Vendor</TableHead>}
              {visibleColumns.contactPerson && <TableHead>Contact Person</TableHead>}
              {visibleColumns.contactInfo && <TableHead>Contact Info</TableHead>}
              {visibleColumns.productsSupplied && <TableHead>Products Supplied</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="cursor-pointer hover:bg-muted/80" onClick={() => onSelectVendor?.(supplier.id)}>
                  {visibleColumns.name && <TableCell className="font-medium">{supplier.name}</TableCell>}
                  
                  {visibleColumns.contactPerson && <TableCell>{supplier.contactPerson}</TableCell>}
                  
                  {visibleColumns.contactInfo && (
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  
                  {visibleColumns.productsSupplied && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {supplier.productsSupplied.map((product, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  )}
                  
                  <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectVendor?.(supplier.id); }}>View Dashboard</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Create Purchase Order</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>View Order History</DropdownMenuItem>
                        {supplier.status !== 'inactive' && (
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
                            Deactivate Vendor
                          </DropdownMenuItem>
                        )}
                        {supplier.status === 'inactive' && (
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            Reactivate Vendor
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumnCount} className="text-center py-4">
                  No vendors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VendorsList;
