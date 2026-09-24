import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IItem extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  category: 'Books' | 'Electronics' | 'Study Materials' | 'Stationery' | 'Sports' | 'Accessories' | 'Other';
  description: string;
  condition: 'New' | 'Like New' | 'Good' | 'Used';
  imageUrl?: string;
  availability: string;
  wantInExchange: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Books', 'Electronics', 'Study Materials', 'Stationery', 'Sports', 'Accessories', 'Other'],
      required: [true, 'Category is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Used'],
      required: [true, 'Condition is required'],
      default: 'Good',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    availability: {
      type: String,
      required: [true, 'Availability is required (e.g., Immediate, Pickup on Campus)'],
      trim: true,
    },
    wantInExchange: {
      type: String,
      required: [true, 'Exchange requirement is required (e.g., Calculator, Python Book)'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search
ItemSchema.index({ name: 'text', description: 'text', category: 'text', wantInExchange: 'text' });

export const Item: Model<IItem> = mongoose.model<IItem>('Item', ItemSchema);
