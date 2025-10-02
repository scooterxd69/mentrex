import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { askQuestion, summarizeText, generateMCQs, clearMessages, type Message } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import MessageBubble from "@/components/message-bubble";
import InputArea from "@/components/input-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trophy } from "lucide-react";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const askMutation = useMutation({
    mutationFn: askQuestion,
    onMutate: () => setIsTyping(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setIsTyping(false);
      toast({
        title: "Question answered!",
        description: "Hope that helps! Keep learning! 🌟",
      });
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "Oops!",
        description: "I'm having trouble right now. Please try again!",
        variant: "destructive",
      });
    },
  });

  const summarizeMutation = useMutation({
    mutationFn: summarizeText,
    onMutate: () => setIsTyping(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setIsTyping(false);
      toast({
        title: "Summary ready!",
        description: "Your notes have been summarized. Great job studying! 💪",
      });
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "Summary failed",
        description: "I couldn't summarize that right now. Try again later!",
        variant: "destructive",
      });
    },
  });

  const mcqMutation = useMutation({
    mutationFn: ({ topic, count }: { topic: string; count: number }) => 
      generateMCQs(topic, count),
    onMutate: () => setIsTyping(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setIsTyping(false);
      toast({
        title: "MCQs generated!",
        description: "Practice questions are ready. You're on fire! 🔥",
      });
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "MCQ generation failed",
        description: "Couldn't create questions right now. Please try again!",
        variant: "destructive",
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearMessages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Chat cleared!",
        description: "Ready for a fresh start! 🚀",
      });
    },
    onError: () => {
      toast({
        title: "Clear failed",
        description: "Couldn't clear the chat right now.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (content: string, mode: "ask" | "summarize" | "mcq") => {
    if (!content.trim()) return;

    switch (mode) {
      case "ask":
        askMutation.mutate(content);
        break;
      case "summarize":
        summarizeMutation.mutate(content);
        break;
      case "mcq":
        const [topic, countStr] = content.split('|');
        const count = parseInt(countStr) || 3;
        mcqMutation.mutate({ topic, count });
        break;
    }
  };

  const isAnyMutationPending = 
    askMutation.isPending || 
    summarizeMutation.isPending || 
    mcqMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl p-8 text-white shadow-2xl border-4 border-secondary/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold mb-3">Hey there, Champion! 👋</h2>
              <p className="text-lg text-white/95 font-medium mb-4">Ready to ace your studies? Let's learn together!</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">Ask Questions 💡</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">Get Summaries 📝</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">Practice MCQs 🎯</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <GraduationCap size={80} className="opacity-30 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <Card className="overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="chat-container scrollbar-hide p-4 space-y-4"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading your chat history...</div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start justify-end space-x-3 message-enter">
              <div className="bg-primary/80 rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-white font-medium">Mentor T-Rex is thinking...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Input Area */}
      <InputArea 
        onSendMessage={handleSendMessage}
        onClearChat={() => clearMutation.mutate()}
        isLoading={isAnyMutationPending}
        disabled={isAnyMutationPending}
      />

      {/* Encouragement Banner */}
      <div className="bg-gradient-to-r from-secondary/30 via-accent/30 to-primary/30 rounded-xl p-5 border-2 border-secondary/40 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-transform">
              <Trophy className="text-secondary-foreground" size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">You're doing amazing!</h3>
              <p className="text-sm text-muted-foreground font-medium">
                {messages.length === 0 
                  ? "Ready to start learning? Ask your first question! 🚀" 
                  : `You've had ${Math.floor(messages.length / 2)} conversations today. Keep crushing it! 💪🔥`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
