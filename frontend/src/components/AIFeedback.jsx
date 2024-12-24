import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Bot } from 'lucide-react'

export default function AIFeedback({ feedback }) {
  return (
    <Card className="mt-6 bg-accent text-accent-foreground hover-lift">
      <CardHeader className="flex flex-row items-center gap-2">
        <Bot className="w-6 h-6" />
        <CardTitle>AI Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed">{feedback}</p>
      </CardContent>
    </Card>
  )
}









