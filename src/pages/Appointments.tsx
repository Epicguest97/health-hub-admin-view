
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Appointment {
  id: string;
  patient_id: string;
  department_id: string;
  staff_id: string;
  appointment_date: string;
  status: string;
  reason: string;
  notes?: string;
  patient?: { first_name: string; last_name: string };
  department?: { name: string };
  staff?: { first_name: string; last_name: string };
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient(first_name, last_name),
          department(name),
          staff(first_name, last_name)
        `);
      
      if (error) throw error;
      
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching appointments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAppointments = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (appointments.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No appointments scheduled.
        </div>
      );
    }

    return appointments.map((appointment) => (
      <Card key={appointment.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Patient</h3>
              <p>{appointment.patient?.first_name} {appointment.patient?.last_name}</p>
            </div>
            <div>
              <h3 className="font-medium">Department</h3>
              <p>{appointment.department?.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Staff</h3>
              <p>{appointment.staff?.first_name} {appointment.staff?.last_name}</p>
            </div>
            <div>
              <h3 className="font-medium">Date</h3>
              <p>{new Date(appointment.appointment_date).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-medium">Reason</h3>
              <p>{appointment.reason}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p>{appointment.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <MainLayout title="Appointments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Appointments</h2>
          <Button 
            onClick={() => window.location.href = '/appointments/schedule'}
          >
            Schedule New Appointment
          </Button>
        </div>

        <div className="space-y-4">
          {renderAppointments()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
