import { type Message } from "@/lib/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TRexMascot from "@/components/trex-mascot";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Couldn't copy the message",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    toast({
      title: "Thanks for the feedback! 💙",
      description: "Your input helps me learn better!",
    });
  };

  if (message.type === "user") {
    return (
      <div className="flex justify-start message-enter">
        <div className="max-w-[80%] bg-[hsl(var(--user-message))] text-[hsl(var(--user-message-foreground))] rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
          <p className="text-sm font-medium" data-testid={`text-user-message-${message.id}`}>{message.content}</p>
          <span className="text-xs opacity-75 mt-1 block">
            {format(new Date(message.createdAt), "h:mm a")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-end space-x-3 message-enter">
      <div className="flex-1 bg-[hsl(var(--ai-message))] text-[hsl(var(--ai-message-foreground))] rounded-2xl rounded-tr-sm px-4 py-3 shadow-md max-w-[80%] ml-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white">Mentor T-Rex</span>
            <span className="badge-pulse text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full font-semibold">
              {message.mode === "ask" ? "Answer" : message.mode === "summarize" ? "Summary" : "Quiz"}
            </span>
          </div>
        </div>

        <div data-testid={`text-ai-message-${message.id}`}>
          {/* Regular answer */}
          {message.mode === "ask" && (
            <p className="text-sm text-white">{message.content}</p>
          )}

          {/* Summary with bullet points */}
          {message.mode === "summarize" && (
            <div>
              <p className="text-sm font-medium text-white mb-3">{message.content}</p>
              {message.metadata?.summaryPoints && (
                <div className="space-y-2">
                  {message.metadata.summaryPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-sm text-white pt-0.5">{point}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 p-3 bg-white/10 border border-white/30 rounded-lg flex items-center space-x-2">
                <span className="text-accent">✓</span>
                <p className="text-xs text-white font-medium">Great job reviewing! Keep it up! 🌟</p>
              </div>
            </div>
          )}

          {/* MCQs */}
          {message.mode === "mcq" && (
            <div>
              <p className="text-sm font-medium text-white mb-4">{message.content}</p>
              {message.metadata?.mcqs && (
                <div className="space-y-3">
                  {message.metadata.mcqs.map((mcq, mcqIndex) => (
                    <div key={mcqIndex} className="bg-white/10 rounded-lg border border-white/20 p-4">
                      <div className="flex items-start space-x-2 mb-3">
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-bold">
                          Q{mcqIndex + 1}
                        </span>
                        <p className="text-sm font-medium text-white flex-1">{mcq.question}</p>
                      </div>
                      <div className="space-y-2">
                        {mcq.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className="px-3 py-2 rounded-lg border border-white/20 cursor-pointer transition-colors hover:bg-white/20 bg-white/5"
                            data-testid={`mcq-option-${mcqIndex}-${option.option}`}
                          >
                            <span className="text-sm text-white">
                              <strong>{option.option})</strong> {option.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 px-3 py-2 bg-accent/20 border border-accent/40 rounded-lg">
                        <p className="text-xs font-semibold text-accent">
                          ✓ Answer: {mcq.correctAnswer}) {mcq.options.find(o => o.option === mcq.correctAnswer)?.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 p-3 bg-white/10 border border-white/30 rounded-lg flex items-center space-x-2">
                <span className="text-secondary">🏆</span>
                <p className="text-xs text-white font-medium">Awesome practice! You're on fire! 🔥 Keep pushing!</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-xs text-white/70 hover:text-white h-6 px-2"
            data-testid={`button-copy-${message.id}`}
          >
            <Copy size={12} className="mr-1" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="text-xs text-white/70 hover:text-white h-6 px-2"
            data-testid={`button-like-${message.id}`}
          >
            <ThumbsUp size={12} className="mr-1" />
            Helpful
          </Button>
        </div>
        <span className="text-xs text-white/70 mt-2 block">
          {format(new Date(message.createdAt), "h:mm a")}
        </span>
      </div>
      <div className="flex-shrink-0">
        <TRexMascot size={50} animate={message.mode === "ask" ? "nod" : message.mode === "summarize" ? "point" : "wave"} />
      </div>
    </div>
  );
}
