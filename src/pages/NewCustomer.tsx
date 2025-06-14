
import React, { useState } from 'react';
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
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '@/types';
import { mockCustomers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, X } from 'lucide-react';

const newCustomerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  notes: z.string().optional(),
  preferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
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

const NewCustomer: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');
  const [customPreference, setCustomPreference] = useState('');

  const form = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      preferences: [],
      allergies: [],
      vip: false,
    },
  });

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !selectedAllergies.includes(customAllergy.trim())) {
      const newAllergies = [...selectedAllergies, customAllergy.trim()];
      setSelectedAllergies(newAllergies);
      form.setValue('allergies', newAllergies);
      setCustomAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    const newAllergies = selectedAllergies.filter(a => a !== allergy);
    setSelectedAllergies(newAllergies);
    form.setValue('allergies', newAllergies);
  };

  const toggleAllergy = (allergy: string) => {
    const newAllergies = selectedAllergies.includes(allergy)
      ? selectedAllergies.filter(a => a !== allergy)
      : [...selectedAllergies, allergy];
    setSelectedAllergies(newAllergies);
    form.setValue('allergies', newAllergies);
  };

  const addCustomPreference = () => {
    if (customPreference.trim() && !selectedPreferences.includes(customPreference.trim())) {
      const newPreferences = [...selectedPreferences, customPreference.trim()];
      setSelectedPreferences(newPreferences);
      form.setValue('preferences', newPreferences);
      setCustomPreference('');
    }
  };

  const removePreference = (preference: string) => {
    const newPreferences = selectedPreferences.filter(p => p !== preference);
    setSelectedPreferences(newPreferences);
    form.setValue('preferences', newPreferences);
  };

  const togglePreference = (preference: string) => {
    const newPreferences = selectedPreferences.includes(preference)
      ? selectedPreferences.filter(p => p !== preference)
      : [...selectedPreferences, preference];
    setSelectedPreferences(newPreferences);
    form.setValue('preferences', newPreferences);
  };

  function onSubmit(values: z.infer<typeof newCustomerSchema>) {
    const newCustomer: Customer = {
      id: `customer-${uuidv4()}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      visits: 0,
      lastVisit: new Date().toISOString(),
      totalSpent: 0,
      notes: values.notes || '',
      preferences: selectedPreferences,
      vip: values.vip || false,
      tags: values.vip ? ['VIP', 'New Customer'] : ['New Customer'],
      allergies: selectedAllergies,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatarUrl: `https://avatar.vercel.sh/${values.email}.png`,
    };

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

              {/* Advanced Section */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Additional Information (Optional)
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
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
                </CollapsibleContent>
              </Collapsible>

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
