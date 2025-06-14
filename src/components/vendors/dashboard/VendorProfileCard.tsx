
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Package, User } from 'lucide-react';
import { Supplier } from '@/types';

interface VendorProfileCardProps {
  supplier: Supplier;
}

const VendorProfileCard: React.FC<VendorProfileCardProps> = ({ supplier }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl">{supplier.name}</CardTitle>
        <CardDescription>Vendor Profile & Contact Information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-muted-foreground">Contact Person</p>
              <p>{supplier.contactPerson}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-muted-foreground">Email</p>
              <p className="break-all">{supplier.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-muted-foreground">Phone</p>
              <p>{supplier.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-muted-foreground">Address</p>
              <p>{supplier.address}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm pt-2">
          <Package className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-muted-foreground">Products Supplied</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {supplier.productsSupplied.map((product, index) => (
                <Badge key={index} variant="secondary">{product}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorProfileCard;
