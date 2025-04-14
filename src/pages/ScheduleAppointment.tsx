
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  department_id: string;
}

const ScheduleAppointment = () => {
  const [step, setStep] = useState<'patient' | 'department' | 'staff'>('patient');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (step === 'department') {
      fetchDepartments();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'staff' && selectedDepartment) {
      fetchStaffByDepartment(selectedDepartment.id);
    }
  }, [step, selectedDepartment]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, email');
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching patients",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching departments",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchStaffByDepartment = async (departmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('department_id', departmentId)
        .eq('status', 'Active');
      
      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching staff members",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setStep('department');
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setStep('staff');
  };

  const handleStaffSelect = (staffMember: StaffMember) => {
    navigate(`/appointments/new`, {
      state: {
        patient: selectedPatient,
        department: selectedDepartment,
        staffMember: staffMember
      }
    });
  };

  const renderPatientSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <Card 
          key={patient.id} 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => handlePatientSelect(patient)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{patient.first_name[0]}{patient.last_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{patient.first_name} {patient.last_name}</h3>
                {patient.email && <p className="text-sm text-muted-foreground">{patient.email}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderDepartmentSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => (
        <Card 
          key={department.id} 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => handleDepartmentSelect(department)}
        >
          <CardContent className="pt-6">
            <h3 className="font-medium">{department.name}</h3>
            {department.description && (
              <p className="text-sm text-muted-foreground mt-2">{department.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStaffSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {staffMembers.map((staff) => (
        <Card 
          key={staff.id} 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => handleStaffSelect(staff)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{staff.first_name[0]}{staff.last_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{staff.first_name} {staff.last_name}</h3>
                <p className="text-sm text-muted-foreground">{staff.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    switch (step) {
      case 'patient':
        return renderPatientSelection();
      case 'department':
        return renderDepartmentSelection();
      case 'staff':
        return renderStaffSelection();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'patient':
        return 'Select Patient';
      case 'department':
        return 'Select Department';
      case 'staff':
        return 'Select Staff Member';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Schedule Appointment</h2>
          {step !== 'patient' && (
            <Button variant="outline" onClick={() => setStep(step === 'staff' ? 'department' : 'patient')}>
              Back
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{getStepTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ScheduleAppointment;
