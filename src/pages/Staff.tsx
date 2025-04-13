
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Search, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Terminated";
  imageUrl?: string;
}

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  
  // Mock staff data
  const staffMembers: StaffMember[] = [
    {
      id: "S-001",
      name: "Dr. Robert Chen",
      role: "Cardiologist",
      department: "Cardiology",
      email: "robert.chen@healthadmin.com",
      phone: "(555) 123-0001",
      status: "Active"
    },
    {
      id: "S-002",
      name: "Dr. Sarah Johnson",
      role: "Neurologist",
      department: "Neurology",
      email: "sarah.johnson@healthadmin.com",
      phone: "(555) 123-0002",
      status: "Active"
    },
    {
      id: "S-003",
      name: "Dr. James Williams",
      role: "Orthopedic Surgeon",
      department: "Orthopedics",
      email: "james.williams@healthadmin.com",
      phone: "(555) 123-0003",
      status: "On Leave"
    },
    {
      id: "S-004",
      name: "Dr. Lisa Brown",
      role: "Dermatologist",
      department: "Dermatology",
      email: "lisa.brown@healthadmin.com",
      phone: "(555) 123-0004",
      status: "Active"
    },
    {
      id: "S-005",
      name: "Nurse Amanda Davis",
      role: "Head Nurse",
      department: "Cardiology",
      email: "amanda.davis@healthadmin.com",
      phone: "(555) 123-0005",
      status: "Active"
    },
    {
      id: "S-006",
      name: "Nurse Michael Wong",
      role: "RN",
      department: "Emergency",
      email: "michael.wong@healthadmin.com",
      phone: "(555) 123-0006",
      status: "Active"
    },
    {
      id: "S-007",
      name: "Dr. Emily Rodriguez",
      role: "Pediatrician",
      department: "Pediatrics",
      email: "emily.rodriguez@healthadmin.com",
      phone: "(555) 123-0007",
      status: "Active"
    },
    {
      id: "S-008",
      name: "Dr. David Kim",
      role: "Pulmonologist",
      department: "Pulmonology",
      email: "david.kim@healthadmin.com",
      phone: "(555) 123-0008",
      status: "Terminated"
    }
  ];

  // Filter staff members based on search query and department filter
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      staff.department.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(staffMembers.map(staff => staff.department))];

  return (
    <MainLayout title="Staff Management">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Directory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search staff members..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Select 
            defaultValue="all" 
            onValueChange={(value) => setDepartmentFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department} value={department.toLowerCase()}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={staff.imageUrl || "/placeholder.svg"} alt={staff.name} />
                  <AvatarFallback className="text-lg">{staff.name.charAt(0)}{staff.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Manage Schedule</DropdownMenuItem>
                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold text-lg">{staff.name}</h3>
                <p className="text-muted-foreground">{staff.role}</p>
              </div>
              
              <div className="mt-3">
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
                <p className="text-sm mt-2">{staff.department}</p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{staff.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{staff.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default Staff;
