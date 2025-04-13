
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
import { EyeIcon, MoreHorizontal, FileText, CalendarClock, CreditCard, Phone, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_type?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
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
            <TableHead>Age/Gender</TableHead>
            <TableHead>Medical Info</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No patients found
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => {
              // Calculate age from date_of_birth
              const birthDate = new Date(patient.date_of_birth);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }

              return (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={`${patient.first_name} ${patient.last_name}`} />
                        <AvatarFallback>{patient.first_name.charAt(0)}{patient.last_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {patient.id.substring(0, 8)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      {patient.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{patient.phone}</span>
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[160px]">{patient.email}</span>
                        </div>
                      )}
                      {!patient.phone && !patient.email && <span className="text-muted-foreground">No contact info</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{age} years</div>
                      <div className="text-muted-foreground">{patient.gender}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {patient.blood_type && <div>Blood: {patient.blood_type}</div>}
                      {patient.allergies && (
                        <div className="text-muted-foreground truncate max-w-[120px]">
                          Allergies: {patient.allergies}
                        </div>
                      )}
                      {!patient.blood_type && !patient.allergies && (
                        <span className="text-muted-foreground">No info</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(patient.created_at)}</TableCell>
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientTable;
