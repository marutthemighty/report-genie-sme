
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp } from 'lucide-react';

const AIFeedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', { rating, feedback });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ThumbsUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-medium text-green-700 dark:text-green-400">
            Thank you for your feedback!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your input helps us improve our AI insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rate AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            How helpful were the AI insights?
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Additional feedback (optional)
          </label>
          <Textarea
            placeholder="Tell us how we can improve our AI insights..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0}
          className="w-full"
        >
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIFeedback;
