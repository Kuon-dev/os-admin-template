"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary/20 select-none">
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-base">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/app">
              <Home className="size-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button variant="outline" size="lg" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
