
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  department_id?: string;
  department_name?: string;
  hire_date: string;
  status: string; // Changed from specific union type to string to match database
  address?: string;
  created_at: string;
  updated_at: string;
}

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStaffAndDepartments = async () => {
      setIsLoading(true);
      try {
        // Fetch departments
        const { data: departmentsData, error: departmentsError } = await supabase
          .from('departments')
          .select('id, name');
        
        if (departmentsError) {
          throw departmentsError;
        }
        
        setDepartments(departmentsData || []);
        
        // Fetch staff with department information
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select(`
            *,
            departments:department_id (name)
          `);
        
        if (staffError) {
          throw staffError;
        }
        
        // Transform the data to include department_name
        const transformedStaff = staffData?.map(staff => ({
          ...staff,
          department_name: staff.departments?.name || 'Unassigned'
        })) || [];
        
        setStaffMembers(transformedStaff as StaffMember[]);
      } catch (error: any) {
        toast({
          title: "Failed to load staff data",
          description: error.message,
          variant: "destructive",
        });
        console.error('Error fetching staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStaffAndDepartments();
  }, [toast]);

  // Filter staff members based on search query and department filter
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = 
      `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      staff.department_name?.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

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
                <SelectItem key={department.id} value={department.name.toLowerCase()}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading staff data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <Card key={staff.id}>
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt={`${staff.first_name} ${staff.last_name}`} />
                    <AvatarFallback className="text-lg">{staff.first_name.charAt(0)}{staff.last_name.charAt(0)}</AvatarFallback>
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
                  <h3 className="font-semibold text-lg">{staff.first_name} {staff.last_name}</h3>
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
                  <p className="text-sm mt-2">{staff.department_name}</p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{staff.email}</span>
                  </div>
                  {staff.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{staff.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">Hired: {formatDate(staff.hire_date)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Staff;
