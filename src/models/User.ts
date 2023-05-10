import mongoose from "mongoose";
import { Password } from "../services/password.service";

interface UserAttrs {
  username: string;
  email: string;
  password: string;
}

interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

UserSchema.pre("save", async function (done) {
  if (this.isModified(this.password)) {
    const hashed = Password.genPasswordHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
