import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Bot, Edit, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  isAI?: boolean;
}

const CollaborationPanel = () => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Sarah Wilson',
      content: 'The cart abandonment rate seems high. Should we look into the checkout process?',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      user: 'AI Assistant',
      content: 'Based on the data, I recommend implementing exit-intent popups and simplifying the checkout flow to reduce cart abandonment by 15-20%.',
      timestamp: '1 hour ago',
      isAI: true
    }
  ]);

  const generateAIResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: userMessage,
          context: 'User is analyzing their dashboard data and looking for insights'
        }
      });

      if (error) throw error;

      return data.response || 'I apologize, but I was unable to generate a response at this time.';
    } catch (error) {
      console.error('Error calling AI chat:', error);
      toast({
        title: "AI Assistant Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive"
      });
      return 'I apologize, but I encountered an error. Please try asking your question again.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'John Doe',
      content: newComment,
      timestamp: 'Just now'
    };

    setComments(prev => [...prev, comment]);
    const currentMessage = newComment;
    setNewComment('');

    // Generate AI reply
    const aiResponse = await generateAIResponse(currentMessage);
    const aiReply: Comment = {
      id: (Date.now() + 1).toString(),
      user: 'AI Assistant',
      content: aiResponse,
      timestamp: 'Just now',
      isAI: true
    };
    setComments(prev => [...prev, aiReply]);
  };

  const handleEdit = (commentId: string, currentContent: string) => {
    setEditingId(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, content: editContent }
        : comment
    ));
    setEditingId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    }
  };

  const canModifyComment = (comment: Comment) => {
    return comment.user === 'John Doe' && !comment.isAI;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          AI Collaboration Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className={comment.isAI ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}>
                  {comment.isAI ? <Bot className="w-4 h-4" /> : comment.user.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{comment.user}</span>
                  {comment.isAI && <Badge variant="secondary" className="text-xs">AI</Badge>}
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  {canModifyComment(comment) && (
                    <div className="flex gap-1 ml-auto">
                      {editingId === comment.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveEdit(comment.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="w-3 h-3 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(comment.id, comment.content)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(comment.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingId === comment.id ? (
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(comment.id);
                      } else if (e.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                  />
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">AI Assistant</span>
                  <Badge variant="secondary" className="text-xs">AI</Badge>
                  <span className="text-xs text-gray-500">typing...</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask the AI assistant or add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" disabled={!newComment.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CollaborationPanel;
