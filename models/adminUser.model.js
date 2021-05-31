const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const idGenerator = require("./../utils/id-generator");
const labelConstants = require("./../constants/lable-constants");

const adminUserSchema = new Schema(
  {
    userId: {
      type: "String",
      default: "",
    },
    profilePhoto: {
      type: "String",
      default: "",
    },
    firstName: {
      type: "String",
      default: "",
    },
    lastName: {
      type: "String",
      default: "",
    },
    email: {
      type: "String",
      default: "",
    },
    password: {
      type: "String",
      default: "",
    },
    gender: {
      type: "String",
      enum: ["male", "female", ""],
      default: "",
    },
    weight: {
      type: "Number",
      default: 0,
    },
    length: {
      type: "Number",
      default: 0,
    },
    age: {
      type: "Number",
      default: 0,
    },
    otp: {
      type: "Number",
      default: 0,
    },
    status: {
      type: "String",
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

adminUserSchema.pre("save", (callback) => {
  this.userId = idGenerator.generateRandom(labelConstants.ADMIN_USER);
  console.log("this.userId", this.userId);
  callback();
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);
module.exports = { AdminUser };
