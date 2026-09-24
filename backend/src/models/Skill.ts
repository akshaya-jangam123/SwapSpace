import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISkill extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  availability: string;
  wantInExchange: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Skill level is required'],
      default: 'Intermediate',
    },
    availability: {
      type: String,
      required: [true, 'Availability is required (e.g., Weekends, Evenings)'],
      trim: true,
    },
    wantInExchange: {
      type: String,
      required: [true, 'Exchange requirement is required (e.g., Python tutoring, Web Dev)'],
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
SkillSchema.index({ name: 'text', description: 'text', category: 'text', wantInExchange: 'text' });

export const Skill: Model<ISkill> = mongoose.model<ISkill>('Skill', SkillSchema);
