import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Heart, Brain, Smile, Award, MessageSquare, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import EnhancedFooter from '../components/Footer'

export default function Home() {
  const [mood, setMood] = useState(3)
  const [chatMessage, setChatMessage] = useState('')
  const [chatResponses, setChatResponses] = useState([
    { sender: 'ai', message: "Hello! How can I assist you with your mental health today?" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatResponses])

  const handleMoodChange = (newMood) => {
    setMood(newMood)
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      const userMessage = { sender: 'user', message: chatMessage }
      setChatResponses(prev => [...prev, userMessage])
      setChatMessage('')
      setIsTyping(true)

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai-chat/chat`, { message: chatMessage })
        const aiMessage = { sender: 'ai', message: response.data.message }
        setChatResponses(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('Error sending message:', error)
        toast.error('Failed to get AI response. Please try again.')
      } finally {
        setIsTyping(false)
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-primary/10 py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                Your Journey to Better Mental Health Starts Here
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Track your daily mood, manage stress levels, and build healthy mental habits with our easy-to-use platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="text-lg">
                    Start Your Journey
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
            <div className="relative lg:block hidden">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"
              />
              <img
                src="/calm1.jpg"
                alt="Mental Health Illustration"
                className="relative z-10 w-full h-auto rounded-lg shadow-2xl"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Interaction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Experience Our Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mood Tracker */}
            <div className="bg-primary/5 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Live Mood Tracker</h3>
              <p className="mb-4">How are you feeling right now?</p>
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleMoodChange(value)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                      mood === value ? 'bg-primary text-white scale-110' : 'bg-primary/10 hover:bg-primary/20'
                    }`}
                  >
                    {value <= 2 ? '😔' : value === 3 ? '😐' : '😊'}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center">
                You're feeling {mood <= 2 ? 'down' : mood === 3 ? 'okay' : 'great'}. 
                {mood <= 3 ? " Remember, it's okay to have off days." : " That's wonderful!"}
              </p>
            </div>

            {/* AI Chat Preview */}
            <div className="bg-secondary/5 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">AI Support Preview</h3>
              <div className="h-48 overflow-y-auto mb-4 p-4 bg-white rounded shadow-inner">
                {chatResponses.map((chat, index) => (
                  <div key={index} className={`mb-2 ${chat.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${
                      chat.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {chat.message}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="text-left">
                    <span className="inline-block p-2 rounded-lg bg-secondary text-secondary-foreground">
                      AI is typing...
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask our AI a question..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={isTyping}>Send</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-accent/40 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: 50000, label: 'Active Users' },
              { icon: MessageSquare, value: 1000000, label: 'AI Conversations' },
              { icon: TrendingUp, value: 85, label: 'Improvement Rate', suffix: '%' },
              { icon: Award, value: 10, label: 'Industry Awards' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  separator=","
                  suffix={stat.suffix || ''}
                  className="text-4xl font-bold text-primary"
                />
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="group bg-primary/5 rounded-2xl p-6 h-full shadow-lg transition-all duration-300 hover:bg-primary/10"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Gain deep insights into your mental health patterns with our advanced AI-powered analytics.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="group bg-secondary/5 rounded-2xl p-6 h-full shadow-lg transition-all duration-300 hover:bg-secondary/10"
            >
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
              <p className="text-muted-foreground">
                Receive tailored mental wellness plans based on your unique needs and goals.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="group bg-accent/5 rounded-2xl p-6 h-full shadow-lg transition-all duration-300 hover:bg-accent/10"
            >
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Smile className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Expert Support</h3>
              <p className="text-muted-foreground">
                Connect with licensed therapists and mental health experts anytime, anywhere.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Start Your Mental Health Journey Today</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of others who are taking control of their mental well-being
            </p>
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg bg-white text-primary hover:bg-white/90"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <EnhancedFooter/>
    </div>
  )
}









