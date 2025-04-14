
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const RecentPatients = () => {
  const recentPatients = [
    {
      id: "P-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      dateAdmitted: "Apr 10, 2025",
      status: "Admitted",
      department: "Cardiology"
    },
    {
      id: "P-002",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      dateAdmitted: "Apr 11, 2025",
      status: "Outpatient",
      department: "Neurology"
    },
    {
      id: "P-003",
      name: "David Johnson",
      age: 28,
      gender: "Male",
      dateAdmitted: "Apr 12, 2025",
      status: "Discharged",
      department: "Orthopedics"
    },
    {
      id: "P-004",
      name: "Sarah Williams",
      age: 51,
      gender: "Female",
      dateAdmitted: "Apr 12, 2025",
      status: "Admitted",
      department: "Pulmonology"
    },
    {
      id: "P-005",
      name: "Michael Brown",
      age: 37,
      gender: "Male",
      dateAdmitted: "Apr 13, 2025",
      status: "Outpatient",
      department: "Dermatology"
    }
  ];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
        <CardDescription>
          {recentPatients.length} recent patients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Admitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}{patient.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {patient.age} yrs, {patient.gender}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      patient.status === "Admitted" 
                        ? "default" 
                        : patient.status === "Discharged" 
                          ? "secondary" 
                          : "outline"
                    }
                  >
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell>{patient.department}</TableCell>
                <TableCell>{patient.dateAdmitted}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/patients/${patient.id}`}>
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View patient</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentPatients;
