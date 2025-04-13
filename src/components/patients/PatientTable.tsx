
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { EyeIcon, MoreHorizontal, FileText, CalendarClock, CreditCard } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  dateRegistered: string;
  status: "Admitted" | "Outpatient" | "Discharged";
  department: string;
}

interface PatientTableProps {
  patients: Patient[];
}

const PatientTable = ({ patients }: PatientTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
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
                <div className="text-sm">
                  <div>{patient.phone}</div>
                  <div className="text-muted-foreground">{patient.email}</div>
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
              <TableCell>{patient.dateRegistered}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/patients/${patient.id}`} className="flex items-center">
                        <EyeIcon className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/medical-records/${patient.id}`} className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Medical Records</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/appointments/schedule/${patient.id}`} className="flex items-center">
                        <CalendarClock className="mr-2 h-4 w-4" />
                        <span>Schedule Appointment</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/billing/${patient.id}`} className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientTable;
