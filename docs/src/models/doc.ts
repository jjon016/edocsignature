import mongoose from 'mongoose';
import { DocStatus } from '@edoccoding/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { SigBox } from './sigbox';

interface DocAttrs {
  docId: string;
  docName: string;
  ownerId: string;
  docStatus: DocStatus;
  sigBoxes: Array<typeof SigBox>;
}

interface DocDoc extends mongoose.Document {
  docId: string;
  docName: string;
  ownerId: string;
  docStatus: DocStatus;
  sigBoxes: Array<typeof SigBox>;
}

interface DocModel extends mongoose.Model<DocDoc> {
  build(attrs: DocAttrs): DocDoc;
}

const DocSchema = new mongoose.Schema(
  {
    docId: {
      type: String,
      required: true,
    },
    docStatus: {
      type: String,
      required: true,
      enum: Object.values(DocStatus),
      default: DocStatus.Signing,
    },
    ownerId: {
      type: String,
      required: true,
    },
    docName: {
      type: String,
      required: true,
    },
    sigBoxes: [
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

const Doc = mongoose.model<DocDoc, DocModel>('Doc', DocSchema);

export { Doc };
