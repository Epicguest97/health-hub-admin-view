
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UpcomingAppointments = () => {
  const appointments = [
    {
      id: "APP-001",
      patientName: "Emily Wilson",
      doctor: "Dr. Robert Chen",
      department: "Cardiology",
      time: "09:00 AM",
      date: "Apr 14, 2025"
    },
    {
      id: "APP-002",
      patientName: "Thomas Miller",
      doctor: "Dr. Sarah Johnson",
      department: "Neurology",
      time: "10:30 AM",
      date: "Apr 14, 2025"
    },
    {
      id: "APP-003",
      patientName: "Grace Taylor",
      doctor: "Dr. James Williams",
      department: "Orthopedics",
      time: "01:45 PM",
      date: "Apr 14, 2025"
    },
    {
      id: "APP-004",
      patientName: "Daniel Harris",
      doctor: "Dr. Lisa Brown",
      department: "Dermatology",
      time: "03:15 PM",
      date: "Apr 14, 2025"
    }
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>You have {appointments.length} appointments today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center space-x-4 rounded-md border p-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={appointment.patientName} />
                <AvatarFallback>{appointment.patientName.charAt(0)}{appointment.patientName.split(' ')[1]?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{appointment.patientName}</p>
                <p className="text-xs text-muted-foreground">{appointment.doctor}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{appointment.department}</span>
                  <span className="mx-1">•</span>
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
