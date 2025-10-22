"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Bot,
  Command,
  FileText,
  Settings2,
  SquareTerminal,
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
        title: t('cms.title'),
        url: "/cms",
        icon: FileText,
        items: [
          {
            title: t('cms.pages'),
            url: "/cms",
          },
          {
            title: t('cms.domainSettings'),
            url: "/cms/domain-settings",
          },
        ],
      },
      {
        title: t('settings.title'),
        url: "/app/settings",
        icon: Settings2,
        items: [
          {
            title: t('settings.general'),
            url: "/app/settings",
          },
          {
            title: t('settings.team'),
            url: "/app/settings/team",
          },
          {
            title: t('settings.billing'),
            url: "/app/settings/billing",
          },
          {
            title: t('settings.limits'),
            url: "/app/settings/limits",
          },
        ],
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/app">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Admin Dashboard</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
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
