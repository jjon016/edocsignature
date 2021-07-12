import mongoose from 'mongoose';

//An interface that describes the properties
// required to create a new TempUser
interface TempUserAttrs {
  email: string;
}

//An interface that describes the properties
// that a TempUser model has
interface TempUserModel extends mongoose.Model<TempUserDoc> {
  build(attrs: TempUserAttrs): TempUserDoc;
}

//An interface that describes the properties
// that a TempUser document has
interface TempUserDoc extends mongoose.Document {
  id: string;
  email: string;
}

const TempUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

TempUserSchema.statics.build = (attrs: TempUserAttrs) => {
  return new TempUser(attrs);
};

const TempUser = mongoose.model<TempUserDoc, TempUserModel>(
  'TempUser',
  TempUserSchema
);

const ManyTempUsers = mongoose.model('TempUser', TempUserSchema);

export { TempUser, ManyTempUsers };
