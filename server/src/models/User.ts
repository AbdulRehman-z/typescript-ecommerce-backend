import mongoose, { mongo } from "mongoose";
import { Password } from "../services/password.service";
import { Address, UserAttrs } from "../types/types";

interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: number;
  isAdmin: boolean;
  address: Address;
  gender: string;
  cart: mongoose.Schema.Types.ObjectId[];
  orders: mongoose.Schema.Types.ObjectId[];
  wishlist: mongoose.Schema.Types.ObjectId[];
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
    gender: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      street: { type: String },
      houseNumber: { type: Number },
      zipCode: { type: String },
      state: { type: String },
      country: { type: String },
      phoneNumber: { type: String },
      additionalInfo: { type: String },
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId }],
    orders: [{ type: mongoose.Schema.Types.ObjectId }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
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
