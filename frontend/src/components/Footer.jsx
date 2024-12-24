import { Mail, Facebook, Twitter, Instagram, Linkedin, Heart, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { toast } from 'react-hot-toast'

export default function EnhancedFooter() {
  const handleSubscribe = (e) => {
    e.preventDefault()
    // You can implement the actual subscription logic here
    toast.success('Thank you for subscribing!')
  }

  return (
    <footer className="bg-gradient-to-b from-accent/40 via-accent/20 to-background border-t">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl transform -skew-y-2" />
          <div className="relative grid lg:grid-cols-2 gap-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                Get the support you need
              </h2>
              <p className="text-muted-foreground text-lg">
                Join our community of mindful individuals. Receive weekly insights and mental wellness resources.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-background"
                  required
                />
                <Button type="submit" className="group">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="consent" required />
                <label htmlFor="consent" className="text-sm text-muted-foreground">
                  I consent to receiving mental wellness resources and newsletter updates
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary">Explore</h3>
            <ul className="space-y-3">
              {['Dashboard', 'Daily Check-in', 'Resources', 'Community', 'Blog'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    {item}
                    <ArrowRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary">Support</h3>
            <ul className="space-y-3">
              {['Help Center', 'Crisis Support', 'Contact Us', 'FAQs'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    {item}
                    <ArrowRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary">Legal</h3>
            <ul className="space-y-3">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Cookie Policy',
                'HIPAA Compliance'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    {item}
                    <ExternalLink className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-primary mb-4">Connect</h3>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' }
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Contact Us</h4>
              <a 
                href="mailto:support@mindful.com" 
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                support@mindful.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-primary/10">
          <div className="flex items-center mb-4 md:mb-0 group">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-2 group-hover:bg-primary/20 transition-colors">
              <span className="text-primary text-xl font-bold">M</span>
            </div>
            <span className="font-semibold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Mindful
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left flex items-center">
              © {new Date().getFullYear()} Mindful. Made with{' '}
              <Heart className="inline-block h-4 w-4 mx-1 text-red-500 animate-pulse" />{' '}
              for mental wellness.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}


