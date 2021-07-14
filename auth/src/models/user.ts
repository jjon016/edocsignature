import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Password } from '../tools/password';
import { FontTypes } from '@edoccoding/common';

//An interface that describes the properties
// required to create a new user
interface UserAttrs {
  _id?: string;
  email: string;
  password: string;
  name?: string;
  initials?: string;
  phone?: string;
}

//An interface that describes the properties
// that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties
// that a user document has
interface UserDoc extends mongoose.Document {
  id: string;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  signaturetype?: FontTypes;
  signature?: string;
  initialstype?: FontTypes;
  initials?: string;
  version: number;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    signaturetype: {
      type: String,
      required: false,
      enum: Object.values(FontTypes),
      default: FontTypes.AlluraRegular,
    },
    signature: {
      type: String,
      required: false,
    },
    initialstype: {
      type: String,
      required: false,
      enum: Object.values(FontTypes),
      default: FontTypes.AlluraRegular,
    },
    initials: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hpass = await Password.toHash(this.get('password'));
    this.set('password', hpass);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
