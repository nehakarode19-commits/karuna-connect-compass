import { ClipboardCheck, LayoutDashboard, Trophy, School, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/evaluator/dashboard", icon: LayoutDashboard },
  { title: "Review Submissions", url: "/evaluator/submissions", icon: ClipboardCheck },
  { title: "Leaderboard", url: "/evaluator/leaderboard", icon: Trophy },
  { title: "Schools", url: "/evaluator/schools", icon: School },
  { title: "Students", url: "/evaluator/students", icon: Users },
];

export function EvaluatorSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Evaluator Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="flex items-center gap-3" activeClassName="bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
