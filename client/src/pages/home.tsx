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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-accent to-secondary border-b-4 border-secondary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="transform hover:scale-110 transition-transform">
                <TRexMascot size={60} animate="wave" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white drop-shadow-md">Mentrex</h1>
                <p className="text-sm text-white/90 font-medium">🦖 Your Mentor T-Rex Study Buddy</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="text-sm font-bold text-white">Ready to Learn! 🔥</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                data-testid="button-toggle-sidebar"
                className="text-white hover:bg-white/20"
              >
                <Menu size={18} />
              </Button>
            </div>

            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                data-testid="button-toggle-mobile-sidebar"
                className="text-white hover:bg-white/20"
              >
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <aside className={`
            lg:col-span-1 space-y-4 
            lg:relative lg:translate-x-0 lg:z-auto
            ${isSidebarOpen ? 'fixed top-0 left-0 h-full w-80 bg-background z-50 p-4 transform translate-x-0' : 'fixed top-0 left-0 h-full w-80 bg-background z-50 p-4 transform -translate-x-full lg:translate-x-0'}
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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-t-2 border-primary/20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <TRexMascot size={40} animate="none" />
              <span className="text-sm text-foreground font-medium">© 2024 Mentrex. Built with 💚 for students by Mentor T-Rex</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
