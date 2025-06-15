
import React from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { Invoice } from '@/types';
import { getInvoiceStatusColor } from '@/data/invoicesData';
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ShieldX, Briefcase, Hash } from 'lucide-react';

interface InvoiceCardProps {
  invoice: Invoice;
  onInvoiceClick: (invoice: Invoice) => void;
}

const actionIconProps = {
  className: "h-8 w-8 text-white",
  strokeWidth: 1.5,
};

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onInvoiceClick }) => {
  const { toast } = useToast();

  const handleAction = (e: React.MouseEvent | PointerEvent, action: string) => {
    e.stopPropagation(); // Prevent card click from firing
    console.log(`Action: ${action} on Invoice ID: ${invoice.id}`);
    toast({
      title: "Action Submitted",
      description: `${action} request for invoice #${invoice.invoiceNumber} has been submitted.`,
    });
  };

  const statusColor = getInvoiceStatusColor(invoice.status);
  const statusText = invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1).replace('-', ' ');
  const dueDateDistance = formatDistanceToNow(new Date(invoice.dueDate), { addSuffix: true });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div layout variants={cardVariants} className="relative">
      <div className="absolute inset-y-0 left-0 right-0 flex justify-end items-center rounded-2xl overflow-hidden">
        <motion.div
          onClick={(e) => handleAction(e, 'Dispute')}
          className="flex flex-col items-center justify-center h-full w-24 bg-orange-500 text-white space-y-1"
        >
          <ShieldX {...actionIconProps} />
          <span className="text-xs font-semibold">Dispute</span>
        </motion.div>
      </div>
      <div className="absolute inset-y-0 left-0 right-0 flex justify-start items-center rounded-2xl overflow-hidden">
        <motion.div
          onClick={(e) => handleAction(e, 'Approve')}
          className="flex flex-col items-center justify-center h-full w-24 bg-green-500 text-white space-y-1"
        >
          <CheckCircle {...actionIconProps} />
          <span className="text-xs font-semibold">Approve</span>
        </motion.div>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          if (info.offset.x > 100) {
            handleAction(event as any, 'Approve');
          } else if (info.offset.x < -100) {
            handleAction(event as any, 'Dispute');
          }
        }}
        onClick={() => onInvoiceClick(invoice)}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="relative z-10 w-full cursor-pointer"
      >
        <div className="bg-card/80 dark:bg-card/60 backdrop-blur-xl border rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Briefcase className="h-4 w-4" /> {invoice.vendorName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-2"><Hash className="h-3 w-3" />{invoice.invoiceNumber}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {statusText}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-muted-foreground">Due {dueDateDistance}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
            </div>
            <p className="text-2xl font-bold">
              ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceCard;
