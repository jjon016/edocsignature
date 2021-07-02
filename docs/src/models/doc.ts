import mongoose from 'mongoose';
import { DocStatus } from '@edoccoding/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { SigBoxDoc, isSigBox } from './sigbox';

interface DocAttrs {
  docid: string;
  docname: string;
  ownerid: string;
  docstatus: DocStatus;
  sigboxes: Array<SigBoxDoc>;
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SigBox',
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
  let isValid =
    theDoc.docid != '' &&
    theDoc.docname != '' &&
    Object.values(DocStatus).includes(theDoc.docstatus as DocStatus);
  theDoc.sigboxes.map((box: SigBoxDoc) => {
    isValid = isValid && isSigBox(box);
  });
  return isValid;
};

const Doc = mongoose.model<DocDoc, DocModel>('Doc', DocSchema);

export { Doc };
