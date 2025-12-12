"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

interface Payment {
  id: string;
  date: string;
  time: string;
  name: string;
  amount: string;
  paid: boolean;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
  createdAt: string;
}

export default function PaymentSheetPage() {
  const [open, setOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !editingPayment) {
      const today = new Date();
      setDate(today.toISOString().split("T")[0]);
      setTime(today.toTimeString().slice(0, 5));
    }
    if (!isOpen) {
      setEditingPayment(null);
      setName("");
      setAmount("");
      setDate("");
      setTime("");
    }
    setOpen(isOpen);
  };

  const handleRowClick = (payment: Payment) => {
    setEditingPayment(payment);
    setName(payment.name);
    setAmount(payment.amount);
    // Extract just the date part (before T) for the input
    setDate(payment.date.split("T")[0]);
    setTime(payment.time);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPayment
        ? `${process.env.NEXT_PUBLIC_API_URL}/payments/${editingPayment.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/payments`;
      const method = editingPayment ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date,
          time,
          name,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment");
      }

      setOpen(false);
      setEditingPayment(null);
      setName("");
      setAmount("");
      setDate("");
      setTime("");
      fetchPayments();
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    // Extract just the date part (before T) and parse as local date
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString();
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const markAsPaid = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${id}/paid`, {
        method: "PATCH",
        credentials: "include",
      });
      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error("Error marking payment as paid:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Payment Sheet</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPayment ? "Edit Payment" : "Add Payment"}</DialogTitle>
              <DialogDescription>
                {editingPayment ? "Update the payment details below." : "Enter the payment details below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingPayment ? "Update Payment" : "Save Payment"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-muted-foreground">No payments yet. Add your first payment above.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="cursor-pointer" onClick={() => handleRowClick(payment)}>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>{payment.time}</TableCell>
                <TableCell>{payment.name}</TableCell>
                <TableCell className="text-right">{formatAmount(payment.amount)} - or package</TableCell>
                <TableCell>
                  {payment.paid ? (
                    "Yes"
                  ) : (
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); markAsPaid(payment.id); }}>
                      Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
