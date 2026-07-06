import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    permissions: {
      type: [String],
      required: [true, 'At least one permission is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Role must have at least one permission',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRole>('Role', roleSchema);
