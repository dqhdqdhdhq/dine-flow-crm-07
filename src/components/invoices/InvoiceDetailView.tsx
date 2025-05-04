
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Invoice, InvoiceStatus, InvoiceCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, Note, Download, Edit } from 'lucide-react';
import { getInvoiceStatusLabel, getInvoiceCategoryLabel } from '@/data/invoicesData';

interface InvoiceDetailViewProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#9b87f5]" />
            Invoice #{invoice.invoiceNumber}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              <FileText className="h-4 w-4 mr-2" /> Details
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1">
              <Clock className="h-4 w-4 mr-2" /> Payment History
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              <Note className="h-4 w-4 mr-2" /> Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Vendor:</div>
                    <div className="text-sm">{invoice.vendorName}</div>
                    
                    <div className="text-sm font-medium text-muted-foreground">Category:</div>
                    <div className="text-sm">{getInvoiceCategoryLabel(invoice.category)}</div>
                    
                    <div className="text-sm font-medium text-muted-foreground">Issue Date:</div>
                    <div className="text-sm">
                      {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="text-sm font-medium text-muted-foreground">Due Date:</div>
                    <div className="text-sm">
                      {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="text-sm font-medium text-muted-foreground">Amount:</div>
                    <div className="text-sm font-semibold">
                      ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    
                    <div className="text-sm font-medium text-muted-foreground">Status:</div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        invoice.status === 'pending-approval' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getInvoiceStatusLabel(invoice.status)}
                      </span>
                    </div>
                    
                    {invoice.paymentDate && (
                      <>
                        <div className="text-sm font-medium text-muted-foreground">Payment Date:</div>
                        <div className="text-sm">
                          {format(new Date(invoice.paymentDate), 'MMM dd, yyyy')}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice Document</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  {invoice.fileUrl ? (
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto" />
                      <Button variant="outline" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-16 w-16 text-gray-200 mx-auto" />
                      <p className="mt-2">No document attached</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {invoice.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{invoice.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payment" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track all payments for this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                {invoice.status === 'paid' || invoice.status === 'partially-paid' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{format(new Date(invoice.paymentDate || ''), 'MMM dd, yyyy')}</p>
                        <p className="text-sm text-muted-foreground">Payment received</p>
                      </div>
                      <p className="font-semibold">
                        ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No payment records yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Internal notes for this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full h-32 p-2 border rounded-md" 
                  placeholder="Add internal notes here..."
                  defaultValue={invoice.notes || ''}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailView;
