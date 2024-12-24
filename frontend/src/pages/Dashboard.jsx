import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';
import { toast } from 'react-hot-toast';
import { Smile, Frown, Meh, Award, Zap, Moon, Footprints, TrendingUp, Brain } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import ShareBadge from '../components/ShareBadge';
import { Slider } from '../components/ui/slider';
import SentimentAnalysis from '../components/SentimentAnalysis'; 

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [stepCount, setStepCount] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [moodRating, setMoodRating] = useState(3);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/data`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setDashboardData(response.data);
      setStepCount(response.data.profile?.stepHistory[response.data.profile.stepHistory.length - 1]?.count || '');
      setSleepDuration(response.data.profile?.sleepHistory[response.data.profile.sleepHistory.length - 1]?.duration || '');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard data';
      toast.error(errorMessage);
      
      // Set default data structure
      setDashboardData({
        profile: { 
          badges: [], 
          completedTasks: [],
          stepHistory: [],
          sleepHistory: []
        },
        moodData: [],
        averageMood: 0,
        totalCheckIns: 0,
        recommendations: [],
        stepData: [],
        sleepData: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/dashboard/update-health-data`, {
        stepCount: parseInt(stepCount),
        sleepDuration: parseFloat(sleepDuration)
      });
      toast.success('Health data updated successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating health data:', error);
      toast.error('Failed to update health data');
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/dashboard/complete-task`, { task });
      setDashboardData(prevData => ({
        ...prevData,
        profile: response.data
      }));
      toast.success('Task completed!');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  const handleShareBadge = async (badgeId, platform) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/dashboard/share-badge`, {
        badgeId,
        platform
      });
      toast.success(`Badge shared on ${platform}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error sharing badge:', error);
      toast.error('Failed to share badge');
    }
  };

  const handleUpdateMood = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/dashboard/update-mood`, {
        rating: moodRating
      });
      setDashboardData(prevData => ({
        ...prevData,
        moodData: response.data.moodData
      }));
      toast.success('Mood updated successfully');
    } catch (error) {
      console.error('Error updating mood:', error);
      toast.error('Failed to update mood');
    }
  };

  const getMoodIcon = (mood) => {
    if (mood >= 4) return <Smile className="w-8 h-8 text-green-500" />;
    if (mood >= 3) return <Meh className="w-8 h-8 text-yellow-500" />;
    return <Frown className="w-8 h-8 text-red-500" />;
  };

  const BadgeDialog = ({ badge }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors">
          <div className="w-16 h-16 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm font-medium text-center">{badge.name}</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{badge.name}</DialogTitle>
          <DialogDescription>{badge.description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-4">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="w-16 h-16 text-primary" />
          </div>
        </div>
        <ShareBadge badge={badge} onShare={(platform) => handleShareBadge(badge._id, platform)} />
      </DialogContent>
    </Dialog>
  );

  const SafeChart = ({ children }) => {
    try {
      return children;
    } catch (error) {
      console.error('Chart error:', error);
      return <div className="h-[200px] flex items-center justify-center text-muted-foreground">Unable to display chart</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Wellness Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-primary to-primary-foreground text-white hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Mood Today</CardTitle>
            {getMoodIcon(dashboardData.averageMood)}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.averageMood.toFixed(1)}</div>
            <p className="text-sm opacity-80">Average mood score</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary to-secondary-foreground text-white hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Check-ins</CardTitle>
            <Zap className="w-8 h-8 text-yellow-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalCheckIns}</div>
            <p className="text-sm opacity-80">Total check-ins</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent to-accent-foreground text-white hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Badges Earned</CardTitle>
            <Award className="w-8 h-8 text-yellow-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.profile.badges.length}</div>
            <p className="text-sm opacity-80">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Tracking */}
      <Card className="col-span-full md:col-span-2 lg:col-span-3 hover-lift">
        <CardHeader>
          <CardTitle className="text-xl">Daily Mood Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>How are you feeling today?</span>
              <span className="text-2xl font-bold">{moodRating}</span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[moodRating]}
              onValueChange={(value) => setMoodRating(value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>😢 Very Bad</span>
              <span>😐 Neutral</span>
              <span>😄 Very Good</span>
            </div>
            <Button onClick={handleUpdateMood} className="w-full">
              Update Mood
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-xl">Daily Steps</CardTitle>
            <CardDescription>Log your daily activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stepCount" className="text-base">Daily Steps</Label>
                <div className="flex items-center mt-1">
                  <Footprints className="w-5 h-5 mr-2 text-primary" />
                  <Input
                    id="stepCount"
                    type="number"
                    value={stepCount}
                    onChange={(e) => setStepCount(e.target.value)}
                    placeholder="Enter your daily step count"
                    className="flex-grow"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sleepDuration" className="text-base">Sleep Duration (hours)</Label>
                <div className="flex items-center mt-1">
                  <Moon className="w-5 h-5 mr-2 text-primary" />
                  <Input
                    id="sleepDuration"
                    type="number"
                    value={sleepDuration}
                    onChange={(e) => setSleepDuration(e.target.value)}
                    placeholder="Enter your sleep duration"
                    step="0.1"
                    className="flex-grow"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProfile} className="w-full mt-4">Update Profile</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-xl">Mood Trend</CardTitle>
            <CardDescription>Your mood over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <SafeChart>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dashboardData.moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </SafeChart>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-xl">Daily Steps</CardTitle>
            <CardDescription>Your step count over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <SafeChart>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dashboardData.stepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </SafeChart>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-xl">Sleep Duration</CardTitle>
            <CardDescription>Your sleep duration over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <SafeChart>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dashboardData.sleepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </SafeChart>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Mood Analysis & Recommendations</CardTitle>
            <CardDescription>
              Get personalized recommendations based on your current mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentAnalysis />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 hover-lift">
        <CardHeader>
          <CardTitle className="text-2xl">Your Wellness Journey</CardTitle>
          <CardDescription>Complete tasks to earn badges and improve your well-being</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recommendations.map((rec, index) => (
              <div key={index} className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  {rec.type === 'physical' ? <Footprints className="w-5 h-5 mr-2 text-primary" /> : <Brain className="w-5 h-5 mr-2 text-primary" />}
                  {rec.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                <div className="flex items-center">
                  <Checkbox
                    id={`task-${index}`}
                    checked={dashboardData.profile.completedTasks.includes(rec.title)}
                    onCheckedChange={() => handleCompleteTask(rec.title)}
                  />
                  <label htmlFor={`task-${index}`} className="ml-2 text-sm font-medium">
                    Mark as completed
                  </label>
                </div>
                <Progress 
                  value={dashboardData.profile.completedTasks.includes(rec.title) ? 100 : 0} 
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-2xl">Your Achievements</CardTitle>
          <CardDescription>Badges earned on your wellness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dashboardData.profile.badges.map((badge) => (
              <BadgeDialog key={badge._id} badge={badge} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}































