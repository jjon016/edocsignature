import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { SigBoxType } from '@edoccoding/common';

export interface SigBoxAttrs {
  x: number;
  y: number;
  width: number;
  height: number;
  signerid: string;
  type: SigBoxType;
  value?: string;
}

export interface SigBoxDoc extends mongoose.Document {
  x: number;
  y: number;
  width: number;
  height: number;
  signerid: string;
  clickedon: Date;
  type: SigBoxType;
  value: string;
  version: number;
}

interface SigBoxModel extends mongoose.Model<SigBoxDoc> {
  build(attrs: SigBoxAttrs): SigBoxDoc;
}

const SigBoxSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
      min: 0,
    },
    y: {
      type: Number,
      required: true,
      min: 0,
    },
    width: {
      type: Number,
      required: true,
      min: 0,
    },
    height: {
      type: Number,
      required: true,
      min: 0,
    },
    signerid: {
      type: String,
      required: true,
    },
    clickedon: {
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

export const isSigBox = (SigBox: SigBoxAttrs) => {
  return (
    parseFloat(SigBox.x.toString()) > 0 &&
    parseFloat(SigBox.y.toString()) > 0 &&
    parseFloat(SigBox.width.toString()) > 0 &&
    parseFloat(SigBox.height.toString()) > 0 &&
    SigBox.signerid != '' &&
    Object.values(SigBoxType).includes(SigBox.type as SigBoxType)
  );
};

export { SigBox };
