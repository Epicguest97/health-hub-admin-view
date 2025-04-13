
import { Search } from "lucide-react";
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
}

const PatientSearchbar = ({ onSearch }: PatientSearchbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search patients..." 
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="admitted">Admitted</SelectItem>
            <SelectItem value="outpatient">Outpatient</SelectItem>
            <SelectItem value="discharged">Discharged</SelectItem>
          </SelectContent>
        </Select>
        <Button>Filter</Button>
      </div>
    </div>
  );
};

export default PatientSearchbar;
