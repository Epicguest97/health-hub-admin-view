import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GenerateInvoiceDialog from "@/components/billing/GenerateInvoiceDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

const Billing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchBillingRecords();
  }, []);

  const fetchBillingRecords = async () => {
    setIsLoading(true);
    try {
      // Get billing records from Supabase
      const { data: billingData, error: billingError } = await supabase
        .from('billing')
        .select(`
          id,
          patient_id,
          description,
          amount,
          payment_status,
          billing_date,
          payment_date,
          patients(first_name, last_name)
        `);
      
      if (billingError) {
        throw billingError;
      }
      
      // Transform the data to match our BillingRecord interface
      const formattedBillingRecords: BillingRecord[] = (billingData || []).map((record: any) => ({
        id: record.id,
        patientId: record.patient_id,
        patientName: record.patients ? `${record.patients.first_name} ${record.patients.last_name}` : 'Unknown',
        date: new Date(record.billing_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        description: record.description,
        amount: parseFloat(record.amount),
        status: record.payment_status as "Paid" | "Pending" | "Overdue"
      }));
      
      setBillingRecords(formattedBillingRecords);
    } catch (error: any) {
      toast({
        title: "Failed to load billing records",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error fetching billing records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter billing records based on search query
  const filteredRecords = billingRecords.filter((record) =>
    record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalBilled = billingRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalPaid = billingRecords.filter(record => record.status === "Paid").reduce((sum, record) => sum + record.amount, 0);
  const totalPending = billingRecords.filter(record => record.status === "Pending").reduce((sum, record) => sum + record.amount, 0);
  const totalOverdue = billingRecords.filter(record => record.status === "Overdue").reduce((sum, record) => sum + record.amount, 0);

  const handleAddInvoice = (newInvoice: BillingRecord) => {
    // Add the new invoice to our local state
    setBillingRecords(prev => [newInvoice, ...prev]);
    setShowInvoiceDialog(false);
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('billing')
        .update({ 
          payment_status: 'Paid',
          payment_date: new Date().toISOString(),
          payment_method: 'Card' // Default method
        })
        .eq('id', invoiceId);
        
      if (error) throw error;
      
      // Update local state
      setBillingRecords(prev => 
        prev.map(record => 
          record.id === invoiceId 
            ? { ...record, status: "Paid" } 
            : record
        )
      );
      
      toast({
        title: "Invoice updated",
        description: `Invoice ${invoiceId} has been marked as paid.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update invoice",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title="Billing">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing Management</h1>
        <div className="flex gap-3">
          <Button onClick={() => setShowInvoiceDialog(true)}>Generate Invoice</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Billed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBilled.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">${totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${totalOverdue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search billing records..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading billing records...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No billing records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.patientName}</div>
                        <div className="text-sm text-muted-foreground">{record.patientId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>${record.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          record.status === "Paid" 
                            ? "default" 
                            : record.status === "Pending" 
                              ? "outline" 
                              : "secondary"
                        }
                        className={
                          record.status === "Paid" 
                            ? "bg-emerald-500" 
                            : record.status === "Overdue" 
                              ? "bg-red-500" 
                              : ""
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkAsPaid(record.id)}>
                            Mark as Paid
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
      )}
      
      <GenerateInvoiceDialog 
        open={showInvoiceDialog} 
        onClose={() => setShowInvoiceDialog(false)}
        onSubmit={handleAddInvoice}
      />
    </MainLayout>
  );
};

export default Billing;
