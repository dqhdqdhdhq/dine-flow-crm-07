import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from 'lucide-react';
import { OrderTemplate } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type OrderTemplatesListProps = {
  templates: OrderTemplate[];
  onGenerateOrder: (template: OrderTemplate) => void;
  onEdit: (template: OrderTemplate) => void;
  onDelete: (templateId: string) => void;
};

const OrderTemplatesList: React.FC<OrderTemplatesListProps> = ({ templates, onGenerateOrder, onEdit, onDelete }) => {
  const [templateToDelete, setTemplateToDelete] = useState<OrderTemplate | null>(null);

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
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map(template => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                {template.name}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(template)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => setTemplateToDelete(template)}>Delete</DropdownMenuItem>
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
      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the template "{templateToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (templateToDelete) {
                  onDelete(templateToDelete.id);
                  setTemplateToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
};

export default OrderTemplatesList;
