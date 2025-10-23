'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PayslipViewer } from '@/components/payroll/payslip-viewer';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { useEmployeeActions } from '@/stores/employee-store';

export default function PayslipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getPayslipById } = useEmployeeActions();

  const payslip = getPayslipById(resolvedParams.id);

  if (!payslip) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Payslip Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The payslip you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/app/payroll">Back to Payroll</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/app/payroll">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payroll
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Payslip Viewer */}
      <PayslipViewer payslip={payslip} />
    </div>
  );
}
