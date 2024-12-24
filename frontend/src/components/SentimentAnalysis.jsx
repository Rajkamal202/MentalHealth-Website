import { useState, useCallback } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Loader2, ThumbsUp, ThumbsDown, Meh, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Progress } from './ui/progress';

export default function SentimentAnalysis() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedActivities, setCompletedActivities] = useState([]);

  const normalizeSentiment = useCallback((sentiment) => {
    // Handle array of sentiments
    if (Array.isArray(sentiment)) {
      return sentiment[0]?.toLowerCase() || 'neutral';
    }
    // Handle string sentiment
    if (typeof sentiment === 'string') {
      return sentiment.toLowerCase();
    }
    // Default fallback
    return 'neutral';
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/analyze`, {
        text,
        stressLevel: 5
      });

      console.log('Raw API Response:', response.data);

      const { sentiment, emotion, recommendations, personalizedResponse } = response.data;

      // Safely handle the sentiment array
      const normalizedSentiment = normalizeSentiment(sentiment);
      
      // Ensure recommendations is always an array
      const normalizedRecommendations = Array.isArray(recommendations) 
        ? recommendations 
        : recommendations 
          ? [recommendations]
          : ['Take a moment to reflect and breathe.'];

      setAnalysis({
        sentiment: normalizedSentiment,
        emotion: typeof emotion === 'string' ? emotion : 'neutral',
        recommendations: normalizedRecommendations,
        personalizedResponse: personalizedResponse || 'Thank you for sharing your feelings.'
      });

      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.response?.data?.message || 'Failed to analyze text. Please try again.');
      toast.error('Analysis failed. Please try again.');
      
      // Set fallback analysis
      setAnalysis({
        sentiment: 'neutral',
        emotion: 'neutral',
        recommendations: ['Take a moment to breathe and reflect.'],
        personalizedResponse: 'I understand you might be going through something. Take a moment for yourself.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivityComplete = async (activity) => {
    if (!activity || typeof activity !== 'string') {
      console.error('Invalid activity:', activity);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/activities/complete`, {
        activity,
        sentiment: analysis?.sentiment || 'neutral',
        completedAt: new Date().toISOString()
      });

      console.log('Activity completion response:', response.data);
      
      setCompletedActivities(prev => [...prev, activity]);
      toast.success('Activity completed! Great job!');
    } catch (error) {
      console.error('Error marking activity as complete:', error);
      toast.error('Failed to mark activity as complete. Please try again.');
    }
  };

  const getSentimentIcon = (sentiment) => {
    const normalizedSentiment = normalizeSentiment(sentiment);
    
    switch (normalizedSentiment) {
      case 'positive':
        return <ThumbsUp className="w-6 h-6 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="w-6 h-6 text-red-500" />;
      default:
        return <Meh className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How are you feeling?</CardTitle>
        <CardDescription>
          Share your thoughts and get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Describe how you're feeling..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleAnalyze} 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 mt-6">
            {/* Sentiment Analysis */}
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium">Detected Sentiment</h3>
                <div className="flex items-center mt-1">
                  {getSentimentIcon(analysis.sentiment)}
                  <span className="ml-2 capitalize">{analysis.sentiment}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">Detected Emotion</h3>
                <p className="mt-1 capitalize">{analysis.emotion}</p>
              </div>
            </div>

            {/* Personalized Response */}
            {analysis.personalizedResponse && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm italic">{analysis.personalizedResponse}</p>
              </div>
            )}

            {/* Recommended Activities */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-4">Recommended Activities</h3>
                <div className="space-y-4">
                  {analysis.recommendations.map((recommendation, index) => (
                    typeof recommendation === 'string' && (
                      <div 
                        key={index}
                        className="bg-muted p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{recommendation}</p>
                          {completedActivities.includes(recommendation) && (
                            <p className="text-sm text-green-500 mt-1">✓ Completed</p>
                          )}
                        </div>
                        {!completedActivities.includes(recommendation) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivityComplete(recommendation)}
                            className="ml-4"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Complete
                          </Button>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Today's Progress</h3>
                <Progress 
                  value={(completedActivities.length / analysis.recommendations.length) * 100} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {completedActivities.length} of {analysis.recommendations.length} activities completed
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}











