import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewee: mongoose.Types.ObjectId;
  exchange: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exchange: {
      type: Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Feedback comment is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same reviewer from reviewing the same exchange twice
ReviewSchema.index({ reviewer: 1, exchange: 1 }, { unique: true });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
