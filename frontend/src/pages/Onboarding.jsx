import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Checkbox } from '../components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { toast } from 'react-hot-toast'
import { AlertCircle } from 'lucide-react'
import { Slider } from '../components/ui/slider'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'

const mentalHealthOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Struggling', label: 'Struggling' },
]

const goalOptions = [
  { id: 'reduce-stress', label: 'Reduce stress' },
  { id: 'improve-sleep', label: 'Improve sleep' },
  { id: 'manage-anxiety', label: 'Manage anxiety' },
  { id: 'boost-mood', label: 'Boost mood' },
  { id: 'increase-self-awareness', label: 'Increase self-awareness' },
]

const sleepPatternOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Struggling', label: 'Struggling' },
]

const socialConnectionOptions = [
  { value: 'Strong', label: 'Strong' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Weak', label: 'Weak' },
  { value: 'Isolated', label: 'Isolated' },
]

const mentalHealthConcerns = [
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'depression', label: 'Depression' },
  { id: 'stress', label: 'Stress' },
  { id: 'insomnia', label: 'Insomnia' },
  { id: 'trauma', label: 'Trauma' },
  { id: 'other', label: 'Other' },
]


export default function Onboarding() {
  const [step, setStep] = useState('form')
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    currentMentalHealth: '',
    joinReason: '',
    goals: [],
    sleepPattern: '',
    stressLevel: 5,
    socialConnection: '',
    mentalHealthConcerns: [],
    exerciseFrequency: '',
    dietQuality: '',
    substanceUse: '',
    copingMechanisms: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.age) errors.age = 'Age is required';
    if (formData.age < 13 || formData.age > 120) errors.age = 'Age must be between 13 and 120';
    if (!formData.currentMentalHealth) errors.currentMentalHealth = 'Please select your current mental health status';
    if (formData.goals.length === 0) errors.goals = 'Please select at least one goal';
    if (!formData.sleepPattern) errors.sleepPattern = 'Please select your sleep pattern';
    if (!formData.socialConnection) errors.socialConnection = 'Please select your social connection level';
    if (formData.mentalHealthConcerns.length === 0) errors.mentalHealthConcerns = 'Please select at least one mental health concern';
    if (!formData.exerciseFrequency) errors.exerciseFrequency = 'Please select your exercise frequency';
    if (!formData.dietQuality) errors.dietQuality = 'Please rate your diet quality';
    if (!formData.substanceUse) errors.substanceUse = 'Please provide information about substance use';
    if (!formData.copingMechanisms) errors.copingMechanisms = 'Please describe your coping mechanisms';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile/onboarding`,
        formData
      );
      setRecommendations(response.data.recommendations);
      setStep('recommendations');
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile');
      if (error.response?.data?.details) {
        setFormErrors({ submit: error.response.data.details });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  }

  const handleMultiSelect = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  }

  if (step === 'recommendations') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">🎉 Welcome aboard, {formData.name}!</CardTitle>
            <CardDescription className="text-center">
              Based on your profile, here are some personalized recommendations to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">{rec.title}</h3>
                <p className="text-muted-foreground">{rec.description}</p>
              </div>
            ))}
            <Button 
              className="w-full" 
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome! Let's get to know you better</CardTitle>
          <CardDescription className="text-center">
            Fill out this form to personalize your experience and help us provide better support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className={formErrors.age ? 'border-red-500' : ''}
                  />
                  {formErrors.age && (
                    <p className="text-sm text-red-500">{formErrors.age}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mental Health Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mental Health Status</h3>
              <div className="space-y-2">
                <Label htmlFor="currentMentalHealth">How would you describe your current mental health?</Label>
                <Select
                  value={formData.currentMentalHealth}
                  onValueChange={(value) => handleChange('currentMentalHealth', value)}
                >
                  <SelectTrigger className={formErrors.currentMentalHealth ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentalHealthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.currentMentalHealth && (
                  <p className="text-sm text-red-500">{formErrors.currentMentalHealth}</p>
                )}
              </div>
            </div>

            {/* Mental Health Concerns */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mental Health Concerns</h3>
              <div className="space-y-2">
                <Label className={formErrors.mentalHealthConcerns ? 'text-red-500' : ''}>
                  What mental health concerns are you currently experiencing? (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mentalHealthConcerns.map(concern => (
                    <div key={concern.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={concern.id}
                        checked={formData.mentalHealthConcerns.includes(concern.label)}
                        onCheckedChange={() => handleMultiSelect('mentalHealthConcerns', concern.label)}
                      />
                      <Label htmlFor={concern.id} className="cursor-pointer">{concern.label}</Label>
                    </div>
                  ))}
                </div>
                {formErrors.mentalHealthConcerns && (
                  <p className="text-sm text-red-500">{formErrors.mentalHealthConcerns}</p>
                )}
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Goals</h3>
              <div className="space-y-2">
                <Label className={formErrors.goals ? 'text-red-500' : ''}>
                  What are your mental health goals? (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {goalOptions.map(goal => (
                    <div key={goal.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal.id}
                        checked={formData.goals.includes(goal.label)}
                        onCheckedChange={() => handleMultiSelect('goals', goal.label)}
                      />
                      <Label htmlFor={goal.id} className="cursor-pointer">{goal.label}</Label>
                    </div>
                  ))}
                </div>
                {formErrors.goals && (
                  <p className="text-sm text-red-500">{formErrors.goals}</p>
                )}
              </div>
            </div>

            {/* Sleep Patterns */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sleep Patterns</h3>
              <div className="space-y-2">
                <Label htmlFor="sleepPattern">How would you describe your sleep pattern?</Label>
                <Select
                  value={formData.sleepPattern}
                  onValueChange={(value) => handleChange('sleepPattern', value)}
                >
                  <SelectTrigger className={formErrors.sleepPattern ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {sleepPatternOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.sleepPattern && (
                  <p className="text-sm text-red-500">{formErrors.sleepPattern}</p>
                )}
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stress Level</h3>
              <div className="space-y-2">
                <Label htmlFor="stressLevel">On a scale of 1-10, how would you rate your current stress level?</Label>
                <Slider
                  id="stressLevel"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.stressLevel]}
                  onValueChange={(value) => handleChange('stressLevel', value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Stress</span>
                  <span>High Stress</span>
                </div>
              </div>
            </div>

            {/* Social Connection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Connection</h3>
              <div className="space-y-2">
                <Label htmlFor="socialConnection">How would you describe your level of social connection?</Label>
                <Select
                  value={formData.socialConnection}
                  onValueChange={(value) => handleChange('socialConnection', value)}
                >
                  <SelectTrigger className={formErrors.socialConnection ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialConnectionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.socialConnection && (
                  <p className="text-sm text-red-500">{formErrors.socialConnection}</p>
                )}
              </div>
            </div>

            {/* Lifestyle Habits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lifestyle Habits</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exerciseFrequency">How often do you exercise?</Label>
                  <Select
                    value={formData.exerciseFrequency}
                    onValueChange={(value) => handleChange('exerciseFrequency', value)}
                  >
                    <SelectTrigger className={formErrors.exerciseFrequency ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="3-4-times-week">3-4 times a week</SelectItem>
                      <SelectItem value="1-2-times-week">1-2 times a week</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.exerciseFrequency && (
                    <p className="text-sm text-red-500">{formErrors.exerciseFrequency}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietQuality">How would you rate the quality of your diet?</Label>
                  <RadioGroup
                    value={formData.dietQuality}
                    onValueChange={(value) => handleChange('dietQuality', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="diet-excellent" />
                      <Label htmlFor="diet-excellent">Excellent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="diet-good" />
                      <Label htmlFor="diet-good">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="diet-fair" />
                      <Label htmlFor="diet-fair">Fair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="diet-poor" />
                      <Label htmlFor="diet-poor">Poor</Label>
                    </div>
                  </RadioGroup>
                  {formErrors.dietQuality && (
                    <p className="text-sm text-red-500">{formErrors.dietQuality}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Substance Use */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Substance Use</h3>
              <div className="space-y-2">
                <Label htmlFor="substanceUse">Do you use any substances regularly? (e.g., alcohol, tobacco, caffeine)</Label>
                <Textarea
                  id="substanceUse"
                  value={formData.substanceUse}
                  onChange={(e) => handleChange('substanceUse', e.target.value)}
                  placeholder="Please describe any substance use..."
                  className={formErrors.substanceUse ? 'border-red-500' : ''}
                />
                {formErrors.substanceUse && (
                  <p className="text-sm text-red-500">{formErrors.substanceUse}</p>
                )}
              </div>
            </div>

            {/* Coping Mechanisms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Coping Mechanisms</h3>
              <div className="space-y-2">
                <Label htmlFor="copingMechanisms">How do you typically cope with stress or difficult emotions?</Label>
                <Textarea
                  id="copingMechanisms"
                  value={formData.copingMechanisms}
                  onChange={(e) => handleChange('copingMechanisms', e.target.value)}
                  placeholder="Describe your coping strategies..."
                  className={formErrors.copingMechanisms ? 'border-red-500' : ''}
                />
                {formErrors.copingMechanisms && (
                  <p className="text-sm text-red-500">{formErrors.copingMechanisms}</p>
                )}
              </div>
            </div>

            {/* Reason for Joining */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reason for Joining</h3>
              <div className="space-y-2">
                <Label htmlFor="joinReason">Why did you decide to join this application? (Optional)</Label>
                <Textarea
                  id="joinReason"
                  value={formData.joinReason}
                  onChange={(e) => handleChange('joinReason', e.target.value)}
                  placeholder="Share your reasons..."
                />
              </div>
            </div>

            {formErrors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-500">{formErrors.submit}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}










