import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StaffSearchbar from "@/components/staff/StaffSearchbar";
import StaffTable, { StaffMember } from "@/components/staff/StaffTable";

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
        <Button asChild>
          <Link to="/register-staff">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Link>
        </Button>
      </div>
      
      <div className="space-y-6">
        <StaffSearchbar 
          onSearch={setSearchQuery}
          onDepartmentFilter={setDepartmentFilter}
          departments={departments}
        />
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading staff data...</p>
            </div>
          </div>
        ) : (
          <StaffTable staffMembers={filteredStaff} />
        )}
      </div>
    </MainLayout>
  );
};

export default Staff;
