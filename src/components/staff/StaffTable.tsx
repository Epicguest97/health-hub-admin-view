import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, CreditCard } from "lucide-react";
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
import { EyeIcon, MoreHorizontal, Calendar, Settings, FileText, Phone, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  department_id?: string;
  department_name?: string;
  hire_date: string;
  status: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

interface StaffTableProps {
  staffMembers: StaffMember[];
}

const StaffTable = ({ staffMembers }: StaffTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Role/Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No staff members found
              </TableCell>
            </TableRow>
          ) : (
            staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={`${staff.first_name} ${staff.last_name}`} />
                      <AvatarFallback>{staff.first_name.charAt(0)}{staff.last_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{staff.first_name} {staff.last_name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {staff.id.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    {staff.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{staff.phone}</span>
                      </div>
                    )}
                    {staff.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-[160px]">{staff.email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{staff.role}</div>
                    <div className="text-muted-foreground">{staff.department_name || 'Unassigned'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      staff.status === "Active" 
                        ? "default" 
                        : staff.status === "On Leave" 
                          ? "outline" 
                          : "secondary"
                    }
                  >
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(staff.hire_date)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* <DropdownMenuItem asChild>
                        <Link to={`/staff/${staff.id}`} className="flex items-center">
                          <EyeIcon className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </Link>
                      </DropdownMenuItem> */}
                      {/* <DropdownMenuItem asChild>
                        <Link to={`/staff/edit/${staff.id}`} className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Edit Details</span>
                        </Link>
                      </DropdownMenuItem> */}
                      {/* <DropdownMenuItem asChild>
                        <Link to={`/staff/schedule/${staff.id}`} className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Manage Schedule</span>
                        </Link>
                      </DropdownMenuItem> */}
                      {/* <DropdownMenuItem asChild>
                        <Link to={`/staff/records/${staff.id}`} className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>View Records</span>
                        </Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem asChild>
                          <Link to={`/appointments/schedule/`} className="flex items-center">
                            <CalendarClock className="mr-2 h-4 w-4" />
                            <span>Schedule Appointment</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/billing`} className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                          </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffTable;