
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash2, 
  User, 
  ListCheck 
} from 'lucide-react';
import { format } from 'date-fns';
import { Event, EventTask, EventGuest } from '@/types';
import { eventTypes, eventStatuses, mockEventTasks, mockEventGuests } from '@/data/eventsData';

interface EventDetailsDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ event, isOpen, onClose }) => {
  // Get tasks and guests for this event from mock data
  const eventTasks = mockEventTasks.filter(task => task.eventId === event.id);
  const eventGuests = mockEventGuests.filter(guest => guest.eventId === event.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center mb-1 gap-2">
            <Badge className={`${eventTypes[event.type].color} text-white`}>
              {eventTypes[event.type].label}
            </Badge>
            <Badge variant="outline" className={`border-2 ${eventStatuses[event.status].color.replace('bg-', 'border-')}`}>
              {eventStatuses[event.status].label}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold">{event.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="guests">Guest List</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1">
            <TabsContent value="details" className="space-y-4 px-1">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p>{format(new Date(event.startDate), 'MMMM dd, yyyy')}</p>
                        {event.isMultiDay && (
                          <p>to {format(new Date(event.endDate), 'MMMM dd, yyyy')}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p>{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p>{event.locationDetails}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Capacity</p>
                        <p>{event.bookedCount} / {event.capacity} booked</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="font-medium mb-2">Description</p>
                    <p className="text-muted-foreground">
                      {event.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  {event.publicDescription && (
                    <div className="pt-2">
                      <p className="font-medium mb-2">Public Description</p>
                      <p className="text-muted-foreground">{event.publicDescription}</p>
                    </div>
                  )}
                  
                  {event.menu && (
                    <div className="pt-2">
                      <p className="font-medium mb-2">Menu: {event.menu.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{event.menu.description}</p>
                      <div className="border rounded-md divide-y">
                        {event.menu.items.map((item, index) => (
                          <div key={index} className="p-3 flex justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {(event.ticketPrice || event.minimumSpend) && (
                  <CardFooter className="border-t flex flex-col items-start">
                    {event.ticketPrice && (
                      <div className="flex justify-between w-full py-2">
                        <p>Ticket Price:</p>
                        <p className="font-medium">${event.ticketPrice.toFixed(2)}</p>
                      </div>
                    )}
                    {event.minimumSpend && (
                      <div className="flex justify-between w-full py-2">
                        <p>Minimum Spend:</p>
                        <p className="font-medium">${event.minimumSpend.toFixed(2)}</p>
                      </div>
                    )}
                  </CardFooter>
                )}
              </Card>
              
              {event.staffingRequirements && event.staffingRequirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Staffing Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {event.staffingRequirements.map((staff, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <p>{staff.role}</p>
                          <Badge variant="outline">{staff.count} needed</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          
            <TabsContent value="tasks" className="px-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Manage and track tasks for this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventTasks.length === 0 ? (
                    <div className="text-center py-6">
                      <ListCheck className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No tasks created yet</h3>
                      <p className="text-sm text-muted-foreground">Add tasks to help organize this event.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {eventTasks.map(task => (
                        <div key={task.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              {task.status === 'completed' ? (
                                <CheckCircle className="h-5 w-5 text-primary mt-1" />
                              ) : task.status === 'overdue' ? (
                                <Circle className="h-5 w-5 text-destructive mt-1" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground mt-1" />
                              )}
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              </div>
                            </div>
                            <Badge variant={task.status === 'completed' ? 'default' : task.status === 'overdue' ? 'destructive' : 'outline'}>
                              {task.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                            {task.assignedToName && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{task.assignedToName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guests" className="px-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Guest List</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {eventGuests.reduce((total, guest) => total + guest.attendees, 0)} / {event.capacity} spots filled
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  {eventGuests.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No guests added yet</h3>
                      <p className="text-sm text-muted-foreground">Add guests to track attendance.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Attendees</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Contact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventGuests.map(guest => (
                          <TableRow key={guest.id}>
                            <TableCell className="font-medium">{guest.name}</TableCell>
                            <TableCell>{guest.attendees}</TableCell>
                            <TableCell>
                              <Badge variant={
                                guest.status === 'confirmed' ? 'default' :
                                guest.status === 'checked-in' ? 'outline' :
                                guest.status === 'cancelled' ? 'destructive' : 'secondary'
                              }>
                                {guest.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {guest.email && <div>{guest.email}</div>}
                              {guest.phone && <div>{guest.phone}</div>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="px-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>
                    Spaces and equipment allocated for this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {event.resources.length === 0 ? (
                    <div className="text-center py-6">
                      <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No resources assigned</h3>
                      <p className="text-sm text-muted-foreground">Assign spaces or equipment to this event.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {event.resources
                        .reduce((grouped, resource) => {
                          if (!grouped[resource.type]) {
                            grouped[resource.type] = [];
                          }
                          grouped[resource.type].push(resource);
                          return grouped;
                        }, {} as Record<string, typeof event.resources>)
                        .map((resourceGroup, type) => (
                          <div key={type} className="space-y-2">
                            <h3 className="font-medium capitalize">{type === 'room' ? 'Rooms' : type === 'section' ? 'Sections' : type === 'table' ? 'Tables' : 'Equipment'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {resourceGroup.map(resource => (
                                <div key={resource.id} className="border rounded-md p-3 flex justify-between">
                                  <div>
                                    <p>{resource.name}</p>
                                    {resource.notes && <p className="text-sm text-muted-foreground">{resource.notes}</p>}
                                  </div>
                                  {resource.quantity > 1 && <Badge variant="outline">{resource.quantity}x</Badge>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" className="gap-1">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          {/* For now, we won't implement the delete functionality */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
