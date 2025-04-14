
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AppointmentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patient, department, staffMember } = location.state || {};
  
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!patient || !department || !staffMember) {
    navigate('/appointments/schedule');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patient.id,
          department_id: department.id,
          staff_id: staffMember.id,
          appointment_date: appointmentDate,
          reason,
          notes,
        });

      if (error) throw error;

      toast({
        title: "Appointment scheduled",
        description: "The appointment has been successfully scheduled.",
      });

      navigate('/medical-records');
    } catch (error: any) {
      toast({
        title: "Error scheduling appointment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout title="Schedule Appointment">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Schedule Appointment</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Input 
                    id="patient" 
                    value={`${patient.first_name} ${patient.last_name}`} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    value={department.name} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff">Staff Member</Label>
                  <Input 
                    id="staff" 
                    value={`${staffMember.first_name} ${staffMember.last_name}`} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date</Label>
                  <Input 
                    id="date" 
                    type="datetime-local" 
                    value={appointmentDate} 
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input 
                  id="reason" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AppointmentForm;
