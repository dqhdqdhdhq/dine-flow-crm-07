
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Mail, Phone, Check, AlertTriangle, Clock, Building2 } from 'lucide-react';
import { Supplier } from '@/types';

interface VendorCardsProps {
  searchQuery: string;
  statusFilter?: string[];
  onSelectVendor?: (vendorId: string) => void;
  suppliers: Supplier[];
  selectedVendor?: string | null;
}

const VendorCards: React.FC<VendorCardsProps> = ({ 
  searchQuery, 
  statusFilter = [], 
  onSelectVendor,
  suppliers,
  selectedVendor
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
        return <Badge variant="success" className="flex items-center gap-1 text-xs"><Check className="h-3 w-3" />Active</Badge>;
      case 'inactive':
        return <Badge variant="destructive" className="flex items-center gap-1 text-xs"><AlertTriangle className="h-3 w-3" />Inactive</Badge>;
      case 'pending':
        return <Badge variant="warning" className="flex items-center gap-1 text-xs"><Clock className="h-3 w-3" />Pending</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  if (filteredSuppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No vendors found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSuppliers.map((supplier) => (
        <Card 
          key={supplier.id} 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
            selectedVendor === supplier.id ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
          onClick={() => onSelectVendor?.(supplier.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{supplier.name}</h3>
                <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(supplier.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectVendor?.(supplier.id); }}>
                      View Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Create Purchase Order</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>View Order History</DropdownMenuItem>
                    {supplier.status !== 'inactive' && (
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
                        Deactivate Vendor
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{supplier.phone}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Products Supplied</p>
              <div className="flex flex-wrap gap-1">
                {supplier.productsSupplied.slice(0, 3).map((product, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                    {product}
                  </Badge>
                ))}
                {supplier.productsSupplied.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{supplier.productsSupplied.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VendorCards;
