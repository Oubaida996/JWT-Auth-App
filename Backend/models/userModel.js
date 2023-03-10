'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//1- Create Shema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name of user is required'],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      unique: true,
      type: String,
      trim: true,
      required: [true, 'Email of user is required'],
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, 'Email of user is required'],
      minlingth: [8, 'To short password'],
    },

    phone: String,

    profileImg: 'string',

    role: {
      type: String,
      enum: ['admin', 'writer', 'editor', 'user'],
      default: 'user',
    },
    actions: {
      type: Array,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//Before save the new field, verify if the password updated or not then hash it.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  //Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//Before save the new field, add the access control list for user
userSchema.pre('save', async function (next) {
  const acl = {
    user: ['read'],
    writer: ['read', 'create'],
    editor: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete'],
  };
  console.log(this.role);
  this.actions = acl[this.role];
  next();
});

//2-export model

const User = mongoose.model('User', userSchema);

module.exports = User;
