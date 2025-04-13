
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Search, Filter, Download, ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  // Mock billing data
  const billingRecords: BillingRecord[] = [
    {
      id: "B-001",
      patientId: "P-001",
      patientName: "John Doe",
      date: "Apr 10, 2025",
      description: "Cardiology Consultation",
      amount: 275.00,
      status: "Paid"
    },
    {
      id: "B-002",
      patientId: "P-002",
      patientName: "Jane Smith",
      date: "Apr 11, 2025",
      description: "MRI Scan",
      amount: 1200.00,
      status: "Pending"
    },
    {
      id: "B-003",
      patientId: "P-003",
      patientName: "David Johnson",
      date: "Apr 5, 2025",
      description: "Cast Removal",
      amount: 150.00,
      status: "Paid"
    },
    {
      id: "B-004",
      patientId: "P-004",
      patientName: "Sarah Williams",
      date: "Apr 7, 2025",
      description: "Pulmonary Function Test",
      amount: 350.00,
      status: "Overdue"
    },
    {
      id: "B-005",
      patientId: "P-005",
      patientName: "Michael Brown",
      date: "Apr 10, 2025",
      description: "Skin Biopsy",
      amount: 225.00,
      status: "Pending"
    },
    {
      id: "B-006",
      patientId: "P-006",
      patientName: "Emily Wilson",
      date: "Apr 12, 2025",
      description: "ECG",
      amount: 185.00,
      status: "Paid"
    },
    {
      id: "B-007",
      patientId: "P-002",
      patientName: "Jane Smith",
      date: "Mar 30, 2025",
      description: "Neurological Examination",
      amount: 320.00,
      status: "Overdue"
    }
  ];

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

  return (
    <MainLayout title="Billing">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing Management</h1>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>Generate Invoice</Button>
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
            {filteredRecords.map((record) => (
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
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default Billing;
