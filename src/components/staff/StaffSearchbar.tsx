import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StaffSearchbarProps {
  onSearch: (query: string) => void;
  onDepartmentFilter: (department: string) => void;
  departments: {id: string, name: string}[];
}

const StaffSearchbar = ({ onSearch, onDepartmentFilter, departments }: StaffSearchbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name, role, or email..." 
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Select 
          defaultValue="all"
          onValueChange={(value) => onDepartmentFilter(value)}
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
        <Button>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default StaffSearchbar;