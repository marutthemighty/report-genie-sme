
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  AlertCircle,
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please refresh the page.",
          variant: "destructive"
        });
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isAIResponding) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      setConnectionStatus('connecting');
      
      // Add user message to database
      const { data: userMessage, error: userError } = await supabase
        .from('collaboration_comments')
        .insert([{
          content: messageContent,
          user_id: 'user-' + Date.now(), // Temporary user ID
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
      setConnectionStatus('connected');
      setIsAIResponding(true);

      // Call AI service
      try {
        const response = await supabase.functions.invoke('ai-chat', {
          body: {
            message: messageContent,
            context: 'collaboration panel - user seeking help with analytics and reporting'
          }
        });

        if (response.error) {
          console.error('AI service error:', response.error);
          throw new Error(response.error.message || 'AI service unavailable');
        }

        const aiResponse = response.data?.response || 'I apologize, but I could not process your request at the moment. Please try again.';

        // Add AI response to database
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
        
        // Add error message as AI response
        const errorMessage = aiError.message?.includes('rate limit') 
          ? 'I\'m receiving a lot of requests right now. Please wait a moment and try again.'
          : aiError.message?.includes('API') 
          ? 'I\'m temporarily unavailable. Please try again in a few moments.'
          : 'I encountered an issue processing your request. Please try again.';

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
          title: "AI Assistant Unavailable",
          description: errorMessage,
          variant: "destructive"
        });
      }

    } catch (error: any) {
      console.error('Send message error:', error);
      setConnectionStatus('error');
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIResponding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>;
      case 'connecting':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Connecting...</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Connection Error</Badge>;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Assistant
          </div>
          {getConnectionStatusBadge()}
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
                    <AvatarFallback className={message.is_ai ? 'bg-blue-100' : 'bg-gray-100'}>
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
                    <AvatarFallback className="bg-blue-100">
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
          {connectionStatus === 'error' && (
            <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              Connection lost. Some features may not work properly.
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchMessages}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your data, reports, or analytics..."
              disabled={isAIResponding || connectionStatus === 'error'}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || isAIResponding || connectionStatus === 'error'}
              size="icon"
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
