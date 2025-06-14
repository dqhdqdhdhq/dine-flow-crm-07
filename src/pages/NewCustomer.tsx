
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '@/types';
import { mockCustomers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const newCustomerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  notes: z.string().optional(),
});

const NewCustomer: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof newCustomerSchema>) {
    const newCustomer: Customer = {
      ...values,
      id: `customer-${uuidv4()}`,
      visits: 0,
      lastVisit: new Date().toISOString(),
      totalSpent: 0,
      notes: values.notes || '',
      preferences: [],
      vip: false,
      tags: ['New Customer'],
      allergies: [],
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatarUrl: `https://avatar.vercel.sh/${values.email}.png`,
    };

    // In a real app, you'd send this to an API.
    // For now, we'll add it to our mock data array.
    mockCustomers.push(newCustomer);
    
    console.log("New customer created:", newCustomer);

    toast({
      title: "Customer Created",
      description: `${values.firstName} ${values.lastName} has been added to the customer list.`,
    });

    navigate("/customers");
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
       <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any additional notes about the customer..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/customers')}>Cancel</Button>
                <Button type="submit">Create Customer</Button>
              </div>
            </form>
          </Form>
        </CardContent>
       </Card>
    </div>
  );
};

export default NewCustomer;
