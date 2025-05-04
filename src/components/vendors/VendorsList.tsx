
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Mail, Phone } from 'lucide-react';
import { Supplier } from '@/types';

// Mock data for demonstration
const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'Italian Imports Co.',
    contactPerson: 'Marco Rossi',
    phone: '+1 (555) 123-4567',
    email: 'marco@italianimports.com',
    address: '123 Cheese Lane, San Francisco, CA 94110',
    productsSupplied: ['Parmigiano Reggiano', 'Truffle Oil', 'Balsamic Vinegar'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-2',
    name: 'Premium Wines',
    contactPerson: 'Sophia Laurent',
    phone: '+1 (555) 987-6543',
    email: 'sophia@premiumwines.com',
    address: '456 Vineyard Road, Napa Valley, CA 94558',
    productsSupplied: ['Cabernet Sauvignon', 'Pinot Noir', 'Chardonnay'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-3',
    name: 'Local Produce',
    contactPerson: 'David Kim',
    phone: '+1 (555) 456-7890',
    email: 'david@localproduce.com',
    address: '789 Farm Road, Berkeley, CA 94710',
    productsSupplied: ['Organic Vegetables', 'Fresh Herbs', 'Specialty Mushrooms'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface VendorsListProps {
  searchQuery: string;
  onSelectVendor?: (vendorId: string) => void;
}

const VendorsList: React.FC<VendorsListProps> = ({ searchQuery, onSelectVendor }) => {
  const filteredSuppliers = mockSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.productsSupplied.some(product => 
      product.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Products Supplied</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="cursor-pointer hover:bg-muted/80" onClick={() => onSelectVendor?.(supplier.id)}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
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
