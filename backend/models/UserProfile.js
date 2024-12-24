import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
  shared: {
    twitter: { type: Boolean, default: false },
    linkedin: { type: Boolean, default: false },
  },
});

const stepEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const sleepEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const moodEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const activitySchema = new mongoose.Schema({
  activity: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    required: true,
  },
  completedAt: {
    type: Date,
    required: true,
  },
});

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 13,
      max: 120,
    },
    currentMentalHealth: {
      type: String,
      required: true,
      enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Struggling'],
    },
    joinReason: {
      type: String,
    },
    goals: [
      {
        type: String,
      },
    ],
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    stepHistory: [stepEntrySchema],
    sleepHistory: [sleepEntrySchema],
    moodHistory: [moodEntrySchema],
    completedTasks: [
      {
        type: String,
      },
    ],
    badges: [badgeSchema],
    completedActivities: [activitySchema],
    sleepPattern: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Struggling'],
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
    },
    socialConnection: {
      type: String,
      enum: ['Strong', 'Moderate', 'Weak', 'Isolated'],
    },
    mentalHealthConcerns: [
      {
        type: String,
      },
    ],
    exerciseFrequency: {
      type: String,
      enum: ['daily', '3-4-times-week', '1-2-times-week', 'rarely', 'never'],
    },
    dietQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
    },
    substanceUse: {
      type: String,
    },
    copingMechanisms: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'unspecified'],
      default: 'unspecified',
    },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;



















