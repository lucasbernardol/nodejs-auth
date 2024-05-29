import crypto from 'node:crypto';

import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 32,
      trim: true,
    },

    uuid: {
      type: String,
      required: false,
      default: () => crypto.randomUUID(), // testing only
      select: false,
    },

    gravatar: {
      type: String,
      required: false,
      default: null,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },

    /*
     Tokens
    */
    recoveryToken: {
      type: String,
      unique: true,
      trim: true,
      required: false,
      default: null,
    },

    recoveryExpiresAt: {
      // Unix timetamp
      type: Number,
      required: false,
      default: null,
    },

    recoverySignAt: {
      type: Number,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  },
);

export const User = mongoose.model('User', schema);
