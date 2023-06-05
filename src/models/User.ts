import mongoose from "mongoose";
import { Password } from "../services/password.service";

interface UserAttrs {
  username: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: number;
  isAdmin: boolean;
}

interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: number;
  isAdmin: boolean;
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
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
      index: true,
    },
    resetTokenExpiration: {
      type: Number,
      index: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
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
  if (this.isModified("password")) {
    const hashed = Password.genPasswordHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
