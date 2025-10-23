'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import type { Payslip } from '@/types/employee';

interface PayslipViewerProps {
  payslip: Payslip;
}

export function PayslipViewer({ payslip }: PayslipViewerProps) {
  const grossPay =
    payslip.earnings.basicSalary +
    payslip.earnings.overtime +
    payslip.earnings.bonus +
    payslip.earnings.allowances;

  const totalDeductions =
    payslip.deductions.incomeTax +
    payslip.deductions.socialSecurity +
    payslip.deductions.healthInsurance +
    payslip.deductions.other;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-muted/50">
        <div className="space-y-4">
          {/* Company Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">Company Name</h2>
            <p className="text-sm text-muted-foreground">Payslip</p>
          </div>

          {/* Employee & Period Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Employee Name</p>
              <p className="font-semibold">{payslip.employeeName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Employee Number</p>
              <p className="font-semibold">{payslip.employeeNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-semibold">{payslip.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pay Period</p>
              <p className="font-semibold">{payslip.period}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Date</p>
              <p className="font-semibold">
                {format(new Date(payslip.payDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Earnings Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Earnings</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Basic Salary</span>
              <span className="font-medium">
                ${payslip.earnings.basicSalary.toLocaleString()}
              </span>
            </div>
            {payslip.earnings.overtime > 0 && (
              <div className="flex justify-between text-sm">
                <span>Overtime</span>
                <span className="font-medium">
                  ${payslip.earnings.overtime.toLocaleString()}
                </span>
              </div>
            )}
            {payslip.earnings.bonus > 0 && (
              <div className="flex justify-between text-sm">
                <span>Bonus</span>
                <span className="font-medium">
                  ${payslip.earnings.bonus.toLocaleString()}
                </span>
              </div>
            )}
            {payslip.earnings.allowances > 0 && (
              <div className="flex justify-between text-sm">
                <span>Allowances</span>
                <span className="font-medium">
                  ${payslip.earnings.allowances.toLocaleString()}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Earnings</span>
              <span className="text-green-600">
                ${grossPay.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Deductions Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Deductions</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Income Tax</span>
              <span className="font-medium">
                ${payslip.deductions.incomeTax.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Social Security</span>
              <span className="font-medium">
                ${payslip.deductions.socialSecurity.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Health Insurance</span>
              <span className="font-medium">
                ${payslip.deductions.healthInsurance.toLocaleString()}
              </span>
            </div>
            {payslip.deductions.other > 0 && (
              <div className="flex justify-between text-sm">
                <span>Other Deductions</span>
                <span className="font-medium">
                  ${payslip.deductions.other.toLocaleString()}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Deductions</span>
              <span className="text-red-600">
                ${totalDeductions.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Net Pay Section */}
        <div className="bg-primary/5 p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Net Pay</span>
            <span className="text-3xl font-bold text-primary">
              ${payslip.netPay.toLocaleString()}
            </span>
          </div>
        </div>

        <Separator />

        {/* Year to Date Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Year to Date</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Gross Pay</p>
              <p className="text-lg font-semibold">
                ${payslip.ytd.grossPay.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Deductions</p>
              <p className="text-lg font-semibold">
                ${payslip.ytd.deductions.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Net Pay</p>
              <p className="text-lg font-semibold text-primary">
                ${payslip.ytd.netPay.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
