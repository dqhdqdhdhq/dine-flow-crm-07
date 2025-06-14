
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch } from 'lucide-react';

interface FrequentItemsCardProps {
  items: { name: string; totalOrdered: number; averageCost: number }[];
}

const FrequentItemsCard: React.FC<FrequentItemsCardProps> = ({ items }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PackageSearch className="h-5 w-5 text-primary" />
          Frequent Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.slice(0, 3).map((item, index) => ( // Show top 3
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Ordered {item.totalOrdered} times</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.averageCost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">avg/unit</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No order history yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FrequentItemsCard;
