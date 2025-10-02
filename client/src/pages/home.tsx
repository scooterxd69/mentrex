import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getMessages } from "@/lib/api";
import ChatInterface from "@/components/chat-interface";
import Sidebar from "@/components/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TRexMascot from "@/components/trex-mascot";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages"],
    queryFn: () => getMessages(),
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TRexMascot size={50} animate="wave" />
              <div>
                <h2 className="text-2xl font-bold">Chat with Mentrex</h2>
                <p className="text-sm text-muted-foreground">Your AI study companion is ready to help!</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <aside className={`
            lg:col-span-1 
            lg:relative lg:translate-x-0 lg:z-auto
            ${isSidebarOpen ? 'fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-background z-50 p-4 transform translate-x-0 border-r' : 'fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-background z-50 p-4 transform -translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-in-out
          `}>
            <Sidebar />
          </aside>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <ChatInterface messages={messages} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
