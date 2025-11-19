import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface ILocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ISearchHistory {
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  selectedRide: 'Uber' | 'Ola';
  fareAmount: number;
  timestamp?: Date;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  searchHistory: ISearchHistory[];
  createdAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const searchHistorySchema = new Schema<ISearchHistory>({
  pickupLocation: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dropoffLocation: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  selectedRide: {
    type: String,
    enum: ['Uber', 'Ola'],
    required: true
  },
  fareAmount: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone:     { type: String, required: true, unique: true, trim: true },
  password:  { type: String, required: true },
  searchHistory: [searchHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre<IUser>('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
