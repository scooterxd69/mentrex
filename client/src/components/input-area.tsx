import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, FileText, ClipboardList, Send, Paperclip, Trash2, Info } from "lucide-react";

interface InputAreaProps {
  onSendMessage: (content: string, mode: "ask" | "summarize" | "mcq") => void;
  onClearChat: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function InputArea({ onSendMessage, onClearChat, isLoading, disabled }: InputAreaProps) {
  const [inputText, setInputText] = useState("");
  const [activeMode, setActiveMode] = useState<"ask" | "summarize" | "mcq">("ask");

  const handleSend = () => {
    if (!inputText.trim() || disabled) return;
    
    onSendMessage(inputText.trim(), activeMode);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    switch (activeMode) {
      case "ask":
        return "Ask a question about any topic...";
      case "summarize":
        return "Paste your notes here to get a summary...";
      case "mcq":
        return "Enter a topic to generate practice questions...";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Button 
          size="sm"
          variant={activeMode === "ask" ? "default" : "secondary"}
          onClick={() => setActiveMode("ask")}
          className="text-xs"
          data-testid="button-mode-ask"
        >
          <MessageCircle size={12} className="mr-1" />
          Ask
        </Button>
        <Button 
          size="sm"
          variant={activeMode === "summarize" ? "default" : "secondary"}
          onClick={() => setActiveMode("summarize")}
          className="text-xs"
          data-testid="button-mode-summarize"
        >
          <FileText size={12} className="mr-1" />
          Summarize
        </Button>
        <Button 
          size="sm"
          variant={activeMode === "mcq" ? "default" : "secondary"}
          onClick={() => setActiveMode("mcq")}
          className="text-xs"
          data-testid="button-mode-mcq"
        >
          <ClipboardList size={12} className="mr-1" />
          MCQ
        </Button>
      </div>
      
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={getPlaceholder()}
            rows={3}
            disabled={disabled}
            className="resize-none"
            data-testid="textarea-input"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || disabled}
            size="icon"
            className="h-12 w-12"
            data-testid="button-send-message"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12"
            disabled={disabled}
            data-testid="button-attach-file"
          >
            <Paperclip size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground flex items-center">
          <Info size={12} className="mr-1" />
          Powered by Hugging Face AI • flan-t5-base
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-foreground h-6"
            data-testid="button-clear-chat"
          >
            <Trash2 size={12} className="mr-1" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
