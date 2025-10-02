import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import TRexMascot from "@/components/trex-mascot";
import { MessageSquare, FileText, Brain, Sparkles } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  const stats = {
    totalMessages: messages.length,
    questionsAsked: messages.filter((m: any) => m.mode === "ask" && m.type === "user").length,
    textsSummarized: messages.filter((m: any) => m.mode === "summarize" && m.type === "user").length,
    mcqsGenerated: messages.filter((m: any) => m.mode === "mcq" && m.type === "user").length,
  };

  const quickActions = [
    {
      title: "Ask a Question",
      description: "Get instant AI-powered answers",
      icon: MessageSquare,
      mode: "ask",
      color: "text-primary",
    },
    {
      title: "Summarize Notes",
      description: "Convert long text into key points",
      icon: FileText,
      mode: "summarize",
      color: "text-secondary",
    },
    {
      title: "Generate Quiz",
      description: "Create MCQs to test your knowledge",
      icon: Brain,
      mode: "mcq",
      color: "text-accent",
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-muted-foreground">Let's continue your learning journey 🚀</p>
        </div>
        <TRexMascot size={120} animate="wave" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Messages exchanged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Asked</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsAsked}</div>
            <p className="text-xs text-muted-foreground">AI answers provided</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Texts Summarized</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.textsSummarized}</div>
            <p className="text-xs text-muted-foreground">Notes condensed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Generated</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mcqsGenerated}</div>
            <p className="text-xs text-muted-foreground">MCQs created</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.mode} href={`/?mode=${action.mode}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <action.icon className={`h-8 w-8 ${action.color}`} />
                    <div>
                      <CardTitle>{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Tips 📚</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="font-medium">Break complex topics into smaller questions</p>
              <p className="text-sm text-muted-foreground">Ask specific questions to get clearer answers</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-secondary/10 p-2 rounded-full">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <p className="font-medium">Summarize after reading</p>
              <p className="text-sm text-muted-foreground">Use the summarize feature to extract key points from your notes</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-accent/10 p-2 rounded-full">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <p className="font-medium">Test your knowledge regularly</p>
              <p className="text-sm text-muted-foreground">Generate MCQs to reinforce what you've learned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
