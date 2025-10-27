"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Bot,
  Command,
  FileText,
  GitBranch,
  LifeBuoy,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('sidebar')

  const data = {
    user: {
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: t('dashboard.title'),
        url: "/app",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: t('dashboard.overview'),
            url: "/app",
          },
          {
            title: t('dashboard.analytics'),
            url: "/app/analytics",
          },
          {
            title: t('dashboard.reports'),
            url: "/app/reports",
          },
        ],
      },
      {
        title: "Dependencies",
        url: "/app/dependencies",
        icon: GitBranch,
      },
      {
        title: t('management.title'),
        url: "#",
        icon: Bot,
        items: [
          {
            title: t('management.users'),
            url: "/app/users",
          },
          {
            title: t('management.products'),
            url: "/app/products",
          },
          {
            title: t('management.orders'),
            url: "/app/orders",
          },
        ],
      },
      {
        title: "Support Tickets",
        url: "/app/support",
        icon: LifeBuoy,
        items: [
          {
            title: "All Tickets",
            url: "/app/support",
          },
          {
            title: "Analytics",
            url: "/app/support/analytics",
          },
        ],
      },
      {
        title: t('cms.title'),
        url: "/app/cms",
        icon: FileText,
        items: [
          {
            title: t('cms.pages'),
            url: "/app/cms",
          },
          {
            title: t('cms.domainSettings'),
            url: "/app/cms/domain-settings",
          },
        ],
      },
      {
        title: "Employees",
        url: "/app/employees",
        icon: Users,
        items: [
          {
            title: "Dashboard",
            url: "/app/employees",
          },
          {
            title: "Schedule",
            url: "/app/schedule",
          },
          {
            title: "Leave Management",
            url: "/app/leave",
          },
          {
            title: "Timesheet",
            url: "/app/timesheet",
          },
          {
            title: "Payroll",
            url: "/app/payroll",
          },
        ],
      },
      {
        title: t('settings.title'),
        url: "/app/settings",
        icon: Settings2,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/app">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Admin Dashboard</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
