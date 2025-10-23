'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LeaveBalanceCard } from '@/components/leave/leave-balance-card';
import { LeaveRequestForm } from '@/components/leave/leave-request-form';
import { LeaveRequestsTable } from '@/components/leave/leave-requests-table';
import { Calendar, Plus } from 'lucide-react';
import { useEmployees, useEmployeeActions } from '@/stores/employee-store';

export default function LeavePage() {
  const employees = useEmployees();
  const { getPendingLeaveRequests } = useEmployeeActions();

  // For demo purposes, we'll use the first employee
  const currentEmployee = employees[0];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingRequests = getPendingLeaveRequests();

  if (!currentEmployee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">
              Manage your leave requests and view balances
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Request Leave</DialogTitle>
              <DialogDescription>
                Submit a new leave request. Your manager will review and approve it.
              </DialogDescription>
            </DialogHeader>
            <LeaveRequestForm
              employeeId={currentEmployee.id}
              employeeName={currentEmployee.name}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Balances */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Leave Balances</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {currentEmployee.leaveBalances.map((balance) => (
            <LeaveBalanceCard key={balance.leaveType} balance={balance} />
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Leave Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentEmployee.leaveBalances.reduce(
                (acc, bal) => acc + bal.remaining,
                0
              )}{' '}
              days
            </div>
            <p className="text-xs text-muted-foreground">
              Across all leave types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentEmployee.leaveBalances.reduce(
                (acc, bal) => acc + bal.used,
                0
              )}{' '}
              days
            </div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <LeaveRequestsTable />
    </div>
  );
}
