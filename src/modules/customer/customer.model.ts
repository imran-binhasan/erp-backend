import type { Document, Query } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email?: string;
  phone?: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
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

customerSchema.pre<Query<ICustomer, ICustomer>>('find', function () {
  this.where({ deletedAt: null });
});

customerSchema.pre<Query<ICustomer, ICustomer>>('findOne', function () {
  this.where({ deletedAt: null });
});

customerSchema.pre<Query<ICustomer, ICustomer>>('findOneAndUpdate', function () {
  this.where({ deletedAt: null });
});

export default mongoose.model<ICustomer>('Customer', customerSchema);
