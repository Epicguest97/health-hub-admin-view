import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface GenerateInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invoice: any) => void;
}

const GenerateInvoiceDialog = ({ open, onClose, onSubmit }: GenerateInvoiceDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch patients when dialog opens
  useEffect(() => {
    if (open) {
      fetchPatients();
    }
  }, [open]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name');
      
      if (error) throw error;
      
      setPatients(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load patients",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatientId || !description || !amount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Find selected patient details
      const patient = patients.find(p => p.id === selectedPatientId);
      
      // Get current date
      const billingDate = new Date().toISOString();
      
      // Insert new billing record
      const { data, error } = await supabase
        .from('billing')
        .insert({
          patient_id: selectedPatientId,
          description: description,
          amount: parseFloat(amount),
          payment_status: "Pending",
          billing_date: billingDate,
        })
        .select('id');

      if (error) throw error;
      
      const newInvoiceId = data[0].id;
      
      // Create the BillingRecord object for local state update
      const newInvoice = {
        id: newInvoiceId,
        patientId: selectedPatientId,
        patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown',
        date: new Date(billingDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        description: description,
        amount: parseFloat(amount),
        status: "Pending" as const
      };
      
      // Submit the new invoice to the parent component
      onSubmit(newInvoice);
      
      // Reset form
      setDescription("");
      setAmount("");
      setSelectedPatientId("");
      
      toast({
        title: "Invoice created",
        description: `Invoice for ${patient?.first_name} ${patient?.last_name} has been generated.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to create invoice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate New Invoice</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="patient">Patient</Label>
            <Select 
              value={selectedPatientId} 
              onValueChange={setSelectedPatientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description of services"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceDialog;
