import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { SigBoxType } from '@edoccoding/common';

interface SigBoxAttrs {
  x: number;
  y: number;
  width: number;
  height: number;
  signerId: string;
  clickedOn: Date;
  type: SigBoxType;
  value: string;
}

export interface SigBoxDoc extends mongoose.Document {
  x: number;
  y: number;
  width: number;
  height: number;
  signerId: string;
  type: SigBoxType;
  value?: string;
}

interface SigBoxModel extends mongoose.Model<SigBoxDoc> {
  build(attrs: SigBoxAttrs): SigBoxDoc;
}

const SigBoxSchema = new mongoose.Schema(
  {
    x: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    y: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    width: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    height: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    signerId: {
      type: String,
      required: true,
    },
    clickedOn: {
      type: mongoose.Schema.Types.Date,
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(SigBoxType),
      default: SigBoxType.Signature,
    },
    value: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

SigBoxSchema.set('versionKey', 'version');
SigBoxSchema.plugin(updateIfCurrentPlugin);

SigBoxSchema.statics.build = (attrs: SigBoxAttrs) => {
  return new SigBox(attrs);
};

const SigBox = mongoose.model<SigBoxDoc, SigBoxModel>('SigBox', SigBoxSchema);

export { SigBox };
