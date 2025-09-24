'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  FilePlus2,
  History,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';

export function DashboardSidebarContent() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard/new-workflow',
      label: 'New Workflow',
      icon: FilePlus2,
    },
    {
      href: '/dashboard/history',
      label: 'History',
      icon: History,
    },
  ];

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            AI Workflow Hub
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  asChild
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
