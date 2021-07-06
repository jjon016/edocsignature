import mongoose from 'mongoose';
import { DocStatus, SigBoxType } from '@edoccoding/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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

export interface SigBoxAttrs {
  x: number;
  y: number;
  width: number;
  height: number;
  signerid: string;
  type: SigBoxType;
  value?: string;
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
  docid: string;
  docname: string;
  ownerid: string;
  docstatus: DocStatus;
  sigboxes: Array<SigBoxAttrs>;
}

interface DocDoc extends mongoose.Document {
  docid: string;
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
    docid: {
      type: String,
      required: true,
    },
    docstatus: {
      type: String,
      required: true,
      enum: Object.values(DocStatus),
      default: DocStatus.Signing,
    },
    ownerid: {
      type: String,
      required: true,
    },
    docname: {
      type: String,
      required: true,
    },
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

export const isDoc = (theDoc: DocAttrs) => {
  let isValid = theDoc.docname != '';
  if (theDoc.sigboxes) {
    theDoc.sigboxes.map((box: SigBoxAttrs) => {
      isValid = isValid && isSigBox(box);
    });
  }
  return isValid;
};

const Doc = mongoose.model<DocDoc, DocModel>('Doc', DocSchema);

export { Doc };
