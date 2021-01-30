/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { UserSchema } = require("./model");

UserSchema.statics.createNew = async function createNew(user) {
  const _user = new UserDAO(user);
  const newPost = await _user.save();
  return newPost;
};

UserSchema.statics.udpate = async function udpate(_id, user) {
  return await UserDAO.findByIdAndUpdate({ _id }, user, {
    new: true,
    runValidators: true,
  }).exec();
};

UserSchema.statics.getAll = async function getAll({ skip, limit, sort, query }) {
  const users = await UserSchema.find({ ...query })
    .skip(skip)
    .limit(limit)
    .sort(sort);
  return users;
};

UserSchema.statics.getById = async function getById(_id) {
  return await UserDAO.findOne({ _id }).exec();
};

UserSchema.statics.removeById = async function removeById(_id, userId = null) {
  return await UserDAO.delete({ _id }, userId);
};

UserSchema.statics.findByEmail = async (email) => {
  // Search for a user by email.
  return await UserDAO.findOne({ email });
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await UserDAO.findOne({ email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  // let cleanUser = user.toObject();
  // delete cleanUser.password;
  return user;
};

UserSchema.statics.getAll = async function getAll({ query }) {
  const users = await UserDAO.find({ ...query });
  for (let i = 0; i < users.length; i++) {
    delete users[i]._doc.tokens;
  }
  return users;
};

UserSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.API_JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

const UserDAO = mongoose.model("User", UserSchema);

module.exports = { UserDAO };
