'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useEmployees, useEmployeeActions } from '@/stores/employee-store';

export default function PayrollPage() {
  const employees = useEmployees();
  const { getPayslipsByEmployeeId } = useEmployeeActions();

  // For demo purposes, we'll use the first employee
  const currentEmployee = employees[0];

  if (!currentEmployee) {
    return <div>Loading...</div>;
  }

  const payslips = getPayslipsByEmployeeId(currentEmployee.id);

  const latestPayslip = payslips[0];

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Payroll & Payslips</h1>
          <p className="text-muted-foreground">
            View and download your payslips
          </p>
        </div>
      </div>

      {/* Latest Payslip Summary */}
      {latestPayslip && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Latest Payslip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pay Period</p>
                <p className="text-2xl font-bold">{latestPayslip.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                <p className="text-lg font-semibold">
                  {format(new Date(latestPayslip.payDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Net Pay</p>
                <p className="text-2xl font-bold text-primary">
                  ${latestPayslip.netPay.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button asChild>
                <Link href={`/app/payroll/${latestPayslip.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payslip History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Payslip History</h2>
        <div className="grid gap-4">
          {payslips.map((payslip) => (
            <Card key={payslip.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Pay Period
                        </p>
                        <p className="font-semibold">{payslip.period}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Payment Date
                        </p>
                        <p className="font-semibold">
                          {format(new Date(payslip.payDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Gross Pay
                        </p>
                        <p className="font-semibold">
                          $
                          {(
                            payslip.earnings.basicSalary +
                            payslip.earnings.overtime +
                            payslip.earnings.bonus +
                            payslip.earnings.allowances
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Net Pay
                        </p>
                        <p className="text-lg font-bold text-primary">
                          ${payslip.netPay.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/payroll/${payslip.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
