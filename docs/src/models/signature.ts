import mongoose from 'mongoose';
import { FontTypes } from '@edoccoding/common';

export interface SignatureAttrs {
  userid: string;
  signaturetype: FontTypes;
  signature: string;
  initialstype: FontTypes;
  initials: string;
  userversion: number;
}

export interface SignatureDoc extends mongoose.Document {
  userid: string;
  signaturetype: FontTypes;
  signature: string;
  initialstype: FontTypes;
  initials: string;
  userversion: number;
}

interface SignatureModel extends mongoose.Model<SignatureDoc> {
  build(attrs: SignatureAttrs): SignatureDoc;
}

const SignatureSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    signaturetype: {
      type: String,
      required: true,
      enum: Object.values(FontTypes),
      default: FontTypes.AlluraRegular,
    },
    signature: {
      type: String,
      required: true,
    },
    initialstype: {
      type: String,
      required: true,
      enum: Object.values(FontTypes),
      default: FontTypes.AlluraRegular,
    },
    initials: {
      type: String,
      required: true,
    },
    userversion: {
      type: Number,
      required: true,
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

SignatureSchema.statics.build = (attrs: SignatureAttrs) => {
  return new Signature(attrs);
};

const Signature = mongoose.model<SignatureDoc, SignatureModel>(
  'Signature',
  SignatureSchema
);

export { Signature };
