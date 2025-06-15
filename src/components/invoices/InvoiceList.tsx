
import React from 'react';
import { motion } from 'framer-motion';
import { Invoice } from '@/types';
import InvoiceCard from './InvoiceCard';
import { FileText } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  isFiltered: boolean;
  onInvoiceClick: (invoice: Invoice) => void;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, isFiltered, onInvoiceClick }) => {
  return (
    <div>
      {invoices.length > 0 ? (
        <motion.div 
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {invoices.map((invoice) => (
            <InvoiceCard 
              key={invoice.id} 
              invoice={invoice} 
              onInvoiceClick={onInvoiceClick} 
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-card/50 rounded-2xl p-8 border-dashed border-2">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" strokeWidth={1} />
          <p className="text-xl font-semibold text-foreground">
            {isFiltered ? 'No Matches Found' : 'All Clear!'}
          </p>
          <p className="text-base text-muted-foreground mt-2 max-w-xs">
            {isFiltered ? 'Try adjusting your search or filter criteria to find what you\'re looking for.' : 'There are no invoices to show right now. Enjoy the peace of mind!'}
          </p>
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-4 px-1">
        {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}{isFiltered && invoices.length > 0 ? ' matching filters' : ''}
      </div>
    </div>
  );
};

export default InvoiceList;
