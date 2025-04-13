
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Eye, Edit, Filter } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MedicalRecord {
  id: string;
  patient_id: string;
  staff_id: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  record_date: string;
  created_at: string;
  updated_at: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  staff: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

const MedicalRecords = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("medical_records")
        .select(`
          *,
          patient:patient_id(first_name, last_name),
          staff:staff_id(first_name, last_name, role)
        `)
        .order("record_date", { ascending: false });

      if (error) {
        throw error;
      }

      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      toast({
        title: "Error",
        description: "Failed to load medical records.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredRecords = records.filter((record) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const patientName = `${record.patient?.first_name} ${record.patient?.last_name}`.toLowerCase();
    const diagnosis = record.diagnosis?.toLowerCase() || "";
    const treatment = record.treatment?.toLowerCase() || "";
    
    const matchesSearch = 
      patientName.includes(lowerSearchQuery) || 
      diagnosis.includes(lowerSearchQuery) || 
      treatment.includes(lowerSearchQuery);
    
    if (selectedFilter === "all") {
      return matchesSearch;
    } else if (selectedFilter === "recent") {
      // Filter records from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && new Date(record.record_date) >= thirtyDaysAgo;
    }
    
    return matchesSearch;
  });

  return (
    <MainLayout title="Medical Records">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, diagnosis, or treatment..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Select 
              defaultValue="all" 
              onValueChange={setSelectedFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Records" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="recent">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button className="whitespace-nowrap">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading records...
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No medical records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.patient?.first_name} {record.patient?.last_name}
                    </TableCell>
                    <TableCell>
                      {record.diagnosis?.substring(0, 30)}
                      {record.diagnosis?.length > 30 ? "..." : ""}
                    </TableCell>
                    <TableCell>
                      {record.treatment?.substring(0, 30)}
                      {record.treatment?.length > 30 ? "..." : ""}
                    </TableCell>
                    <TableCell>
                      Dr. {record.staff?.first_name} {record.staff?.last_name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.record_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setViewRecord(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Record Modal */}
      <Dialog open={!!viewRecord} onOpenChange={(open) => !open && setViewRecord(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Record
            </DialogTitle>
            <DialogDescription>
              Created on {viewRecord && format(new Date(viewRecord.created_at), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          {viewRecord && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
                  <p className="text-sm text-muted-foreground mb-1">Name:</p>
                  <p className="font-medium mb-4">{viewRecord.patient?.first_name} {viewRecord.patient?.last_name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Provider Information</h3>
                  <p className="text-sm text-muted-foreground mb-1">Doctor:</p>
                  <p className="font-medium mb-1">Dr. {viewRecord.staff?.first_name} {viewRecord.staff?.last_name}</p>
                  <p className="text-sm text-muted-foreground">{viewRecord.staff?.role}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
                <p>{viewRecord.diagnosis || "No diagnosis provided."}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Treatment</h3>
                <p>{viewRecord.treatment || "No treatment provided."}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Prescription</h3>
                <p>{viewRecord.prescription || "No prescription provided."}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p>{viewRecord.notes || "No additional notes."}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MedicalRecords;
