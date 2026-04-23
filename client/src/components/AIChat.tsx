import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
}

export function AIChat({ checkIn, checkOut, guests }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Xin chào! 👋 Tôi là Imperial AI, trợ lý của khách sạn The Imperial Hue. Tôi có thể giúp bạn tìm phòng phù hợp hoặc trả lời các câu hỏi về khách sạn. Bạn cần gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.ai.chat.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        message: inputValue,
        checkIn,
        checkOut,
        guests,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: typeof response.message === "string" ? response.message : JSON.stringify(response.message),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#0D9488] text-white shadow-lg hover:bg-[#0B7E71] transition-all duration-300 flex items-center justify-center hover:scale-110"
        title="AI Chat"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col h-96 md:h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D9488] to-[#0B7E71] text-white p-4 rounded-t-xl">
            <h3 className="font-bold text-lg">Imperial AI Assistant</h3>
            <p className="text-sm text-teal-100">Hỗ trợ 24/7</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === "user"
                      ? "bg-[#F97316] text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#0D9488] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#0D9488] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#0D9488] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập câu hỏi..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D9488]"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-[#F97316] hover:bg-[#EA580C] disabled:bg-gray-300 text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Search Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-4 z-30">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Hỏi AI về phòng..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            onFocus={() => setIsOpen(true)}
          />
          <button className="bg-[#F97316] text-white rounded-lg px-4 py-2">
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
