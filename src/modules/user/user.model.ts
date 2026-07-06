import type { Document, Query } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: mongoose.Types.ObjectId;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Role is required'],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<Query<IUser, IUser>>('find', function () {
  this.where({ deletedAt: null });
});

userSchema.pre<Query<IUser, IUser>>('findOne', function () {
  this.where({ deletedAt: null });
});

userSchema.pre<Query<IUser, IUser>>('findOneAndUpdate', function () {
  this.where({ deletedAt: null });
});

export default mongoose.model<IUser>('User', userSchema);
