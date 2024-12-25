import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config/config.js';

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
      select: 0,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },

    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiry: {
      type: Date,
      required: false,
    },
    canResetPassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.isUserExist = async function (email) {
  return await User.findOne(
    { email, isGoogleUser: false },
    { email: 1, password: 1, role: 1, _id: 1 }
  );
};

UserSchema.statics.isGoogleUser = async function (email) {
  return await User.findOne(
    { email, isGoogleUser: true },
    { email: 1, role: 1, _id: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (givenPassword, savedPassword) {
  if (savedPassword && givenPassword) {
    return await bcrypt.compare(givenPassword, savedPassword);
  }
  return false;
};

// User.create() / user.save()
UserSchema.pre('save', async function (next) {
  // hashing user password
  const user = this;
  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bycrypt_salt_rounds)
    );
  }

  next();
});

export const User = model('User', UserSchema);  
