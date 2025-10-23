'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useEmployeeStore, useEmployeeActions } from '@/stores/employee-store';
import type { LeaveStatus } from '@/types/employee';

const getStatusColor = (status: LeaveStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'approved':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'rejected':
      return 'bg-red-500/10 text-red-700 dark:text-red-400';
    default:
      return '';
  }
};

export function LeaveRequestsTable() {
  const leaveRequests = useEmployeeStore((state) => state.leaveRequests);
  const { approveLeaveRequest, rejectLeaveRequest } = useEmployeeActions();

  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('all');

  const filteredRequests = leaveRequests.filter((req) =>
    statusFilter === 'all' ? true : req.status === statusFilter
  );

  const handleApprove = (id: string, employeeName: string) => {
    approveLeaveRequest(id);
    toast.success(`Leave request for ${employeeName} approved`);
  };

  const handleReject = (id: string, employeeName: string) => {
    rejectLeaveRequest(id);
    toast.error(`Leave request for ${employeeName} rejected`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Leave Requests</h3>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as LeaveStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No leave requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.employeeName}
                  </TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>
                    {format(new Date(request.startDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(request.endDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {request.days} {request.isHalfDay && '(Half)'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(request.appliedDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-green-600 hover:text-green-700"
                          onClick={() =>
                            handleApprove(request.id, request.employeeName)
                          }
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-red-600 hover:text-red-700"
                          onClick={() =>
                            handleReject(request.id, request.employeeName)
                          }
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <div className="text-sm text-muted-foreground">
                        By {request.approvedBy}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
