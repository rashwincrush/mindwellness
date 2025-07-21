import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { Bot, Send, ExternalLink, Phone } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  isAi: boolean;
  timestamp: Date;
  suggestions?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'exercise' | 'contact';
  }>;
}

export function AIChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hi there! I'm your AI wellness companion. I'm here to listen and support you. How are you feeling today?",
      isAi: true,
      timestamp: new Date(),
      suggestions: [
        "I'm feeling anxious about school",
        "I'm having trouble sleeping",
        "I need someone to talk to",
        "Can you help me with stress?"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/ai/chat', {
        message,
        context: messages.slice(-5).map(m => ({ message: m.message, isAi: m.isAi }))
      });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        message: data.message,
        isAi: true,
        timestamp: new Date(),
        suggestions: data.suggestions,
        resources: data.resources
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: "I'm sorry, I'm having trouble connecting right now. If this is urgent, please reach out to a counselor or call the crisis hotline at 988.",
        isAi: true,
        timestamp: new Date(),
        resources: [
          {
            title: "Crisis Text Line",
            url: "sms:741741",
            type: "contact"
          },
          {
            title: "National Suicide Prevention Lifeline",
            url: "tel:988",
            type: "contact"
          }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageToSend,
      isAi: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Get AI response
    chatMutation.mutate(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Phone className="h-4 w-4" />;
      case 'exercise':
        return <Bot className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="text-blue-600 h-6 w-6" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Wellness Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Chat with our AI counselor</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Start Chatting
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>AI Wellness Companion</span>
            <Badge variant="secondary" className="ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Online
            </Badge>
          </DialogTitle>
          <DialogDescription>
            A safe space to share your thoughts and feelings. This AI is trained to provide supportive responses.
          </DialogDescription>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 space-y-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isAi ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isAi
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  
                  {/* AI Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Quick responses:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-2 text-xs"
                          onClick={() => handleSendMessage(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* AI Resources */}
                  {message.resources && message.resources.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Helpful resources:</p>
                      {message.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target={resource.type === 'contact' ? '_self' : '_blank'}
                          className="flex items-center text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          {getResourceIcon(resource.type)}
                          <span className="ml-2">{resource.title}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              className="flex-1"
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={chatMutation.isPending || !inputMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            This AI provides support but is not a replacement for professional counseling. 
            In emergencies, call 911 or text 988 for crisis support.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
