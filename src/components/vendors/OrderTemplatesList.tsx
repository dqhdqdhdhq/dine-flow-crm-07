
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from 'lucide-react';
import { OrderTemplate } from '@/types';

type OrderTemplatesListProps = {
  templates: OrderTemplate[];
  onGenerateOrder: (template: OrderTemplate) => void;
};

const OrderTemplatesList: React.FC<OrderTemplatesListProps> = ({ templates, onGenerateOrder }) => {
  if (templates.length === 0) {
    return <div className="text-center text-muted-foreground py-12">No templates created yet. Get started by creating one.</div>
  }

  const formatRecurrence = (template: OrderTemplate) => {
    const { pattern, dayOfMonth, dayOfWeek } = template.recurrence;
    switch(pattern) {
      case 'daily': return 'Daily';
      case 'weekly': return `Weekly on ${['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'][dayOfWeek || 0]}`;
      case 'monthly': return `Monthly on day ${dayOfMonth}`;
      case 'yearly': return 'Yearly';
      default: return 'Custom';
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map(template => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              {template.name}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription>{template.supplierName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{formatRecurrence(template)}</p>
            <p className="text-muted-foreground">Next: {format(new Date(template.nextGenerationDate), "MMM d, yyyy")}</p>
            <p className="text-muted-foreground">{template.items.length} items</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onGenerateOrder(template)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate Order
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
};

export default OrderTemplatesList;
