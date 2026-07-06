import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface ISaleItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ISale extends Document {
  customer: mongoose.Types.ObjectId;
  items: ISaleItem[];
  grandTotal: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number',
      },
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    items: {
      type: [saleItemSchema],
      required: [true, 'At least one item is required'],
      validate: {
        validator: (v: ISaleItem[]) => v.length > 0,
        message: 'Sale must have at least one item',
      },
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, 'Grand total cannot be negative'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

saleSchema.index({ customer: 1 });
saleSchema.index({ createdBy: 1 });
saleSchema.index({ createdAt: -1 });

export default mongoose.model<ISale>('Sale', saleSchema);
