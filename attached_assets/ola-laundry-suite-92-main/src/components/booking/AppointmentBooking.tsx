
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, MapPin } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  serviceType: string;
  appointmentDate: Date;
  timeSlot: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  estimatedDuration: number; // in minutes
  price: number;
  createdAt: Date;
}

const serviceTypes = [
  { id: 'pickup', name: 'Pickup & Delivery', duration: 30, price: 0 },
  { id: 'consultation', name: 'Service Consultation', duration: 45, price: 0 },
  { id: 'estimate', name: 'Price Estimate', duration: 30, price: 0 },
  { id: 'alteration', name: 'Alteration Fitting', duration: 60, price: 25 },
];

const timeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
];

export function AppointmentBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    const savedAppointments = localStorage.getItem('ola_appointments');
    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments);
      const withDates = parsed.map((apt: any) => ({
        ...apt,
        appointmentDate: new Date(apt.appointmentDate),
        createdAt: new Date(apt.createdAt)
      }));
      setAppointments(withDates);
    }
  }, []);

  const saveAppointments = (updatedAppointments: Appointment[]) => {
    setAppointments(updatedAppointments);
    localStorage.setItem('ola_appointments', JSON.stringify(updatedAppointments));
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot || !selectedService || !customerName || !customerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const service = serviceTypes.find(s => s.id === selectedService);
    if (!service) return;

    // Check if slot is already booked
    const isSlotTaken = appointments.some(apt => 
      apt.appointmentDate.toDateString() === selectedDate.toDateString() &&
      apt.timeSlot === selectedTimeSlot &&
      apt.status !== 'cancelled'
    );

    if (isSlotTaken) {
      toast.error('This time slot is already booked');
      return;
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      serviceType: service.name,
      appointmentDate: selectedDate,
      timeSlot: selectedTimeSlot,
      status: 'scheduled',
      notes,
      estimatedDuration: service.duration,
      price: service.price,
      createdAt: new Date()
    };

    const updatedAppointments = [...appointments, newAppointment];
    saveAppointments(updatedAppointments);

    // Reset form
    setSelectedDate(undefined);
    setSelectedTimeSlot('');
    setSelectedService('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerAddress('');
    setNotes('');

    toast.success('Appointment booked successfully!');
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status } : apt
    );
    saveAppointments(updatedAppointments);
    toast.success(`Appointment ${status.replace('_', ' ')}`);
  };

  const getAvailableTimeSlots = (date: Date) => {
    const bookedSlots = appointments
      .filter(apt => 
        apt.appointmentDate.toDateString() === date.toDateString() &&
        apt.status !== 'cancelled'
      )
      .map(apt => apt.timeSlot);
    
    return timeSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todayAppointments = appointments.filter(apt => 
    apt.appointmentDate.toDateString() === new Date().toDateString() &&
    apt.status !== 'cancelled'
  );

  const upcomingAppointments = appointments.filter(apt => 
    apt.appointmentDate > new Date() &&
    apt.status !== 'cancelled'
  ).sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => {
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return apt.appointmentDate <= weekFromNow && apt.appointmentDate >= new Date();
              }).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${appointments.filter(apt => apt.status === 'completed').reduce((sum, apt) => sum + apt.price, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Book New Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Customer Name *</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone *</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter email address"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Service Type *</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div>
                          <div>{service.name}</div>
                          <div className="text-xs text-gray-500">
                            {service.duration} mins • ${service.price}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Address</label>
              <Input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter customer address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time Slot *</label>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDate && getAvailableTimeSlots(selectedDate).map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes"
                rows={3}
              />
            </div>

            <Button onClick={handleBookAppointment} className="w-full">
              Book Appointment
            </Button>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments today</p>
            ) : (
              <div className="space-y-4">
                {todayAppointments
                  .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                  .map((appointment) => (
                    <Card key={appointment.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{appointment.timeSlot}</span>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{appointment.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{appointment.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{appointment.serviceType}</span>
                          <span className="text-xs text-gray-500">({appointment.estimatedDuration} min)</span>
                        </div>
                      </div>
                      
                      {appointment.status === 'scheduled' && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                          >
                            Start
                          </Button>
                        </div>
                      )}
                      
                      {appointment.status === 'in_progress' && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
