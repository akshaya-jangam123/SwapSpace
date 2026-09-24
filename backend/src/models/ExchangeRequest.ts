import mongoose, { Document, Schema, Model } from 'mongoose';

export type ExchangeStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
export type ExchangeType = 'Skill' | 'Item' | 'Mixed';

export interface IExchangeRequest extends Document {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  exchangeType: ExchangeType;
  offeredSkill?: mongoose.Types.ObjectId;
  offeredItem?: mongoose.Types.ObjectId;
  requestedSkill?: mongoose.Types.ObjectId;
  requestedItem?: mongoose.Types.ObjectId;
  customOfferText?: string;
  customRequestText?: string;
  message: string;
  status: ExchangeStatus;
  completedBySender: boolean;
  completedByReceiver: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeRequestSchema = new Schema<IExchangeRequest>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exchangeType: {
      type: String,
      enum: ['Skill', 'Item', 'Mixed'],
      default: 'Skill',
    },
    offeredSkill: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
    },
    offeredItem: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
    requestedSkill: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
    },
    requestedItem: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
    customOfferText: {
      type: String,
      default: '',
    },
    customRequestText: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required to introduce your swap offer'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    completedBySender: {
      type: Boolean,
      default: false,
    },
    completedByReceiver: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ExchangeRequest: Model<IExchangeRequest> = mongoose.model<IExchangeRequest>(
  'ExchangeRequest',
  ExchangeRequestSchema
);
