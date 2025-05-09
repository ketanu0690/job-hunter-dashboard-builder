import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Bot } from "lucide-react";
import { toast } from "../ui/sonner";

// For TypeScript: declare window.puter
declare global {
  interface Window {
    puter?: any;
  }
}

interface ChatBotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ open, onOpenChange }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([
    {
      role: "assistant",
      content: "Hello! I'm your career assistant. How can I help you today?",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [waiting, setWaiting] = useState(false);
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false });
  const [model, setModel] = useState("gemini-2.0-flash");
  const [streamingFirstChunk, setStreamingFirstChunk] = useState(false);

  useEffect(() => {
    if (open && !window.puter && !document.getElementById("puter-ai-script")) {
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.id = "puter-ai-script";
      document.body.appendChild(script);
    }
  }, [open]);

  useEffect(() => {
    // Scroll to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, open]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || waiting) return;
    const newHistory = [...chatHistory, { role: "user", content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");
    setWaiting(true);
    cancelRef.current.cancelled = false;
    setStreamingFirstChunk(true);

    // Add empty assistant message for streaming
    setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);

    if (window.puter && window.puter.ai && window.puter.ai.chat) {
      try {
        const stream = await window.puter.ai.chat(chatMessage, {
          stream: true,
          model,
        });
        let accumulated = "";
        let gotFirstChunk = false;
        for await (const part of stream) {
          if (cancelRef.current.cancelled) break;
          if (part?.text) {
            accumulated += part.text;
            gotFirstChunk = true;
            setStreamingFirstChunk(false);
            setChatHistory((prev) => {
              // Update only the last assistant message
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: accumulated,
              };
              return updated;
            });
          }
        }
        if (!gotFirstChunk) setStreamingFirstChunk(false);
      } catch (err) {
        if (!cancelRef.current.cancelled) {
          toast.error(
            err?.message === "timeout"
              ? "Sorry, the AI is taking too long to respond. Please try again later."
              : "Sorry, I couldn't get a response from the AI."
          );
          setChatHistory((prev) => {
            const filtered = prev.filter((msg) => msg.content !== "");
            return [
              ...filtered,
              {
                role: "assistant",
                content: "Sorry, I couldn't get a response from the AI.",
              },
            ];
          });
        }
      } finally {
        setWaiting(false);
        setStreamingFirstChunk(false);
      }
    } else {
      // Fallback response logic
      setTimeout(() => {
        if (cancelRef.current.cancelled) return;
        let response = "";
        if (chatMessage.toLowerCase().includes("job")) {
          response =
            "I can help you find job opportunities that match your skills and preferences. What kind of position are you looking for?";
        } else if (chatMessage.toLowerCase().includes("resume")) {
          response =
            "Your resume is crucial in job hunting! Would you like tips on how to optimize it for ATS systems or tailor it for specific roles?";
        } else if (chatMessage.toLowerCase().includes("interview")) {
          response =
            "Preparing for interviews is important. I can share common questions and strategies for different roles. What type of interview are you preparing for?";
        } else {
          response =
            "I'm here to assist with your job search journey. I can help with finding job opportunities, resume optimization, interview preparation, and career advice. What would you like to know more about?";
        }
        if (!response) {
          toast.error("Sorry, I couldn't get a response from the AI.");
        }
        setChatHistory((prev) => {
          const filtered = prev.filter((msg) => msg.content !== "Thinking...");
          return [...filtered, { role: "assistant", content: response }];
        });
        setWaiting(false);
        setStreamingFirstChunk(false);
      }, 1000);
    }
  };

  const handleCancel = () => {
    cancelRef.current.cancelled = true;
    setWaiting(false);
    setStreamingFirstChunk(false);
    setChatHistory((prev) =>
      prev.filter((msg) => msg.content !== "" && msg.content !== "Thinking...")
    );
  };

  // Model options
  const modelOptions = [
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    // Add more models here if needed
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] max-h-[80vh] flex flex-col bg-background border border-border p-0 shadow-xl rounded-2xl overflow-hidden">
        <DialogHeader className="bg-accent/90 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-accent-foreground">
            <Bot size={20} className="text-accent" />
            <span>Career Assistant AI</span>
          </DialogTitle>
          <DialogDescription className="text-accent-foreground/80">
            Your AI-powered career and job search companion
          </DialogDescription>
        </DialogHeader>
        {/* Model selector */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <label htmlFor="model-select" className="text-sm text-foreground/70">
            Model:
          </label>
          <select
            id="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-muted border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={waiting}
          >
            {modelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background"
          style={{ minHeight: 300 }}
        >
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "p-3 rounded-lg max-w-[85%] text-base break-words",
                msg.role === "assistant"
                  ? "bg-accent/10 text-foreground self-start"
                  : "bg-accent text-accent-foreground ml-auto self-end shadow-md"
              )}
              style={{
                borderBottomLeftRadius:
                  msg.role === "assistant" ? 0 : undefined,
                borderBottomRightRadius: msg.role === "user" ? 0 : undefined,
              }}
            >
              {msg.role === "assistant" &&
              i === chatHistory.length - 1 &&
              waiting &&
              streamingFirstChunk ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-accent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                  {waiting && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="ml-2 px-2 py-1 text-xs border-accent text-accent"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ) : msg.content === "Thinking..." ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-accent rounded-full animate-spin"></div>
                  <span>Thinking...</span>
                  {waiting && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="ml-2 px-2 py-1 text-xs border-accent text-accent"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 p-4 border-t border-border bg-background"
        >
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask about jobs, interviews, resumes..."
            className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
            disabled={waiting}
          />
          <Button
            type="submit"
            className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold px-5"
            disabled={!chatMessage.trim() || waiting}
          >
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBot;
