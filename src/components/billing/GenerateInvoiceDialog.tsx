
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface Treatment {
  id: string;
  name: string;
  cost: number;
}

interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

interface GenerateInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invoice: BillingRecord) => void;
}

const GenerateInvoiceDialog = ({ open, onClose, onSubmit }: GenerateInvoiceDialogProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Predefined treatments with costs
  const treatments: Treatment[] = [
    { id: "T1", name: "General Checkup", cost: 150 },
    { id: "T2", name: "Cardiology Consultation", cost: 275 },
    { id: "T3", name: "MRI Scan", cost: 1200 },
    { id: "T4", name: "X-Ray", cost: 350 },
    { id: "T5", name: "Blood Test", cost: 120 },
    { id: "T6", name: "Physical Therapy (per session)", cost: 180 },
    { id: "T7", name: "Dental Cleaning", cost: 200 },
    { id: "T8", name: "Psychiatric Evaluation", cost: 300 },
    { id: "T9", name: "Allergy Testing", cost: 250 },
    { id: "T10", name: "Endoscopy", cost: 850 }
  ];

  useEffect(() => {
    if (open) {
      fetchPatients();
    }
  }, [open]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name');
      
      if (error) {
        throw error;
      }
      
      setPatients(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load patients",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedPatientId || !selectedTreatmentId) {
      toast({
        title: "Missing information",
        description: "Please select both a patient and a treatment.",
        variant: "destructive",
      });
      return;
    }

    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    const selectedTreatment = treatments.find(t => t.id === selectedTreatmentId);

    if (!selectedPatient || !selectedTreatment) {
      toast({
        title: "Invalid selection",
        description: "Please make valid selections for patient and treatment.",
        variant: "destructive",
      });
      return;
    }

    // Generate random discount between 0-30%
    const discountPercent = Math.floor(Math.random() * 31);
    const discountAmount = (selectedTreatment.cost * discountPercent) / 100;
    const finalAmount = selectedTreatment.cost - discountAmount;

    // Generate a unique invoice ID
    const invoiceId = `B-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
    
    // Current date in ISO format for database
    const currentDate = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Create the new invoice record for UI display
    const newInvoice: BillingRecord = {
      id: invoiceId,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      date: formattedDate,
      description: `${selectedTreatment.name} (Insurance discount: ${discountPercent}%)`,
      amount: finalAmount,
      status: "Pending"
    };

    try {
      // Insert into Supabase billing table
      const { error } = await supabase
        .from('billing')
        .insert({
          id: invoiceId,
          patient_id: selectedPatient.id,
          description: `${selectedTreatment.name} (Insurance discount: ${discountPercent}%)`,
          amount: finalAmount,
          payment_status: 'Pending',
          billing_date: currentDate
        });

      if (error) {
        throw error;
      }

      // Call the onSubmit callback with the new invoice
      onSubmit(newInvoice);
      
      toast({
        title: "Invoice generated",
        description: `Invoice ${invoiceId} has been created for ${selectedPatient.first_name} ${selectedPatient.last_name}.`,
      });

      // Reset form
      setSelectedPatientId("");
      setSelectedTreatmentId("");
    } catch (error: any) {
      toast({
        title: "Failed to create invoice",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate New Invoice</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient" className="text-right">
              Patient
            </Label>
            <div className="col-span-3">
              <Select 
                value={selectedPatientId} 
                onValueChange={setSelectedPatientId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
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
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="treatment" className="text-right">
              Treatment
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedTreatmentId}
                onValueChange={setSelectedTreatmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment" />
                </SelectTrigger>
                <SelectContent>
                  {treatments.map((treatment) => (
                    <SelectItem key={treatment.id} value={treatment.id}>
                      {treatment.name} (${treatment.cost})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedTreatmentId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm text-muted-foreground">
                Base Cost:
              </div>
              <div className="col-span-3">
                ${treatments.find(t => t.id === selectedTreatmentId)?.cost.toFixed(2)}
              </div>
            </div>
          )}
          
          {selectedTreatmentId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm text-muted-foreground">
                Insurance:
              </div>
              <div className="col-span-3 text-sm text-muted-foreground">
                Discount will be randomly calculated (0-30%)
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerateInvoice} disabled={!selectedPatientId || !selectedTreatmentId}>
            Generate Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceDialog;
