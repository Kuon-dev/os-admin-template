"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  FileText,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
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

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/app",
        },
        {
          title: "Analytics",
          url: "/app/analytics",
        },
        {
          title: "Reports",
          url: "/app/reports",
        },
      ],
    },
    {
      title: "Management",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Users",
          url: "/app/users",
        },
        {
          title: "Products",
          url: "/app/products",
        },
        {
          title: "Orders",
          url: "/app/orders",
        },
      ],
    },
    {
      title: "CMS",
      url: "/cms",
      icon: FileText,
      items: [
        {
          title: "Pages",
          url: "/cms",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/app/docs",
        },
        {
          title: "Get Started",
          url: "/app/docs/get-started",
        },
        {
          title: "Tutorials",
          url: "/app/docs/tutorials",
        },
        {
          title: "Changelog",
          url: "/app/docs/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/app/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/app/settings",
        },
        {
          title: "Team",
          url: "/app/settings/team",
        },
        {
          title: "Billing",
          url: "/app/settings/billing",
        },
        {
          title: "Limits",
          url: "/app/settings/limits",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
