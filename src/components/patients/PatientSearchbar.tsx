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

interface PatientSearchbarProps {
  onSearch: (query: string) => void;
  onGenderFilter: (gender: string) => void; // Add this prop
}

const PatientSearchbar = ({ onSearch, onGenderFilter }: PatientSearchbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name, email, ID, or phone..." 
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Select 
          defaultValue="all"
          onValueChange={(value) => onGenderFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
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

export default PatientSearchbar;
