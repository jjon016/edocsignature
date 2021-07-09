import mongoose from 'mongoose';
import { DocStatus, SigBoxType } from '@edoccoding/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface SignerAttrs {
  email: string;
  signerid: string;
  tiergroup: number;
}

export interface SigBoxAttrs {
  x: number;
  y: number;
  width: number;
  height: number;
  signerid: string;
  type: SigBoxType;
  value?: string;
}

export interface SignerDoc {
  email: string;
  signerid: string;
  tiergroup: number;
}

export interface SigBoxDoc {
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

export interface DocAttrs {
  _id: string;
  docname: string;
  ownerid: string;
  docstatus: DocStatus;
  signers?: Array<SignerAttrs>;
  sigboxes?: Array<SigBoxAttrs>;
}

interface DocDoc extends mongoose.Document {
  id: string;
  docname: string;
  ownerid: string;
  docstatus: DocStatus;
  sigboxes: Array<SigBoxDoc>;
  version: number;
}

interface DocModel extends mongoose.Model<DocDoc> {
  build(attrs: DocAttrs): DocDoc;
}

const DocSchema = new mongoose.Schema(
  {
    docname: {
      type: String,
      required: true,
    },
    ownerid: {
      type: String,
      required: true,
    },
    docstatus: {
      type: String,
      required: true,
      enum: Object.values(DocStatus),
      default: DocStatus.Signing,
    },
    signers: [
      {
        email: {
          type: String,
          required: true,
        },
        signerid: {
          type: String,
          required: true,
        },
        tiergroup: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    sigboxes: [
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
    ],
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

DocSchema.set('versionKey', 'version');
DocSchema.plugin(updateIfCurrentPlugin);

DocSchema.statics.build = (attrs: DocAttrs) => {
  return new Doc(attrs);
};

const Doc = mongoose.model<DocDoc, DocModel>('Doc', DocSchema);

export { Doc };
