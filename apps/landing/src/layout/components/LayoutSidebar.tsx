// eslint-disable-next-line object-curly-newline
import { LayoutDashboard, Layers, Globe, Server, Database, Terminal, Settings, Bell, Shield, GitBranch, Network, Box, HardDrive } from 'lucide-react';
import { ReactNode } from 'react';

import { NavLink } from './NavLink';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    useSidebar,
} from '@shared/components/sidebar';

const mainNav = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Projects', url: '/projects', icon: Layers },
    { title: 'Deployments', url: '/deployments', icon: Globe },
    { title: 'Servers', url: '/servers', icon: Server },
];

const platformNav = [
    { title: 'Networks', url: '/networks', icon: Network },
    { title: 'Containers', url: '/containers', icon: Box },
    { title: 'Volumes', url: '/volumes', icon: HardDrive },
    { title: 'Databases', url: '/databases', icon: Database },
    { title: 'Logs', url: '/logs', icon: Terminal },
    { title: 'Certificates', url: '/certificates', icon: Shield },
];

const settingsNav = [
    { title: 'Git providers', url: '/git-providers', icon: GitBranch },
    { title: 'Notifications', url: '/notifications', icon: Bell },
    { title: 'Settings', url: '/settings', icon: Settings },
];

/**
 * Sidebar layout component.
 */
export function LayoutSidebar(): ReactNode {
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';

    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
            <SidebarHeader className="px-4 py-5">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <GitBranch className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {!collapsed && <span className="text-base font-semibold text-sidebar-accent-foreground tracking-tight">GitPaaS</span>}
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">
                        Overview
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNav.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            to={item.url}
                                            end={item.url === '/'}
                                            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            activeClassName="bg-sidebar-accent text-primary font-medium"
                                        >
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            {!collapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">
                        Platform
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {platformNav.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            activeClassName="bg-sidebar-accent text-primary font-medium"
                                        >
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            {!collapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">
                        Settings
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsNav.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            activeClassName="bg-sidebar-accent text-primary font-medium"
                                        >
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            {!collapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-4 py-3 border-t border-sidebar-border">
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">A</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-sidebar-accent-foreground truncate">Admin</p>
                            <p className="text-[11px] text-muted-foreground truncate">admin@deploy.io</p>
                        </div>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
