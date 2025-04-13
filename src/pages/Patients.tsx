
import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PatientSearchbar from "@/components/patients/PatientSearchbar";
import PatientTable from "@/components/patients/PatientTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock patient data
  const patients = [
    {
      id: "P-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      phone: "(555) 123-4567",
      email: "john.doe@example.com",
      address: "123 Main St, Anytown, CA",
      dateRegistered: "Mar 15, 2025",
      status: "Admitted" as const,
      department: "Cardiology"
    },
    {
      id: "P-002",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      phone: "(555) 987-6543",
      email: "jane.smith@example.com",
      address: "456 Oak Ave, Somewhere, CA",
      dateRegistered: "Apr 2, 2025",
      status: "Outpatient" as const,
      department: "Neurology"
    },
    {
      id: "P-003",
      name: "David Johnson",
      age: 28,
      gender: "Male",
      phone: "(555) 456-7890",
      email: "david.johnson@example.com",
      address: "789 Pine St, Nowhere, CA",
      dateRegistered: "Apr 5, 2025",
      status: "Discharged" as const,
      department: "Orthopedics"
    },
    {
      id: "P-004",
      name: "Sarah Williams",
      age: 51,
      gender: "Female",
      phone: "(555) 234-5678",
      email: "sarah.williams@example.com",
      address: "321 Elm St, Anywhere, CA",
      dateRegistered: "Apr 7, 2025",
      status: "Admitted" as const,
      department: "Pulmonology"
    },
    {
      id: "P-005",
      name: "Michael Brown",
      age: 37,
      gender: "Male",
      phone: "(555) 876-5432",
      email: "michael.brown@example.com",
      address: "654 Maple Ave, Somewhere, CA",
      dateRegistered: "Apr 10, 2025",
      status: "Outpatient" as const,
      department: "Dermatology"
    },
    {
      id: "P-006",
      name: "Emily Wilson",
      age: 29,
      gender: "Female",
      phone: "(555) 345-6789",
      email: "emily.wilson@example.com",
      address: "987 Cedar St, Anywhere, CA",
      dateRegistered: "Apr 12, 2025",
      status: "Admitted" as const,
      department: "Cardiology"
    },
    {
      id: "P-007",
      name: "Thomas Miller",
      age: 42,
      gender: "Male",
      phone: "(555) 789-0123",
      email: "thomas.miller@example.com",
      address: "852 Birch Ave, Nowhere, CA",
      dateRegistered: "Apr 13, 2025",
      status: "Discharged" as const,
      department: "Neurology"
    }
  ];

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <PatientSearchbar onSearch={setSearchQuery} />
        
        <PatientTable patients={filteredPatients} />
      </div>
    </MainLayout>
  );
};

export default Patients;
