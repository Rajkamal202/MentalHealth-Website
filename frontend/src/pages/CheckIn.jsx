import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Slider } from '../components/ui/slider'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { toast } from 'react-hot-toast'
import AIFeedback from '../components/AIFeedback'
import { Smile, Meh, Frown, Brain, Zap } from 'lucide-react'


export default function CheckIn() {
  const [mood, setMood] = useState(3)
  const [stressLevel, setStressLevel] = useState(3)
  const [journal, setJournal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiFeedback, setAIFeedback] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Submit check-in
      await axios.post(`${import.meta.env.VITE_API_URL}/api/check-in`, {
        mood,
        stressLevel,
        journal
      })
      
      // Get AI feedback
      const aiResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/analyze/analyze`, {
        mood,
        stressLevel,
        journal
      })
      
      setAIFeedback(aiResponse.data.feedback)
      toast.success('Check-in submitted successfully')
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting check-in:', error)
      toast.error(error.response?.data?.message || 'Failed to submit check-in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewCheckIn = () => {
    setMood(3)
    setStressLevel(3)
    setJournal('')
    setAIFeedback('')
    setIsSubmitted(false)
  }

  const getMoodIcon = (value) => {
    if (value >= 4) return <Smile className="w-6 h-6 text-green-500" />;
    if (value >= 2.5) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Frown className="w-6 h-6 text-red-500" />;
  }

  const getStressIcon = (value) => {
    if (value <= 2) return <Zap className="w-6 h-6 text-green-500" />;
    if (value <= 3.5) return <Zap className="w-6 h-6 text-yellow-500" />;
    return <Zap className="w-6 h-6 text-red-500" />;
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto hover-lift">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Check-in Submitted</CardTitle>
            <CardDescription className="text-center">
              Thank you for your check-in. Here's your AI feedback:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIFeedback feedback={aiFeedback} />
            <div className="flex justify-center space-x-4 mt-6">
              <Button onClick={handleNewCheckIn} className="hover-lift">New Check-in</Button>
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="hover-lift">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto hover-lift mb-8">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Daily Check-in</CardTitle>
          <CardDescription className="text-center">
            Take a moment to reflect on your day and record how you're feeling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mood" className="text-lg">How's your mood today?</Label>
              <div className="flex items-center space-x-2">
                <Frown className="w-6 h-6 text-muted-foreground" />
                <Slider
                  id="mood"
                  min={1}
                  max={5}
                  step={0.5}
                  value={[mood]}
                  onValueChange={(value) => setMood(value[0])}
                  className="flex-grow"
                />
                <Smile className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex justify-center items-center space-x-2 mt-2">
                {getMoodIcon(mood)}
                <span className="text-2xl font-medium">{mood}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stressLevel" className="text-lg">What's your stress level?</Label>
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-muted-foreground" />
                <Slider
                  id="stressLevel"
                  min={1}
                  max={5}
                  step={0.5}
                  value={[stressLevel]}
                  onValueChange={(value) => setStressLevel(value[0])}
                  className="flex-grow"
                />
                <Brain className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex justify-center items-center space-x-2 mt-2">
                {getStressIcon(stressLevel)}
                <span className="text-2xl font-medium">{stressLevel}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="journal" className="text-lg">How are you feeling today?</Label>
              <Textarea
                id="journal"
                placeholder="Write about your thoughts and feelings..."
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                className="min-h-[120px] resize-none"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full hover-lift"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Check-in'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      
    </div>
  )
}











