const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const md5 = require("md5");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  verified: {
    type: Boolean,
    required: [true, "verified is required"],
    default: false
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = md5(this.password);
  // this.password = await bcrypt.hash(this.password, salt);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function (time) {
  return jwt.sign({ id: this._id, role: this.role, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: time,
  });
};

// Generating Password Reset Token

userSchema.methods.getResetPasswordToken = async function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return md5(password) === this.password;
};

module.exports = mongoose.model("User", userSchema);
