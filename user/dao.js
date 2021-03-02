/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { UserSchema } = require("./schema");

UserSchema.statics.createNew = async function createNew(user) {
  return await UserDAO.create(user);
};

UserSchema.statics.udpateToMany = async function udpateToMany(ids, user) {
  return await UserDAO.updateMany(
    { _id: { $in: ids } },
    { $set: user },
    {
      new: true,
      runValidators: true,
    },
  );
};

UserSchema.statics.udpate = async function udpate(_id, user) {
  return await UserDAO.findByIdAndUpdate(_id, user, {
    new: true,
    runValidators: true,
  }).exec();
};

UserSchema.statics.getById = async function getById(_id) {
  return await UserDAO.findById(_id).exec();
};

UserSchema.statics.getManyByIds = async function getManyByIds(ids) {
  return UserDAO.find({ _id: { $in: ids } }).exec();
};

UserSchema.statics.removeById = async function removeById(_id, userId = null) {
  const { nModified } = await UserDAO.deleteById(_id, userId).exec();

  if (nModified) {
    return _id;
  }
  return null;
};

UserSchema.statics.findByEmail = async (email) => {
  // Search for a user by email.
  return await UserDAO.findOne({ email });
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and compare password.
  let user = await UserDAO.findByEmail(email);
  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      user = null;
    }
  }
  return user;
};

UserSchema.statics.getAll = async function getAll({ skip, limit, sort, query }) {
  const users = await UserDAO.find({ ...query })
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .exec();

  // don't think this is required
  // duplicated of line#91
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
  const token = jwt.sign({ _id: this._id }, process.env.API_JWT_KEY || "API_JWT_KEY");
  this.tokens && this.tokens.push({ token });
  await this.save();
  return token;
};

UserSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.tokens;
    delete ret.password;
    delete ret.deleted;
  },
});

UserSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

const UserDAO = mongoose.model("User", UserSchema);

module.exports = { UserDAO };
