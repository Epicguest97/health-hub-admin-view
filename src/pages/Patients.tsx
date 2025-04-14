
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PatientSearchbar from "@/components/patients/PatientSearchbar";
import PatientTable, { Patient } from "@/components/patients/PatientTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // First cast to unknown, then to Patient[] to satisfy TypeScript
        setPatients((data || []) as unknown as Patient[]);
      } catch (error: any) {
        toast({
          title: "Failed to load patients",
          description: error.message,
          variant: "destructive",
        });
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, [toast]);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient.id && patient.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient.phone && String(patient.phone).toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGender = genderFilter === "all" || patient.gender.toLowerCase() === genderFilter.toLowerCase();
    
    return matchesSearch && matchesGender;
  });

  return (
    <MainLayout title="Patients">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Directory</h1>
        <Button asChild>
          <Link to="/register-patient">
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Patient
          </Link>
        </Button>
      </div>
      
      <div className="space-y-6">
        <PatientSearchbar 
          onSearch={setSearchQuery} 
          onGenderFilter={setGenderFilter} 
        />
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading patients...</p>
            </div>
          </div>
        ) : (
          <PatientTable patients={filteredPatients} />
        )}
      </div>
    </MainLayout>
  );
};

export default Patients;
