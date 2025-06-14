
import React, { useState, useEffect } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Customer } from '@/types';
import { mockCustomers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

const editCustomerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  notes: z.string().optional(),
  vip: z.boolean().optional(),
});

const commonAllergies = [
  'Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Dairy', 'Eggs', 
  'Soy', 'Wheat/Gluten', 'Sesame', 'Sulfites'
];

const commonPreferences = [
  'Window seat', 'Booth', 'Quiet area', 'Near kitchen', 'Outdoor seating',
  'Bar seating', 'Corner table', 'Large table', 'High chair needed',
  'Wheelchair accessible', 'Sparkling water', 'Still water', 'Wine pairing'
];

const EditCustomer: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');
  const [customPreference, setCustomPreference] = useState('');

  const form = useForm<z.infer<typeof editCustomerSchema>>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      vip: false,
    },
  });

  useEffect(() => {
    if (id) {
      const foundCustomer = mockCustomers.find(c => c.id === id);
      if (foundCustomer) {
        setCustomer(foundCustomer);
        setSelectedAllergies(foundCustomer.allergies || []);
        setSelectedPreferences(foundCustomer.preferences || []);
        form.reset({
          firstName: foundCustomer.firstName,
          lastName: foundCustomer.lastName,
          email: foundCustomer.email,
          phone: foundCustomer.phone,
          notes: foundCustomer.notes || '',
          vip: foundCustomer.vip,
        });
      } else {
        toast({
          title: "Customer not found",
          description: "The requested customer could not be found.",
          variant: "destructive",
        });
        navigate("/customers");
      }
    }
  }, [id, form, navigate, toast]);

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !selectedAllergies.includes(customAllergy.trim())) {
      setSelectedAllergies([...selectedAllergies, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const addCustomPreference = () => {
    if (customPreference.trim() && !selectedPreferences.includes(customPreference.trim())) {
      setSelectedPreferences([...selectedPreferences, customPreference.trim()]);
      setCustomPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
  };

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  function onSubmit(values: z.infer<typeof editCustomerSchema>) {
    if (!customer) return;

    const updatedCustomer: Customer = {
      ...customer,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      notes: values.notes || '',
      vip: values.vip || false,
      preferences: selectedPreferences,
      allergies: selectedAllergies,
      tags: values.vip ? 
        (customer.tags?.includes('VIP') ? customer.tags : [...(customer.tags || []), 'VIP']) :
        (customer.tags?.filter(tag => tag !== 'VIP') || []),
      updatedAt: new Date().toISOString(),
    };

    const customerIndex = mockCustomers.findIndex(c => c.id === customer.id);
    if (customerIndex !== -1) {
      mockCustomers[customerIndex] = updatedCustomer;
    }

    console.log("Customer updated:", updatedCustomer);

    toast({
      title: "Customer Updated",
      description: `${values.firstName} ${values.lastName} has been updated successfully.`,
    });

    navigate(`/customers/${customer.id}`);
  }

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
       <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Customer: {customer.firstName} {customer.lastName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
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
              </div>

              {/* VIP Status */}
              <FormField
                control={form.control}
                name="vip"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>VIP Customer</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Allergies */}
              <div className="space-y-4">
                <h4 className="font-medium">Allergies & Dietary Restrictions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {commonAllergies.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={selectedAllergies.includes(allergy)}
                        onCheckedChange={() => toggleAllergy(allergy)}
                      />
                      <label htmlFor={allergy} className="text-sm">{allergy}</label>
                    </div>
                  ))}
                </div>
                
                {selectedAllergies.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Selected Allergies:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedAllergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(allergy)}
                            className="ml-2 hover:bg-red-700 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom allergy..."
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergy())}
                  />
                  <Button type="button" onClick={addCustomAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h4 className="font-medium">Dining Preferences</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {commonPreferences.map((preference) => (
                    <div key={preference} className="flex items-center space-x-2">
                      <Checkbox
                        id={preference}
                        checked={selectedPreferences.includes(preference)}
                        onCheckedChange={() => togglePreference(preference)}
                      />
                      <label htmlFor={preference} className="text-sm">{preference}</label>
                    </div>
                  ))}
                </div>

                {selectedPreferences.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Selected Preferences:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedPreferences.map((preference) => (
                        <Badge key={preference} variant="secondary" className="text-xs">
                          {preference}
                          <button
                            type="button"
                            onClick={() => removePreference(preference)}
                            className="ml-2 hover:bg-gray-400 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom preference..."
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPreference())}
                  />
                  <Button type="button" onClick={addCustomPreference} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Notes */}
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
                <Button type="button" variant="outline" onClick={() => navigate(`/customers/${customer.id}`)}>Cancel</Button>
                <Button type="submit">Update Customer</Button>
              </div>
            </form>
          </Form>
        </CardContent>
       </Card>
    </div>
  );
};

export default EditCustomer;
