import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username?: string;
  age?: number;
  email: string;
  password: string;
  _id: mongoose.Types.ObjectId;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string): boolean {
        const hasLowercase = /[a-z]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasDigit = /\d/.test(value);
        const hasSymbol = /[@$!%*?&]/.test(value);
        const isLengthValid = value.length >= 8;

        return (
          hasLowercase && hasUppercase && hasDigit && hasSymbol && isLengthValid
        );
      },
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character and be at least 8 characters long",
    },
  },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
