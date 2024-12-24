import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    journal: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CheckIn = mongoose.model('CheckIn', checkInSchema);

export default CheckIn;


