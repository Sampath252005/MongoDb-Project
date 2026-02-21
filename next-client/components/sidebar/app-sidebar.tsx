'use client';

import { AudioWaveform } from 'lucide-react';
import * as React from 'react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import { SidebarLogo } from '@/components/sidebar/SidebarLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'MH Shohan',
    email: 'inventory@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  inventory: {
    name: 'Inventory',
    logo: AudioWaveform,
    plan: 'Enterprise',
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarLogo info={data.inventory} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
