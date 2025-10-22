import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { GridPattern } from "@/components/ui/grid-pattern"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-screen flex flex-col max-h-screen !m-0">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/app">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
            <GridPattern
              width={30}
              height={30}
              className="fill-muted/50 stroke-muted/40"
            />
            <div className="relative z-10 h-full">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </NextIntlClientProvider>
  );
}
