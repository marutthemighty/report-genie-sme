
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Bot } from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  isAI?: boolean;
}

const CollaborationPanel = () => {
  const [newComment, setNewComment] = useState('');
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
    },
    {
      id: '3',
      user: 'Mike Johnson',
      content: 'Great insights! Let\'s implement the exit-intent strategy.',
      timestamp: '45 minutes ago'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'John Doe',
      content: newComment,
      timestamp: 'Just now'
    };

    setComments([...comments, comment]);
    setNewComment('');

    // Simulate AI reply
    setTimeout(() => {
      const aiReply: Comment = {
        id: (Date.now() + 1).toString(),
        user: 'AI Assistant',
        content: 'I can help analyze this further. Would you like me to generate a detailed conversion funnel report?',
        timestamp: 'Just now',
        isAI: true
      };
      setComments(prev => [...prev, aiReply]);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Collaboration
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
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CollaborationPanel;
