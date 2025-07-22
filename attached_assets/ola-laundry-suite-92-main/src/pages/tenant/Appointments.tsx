
import { AppointmentBooking } from "@/components/booking/AppointmentBooking";

export default function TenantAppointments() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">Manage customer appointments and bookings</p>
        </div>
      </div>

      <AppointmentBooking />
    </div>
  );
}
