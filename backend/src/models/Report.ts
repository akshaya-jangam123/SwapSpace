import mongoose, { Document, Schema, Model } from 'mongoose';

export type ReportTarget = 'User' | 'Skill' | 'Item' | 'Message';
export type ReportStatus = 'Pending' | 'Reviewed' | 'Resolved';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reporter: mongoose.Types.ObjectId;
  targetType: ReportTarget;
  targetId: mongoose.Types.ObjectId;
  targetTitle?: string;
  reason: string;
  description: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['User', 'Skill', 'Item', 'Message'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    targetTitle: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      required: [true, 'Report reason is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Resolved'],
      default: 'Pending',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Report: Model<IReport> = mongoose.model<IReport>('Report', ReportSchema);
