import type { Document, Query } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  imageUrl: string;
  imagePublicId: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: [0, 'Purchase price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be a whole number',
      },
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image is required'],
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required'],
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

productSchema.pre<Query<IProduct, IProduct>>('find', function () {
  this.where({ deletedAt: null });
});

productSchema.pre<Query<IProduct, IProduct>>('findOne', function () {
  this.where({ deletedAt: null });
});

productSchema.pre<Query<IProduct, IProduct>>('findOneAndUpdate', function () {
  this.where({ deletedAt: null });
});

productSchema.index({ name: 'text', category: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);
