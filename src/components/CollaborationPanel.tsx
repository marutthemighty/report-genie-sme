
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Clock,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  user_id: string;
  is_ai: boolean;
  created_at: string;
  updated_at: string;
}

const CollaborationPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('collaboration_comments')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isAIResponding) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Add user message to database
      const { data: userMessage, error: userError } = await supabase
        .from('collaboration_comments')
        .insert([{
          content: messageContent,
          user_id: `user-${Date.now()}`,
          is_ai: false
        }])
        .select()
        .single();

      if (userError) {
        console.error('Error saving user message:', userError);
        throw userError;
      }

      // Update local state immediately
      setMessages(prev => [...prev, userMessage]);
      setIsAIResponding(true);

      // Simple AI response simulation
      setTimeout(async () => {
        try {
          const aiResponse = `I understand you're asking about "${messageContent}". Based on your analytics data, I'd recommend focusing on improving user engagement metrics and optimizing your conversion funnel. Would you like me to analyze specific data points for you?`;

          const { data: aiMessage, error: aiError } = await supabase
            .from('collaboration_comments')
            .insert([{
              content: aiResponse,
              user_id: 'ai-assistant',
              is_ai: true
            }])
            .select()
            .single();

          if (aiError) {
            console.error('Error saving AI message:', aiError);
            throw aiError;
          }

          setMessages(prev => [...prev, aiMessage]);

        } catch (aiError: any) {
          console.error('AI response error:', aiError);
          
          const errorMessage = 'I encountered an issue processing your request. Please try again.';

          const { data: errorAiMessage } = await supabase
            .from('collaboration_comments')
            .insert([{
              content: errorMessage,
              user_id: 'ai-assistant',
              is_ai: true
            }])
            .select()
            .single();

          if (errorAiMessage) {
            setMessages(prev => [...prev, errorAiMessage]);
          }

          toast({
            title: "AI Assistant Error",
            description: errorMessage,
            variant: "destructive"
          });
        } finally {
          setIsAIResponding(false);
        }
      }, 1500);

    } catch (error: any) {
      console.error('Send message error:', error);
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsAIResponding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Ask me anything about your analytics, reports, or data insights!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.is_ai ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.is_ai ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}>
                      {message.is_ai ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 ${message.is_ai ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`inline-block max-w-[80%] p-3 rounded-lg ${
                        message.is_ai
                          ? 'bg-blue-50 text-blue-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isAIResponding && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-blue-50 text-blue-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your data, reports, or analytics..."
              disabled={isAIResponding}
              className="flex-1 min-h-[44px] max-h-32 px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              rows={1}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || isAIResponding}
              size="icon"
              className="h-11 w-11 flex-shrink-0"
            >
              {isAIResponding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationPanel;
