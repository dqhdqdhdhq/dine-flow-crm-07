
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface SpendingOverviewCardProps {
  spendingData: {
    thisMonth: number;
    thisYear: number;
    allTime: number;
  };
}

const SpendingOverviewCard: React.FC<SpendingOverviewCardProps> = ({ spendingData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-primary" />
          Spending Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">This Month</span>
          <span className="font-semibold text-lg">${spendingData.thisMonth.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">This Year</span>
          <span className="font-semibold text-lg">${spendingData.thisYear.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">All Time</span>
          <span className="font-semibold text-lg">${spendingData.allTime.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingOverviewCard;
