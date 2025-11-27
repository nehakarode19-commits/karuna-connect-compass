import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { EvaluatorSidebar } from "@/components/evaluator/EvaluatorSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import karunaLogo from "@/assets/karuna-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface EvaluatorLayoutProps {
  children: ReactNode;
}

export function EvaluatorLayout({ children }: EvaluatorLayoutProps) {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  // DEMO MODE: Authentication check disabled for client presentation
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   } else if (userRole !== "evaluator") {
  //     navigate("/");
  //   }
  // }, [user, userRole, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // DEMO MODE: Removed authentication guard for client presentation
  // if (!user || userRole !== "evaluator") {
  //   return null;
  // }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EvaluatorSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <img src={karunaLogo} alt="Karuna International" className="h-10 w-auto hidden md:block" />
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          EV
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 container py-6 px-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
