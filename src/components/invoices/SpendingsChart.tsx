
import React, { useMemo } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Invoice } from '@/types';
import { getInvoiceCategoryLabel } from '@/data/invoicesData';
import { cn } from "@/lib/utils";

interface SpendingsChartProps {
  invoices: Invoice[];
}

const chartColors = {
  'Food Supplies': 'hsl(142.1 76.2% 36.3%)',
  'Utilities': 'hsl(221.2 83.2% 53.3%)',
  'Rent': 'hsl(47.9 95.8% 53.1%)',
  'Marketing': 'hsl(262.1 83.3% 57.8%)',
  'Maintenance': 'hsl(24.6 95.0% 53.1%)',
  'Payroll': 'hsl(346.8 77.2% 49.8%)',
  'Other': 'hsl(210 40% 96.1%)',
};

const SpendingsChart: React.FC<SpendingsChartProps> = ({ invoices }) => {
  const { chartData, chartConfig } = useMemo(() => {
    const categoryTotals = invoices.reduce((acc, invoice) => {
      const categoryLabel = getInvoiceCategoryLabel(invoice.category);
      if (!acc[categoryLabel]) {
        acc[categoryLabel] = { total: 0, count: 0 };
      }
      acc[categoryLabel].total += invoice.amount;
      acc[categoryLabel].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const data = Object.entries(categoryTotals)
      .map(([name, { total }]) => ({
        name,
        value: total,
        fill: chartColors[name as keyof typeof chartColors] || chartColors['Other'],
      }))
      .sort((a, b) => b.value - a.value);
    
    const config: ChartConfig = data.reduce((acc, item) => {
        acc[item.name] = {
            label: item.name,
            color: item.fill,
        };
        return acc;
    }, {} as ChartConfig);

    return { chartData: data, chartConfig: config };
  }, [invoices]);

  return (
    <Card className={cn("transition-shadow hover:shadow-xl backdrop-blur-xl border-white/10 bg-card/80 dark:bg-card/60")}>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>A breakdown of your expenses for all invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SpendingsChart;
