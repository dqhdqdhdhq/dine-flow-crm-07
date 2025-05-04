
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Party name is required" }),
  size: z.string().transform((val) => Number(val)), // Ensure we transform to a number
  notes: z.string().optional(),
});

type WaitlistFormValues = z.infer<typeof formSchema>;

interface AddToWaitlistDialogProps {
  onAddParty: (party: {
    name: string;
    size: number;
    notes?: string;
  }) => void;
}

const AddToWaitlistDialog: React.FC<AddToWaitlistDialogProps> = ({
  onAddParty,
}) => {
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      size: "2", // This is correctly a string as the form input will be a string
      notes: "",
    },
  });

  const onSubmit = (values: WaitlistFormValues, event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    
    onAddParty({
      name: values.name,
      size: Number(values.size), // Explicitly convert to number here
      notes: values.notes,
    });
    
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add to Waitlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Party to Waitlist</DialogTitle>
          <DialogDescription>
            Enter the details of the party to add to the waitlist.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith Party" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party Size</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
                        <option key={size} value={size.toString()}>
                          {size} {size === 1 ? "person" : "people"}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Any special requests..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add to Waitlist</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToWaitlistDialog;
