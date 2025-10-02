import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, FileText, ClipboardList, Lightbulb, Book, Rocket, Sparkles } from "lucide-react";
import TRexMascot from "@/components/trex-mascot";

interface SidebarProps {
  onModeSelect?: (mode: "ask" | "summarize" | "mcq") => void;
}

export default function Sidebar({ onModeSelect }: SidebarProps) {
  const recentTopics = [
    "Photosynthesis",
    "Quadratic Equations", 
    "Cell Division",
    "Newton's Laws",
    "Chemical Bonding"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center mb-2">
        <TRexMascot size={100} animate="point" />
      </div>
      
      <Card className="border-2 border-primary/30 shadow-lg">
        <CardContent className="pt-4">
          <h2 className="text-base font-extrabold text-foreground mb-3 flex items-center">
            <Rocket className="text-primary mr-2" size={20} />
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Button 
              className="w-full feature-card bg-primary text-primary-foreground hover:bg-primary/90 justify-start font-bold shadow-md hover:shadow-lg transition-all"
              onClick={() => onModeSelect?.("ask")}
              data-testid="button-ask-question"
            >
              <MessageCircle size={18} className="mr-2" />
              Ask Question
            </Button>
            <Button 
              className="w-full feature-card bg-secondary text-secondary-foreground hover:bg-secondary/90 justify-start font-bold shadow-md hover:shadow-lg transition-all"
              onClick={() => onModeSelect?.("summarize")}
              data-testid="button-summarize"
            >
              <FileText size={18} className="mr-2" />
              Summarize Notes
            </Button>
            <Button 
              className="w-full feature-card bg-accent text-accent-foreground hover:bg-accent/90 justify-start font-bold shadow-md hover:shadow-lg transition-all"
              onClick={() => onModeSelect?.("mcq")}
              data-testid="button-generate-mcq"
            >
              <ClipboardList size={18} className="mr-2" />
              Generate MCQs
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-br from-secondary/20 via-accent/20 to-primary/20 rounded-xl p-4 border-2 border-secondary/30 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <Lightbulb className="text-secondary-foreground" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-1 flex items-center">
              Study Tip <Sparkles className="ml-1" size={14} />
            </h3>
            <p className="text-sm text-foreground font-medium">Break your study sessions into 25-minute chunks with 5-minute breaks!</p>
          </div>
        </div>
      </div>

      <Card className="border-2 border-accent/30 shadow-lg">
        <CardContent className="pt-4">
          <h3 className="text-base font-bold text-foreground mb-3">Recent Topics 📚</h3>
          <div className="space-y-2">
            {recentTopics.map((topic, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 text-sm text-foreground hover:from-primary/10 hover:to-accent/10 cursor-pointer transition-all hover:shadow-md font-medium"
                data-testid={`text-recent-topic-${index}`}
              >
                <Book size={16} className="text-primary" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
