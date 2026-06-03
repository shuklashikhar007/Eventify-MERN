const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var ALLOWED_DOMAINS = ["@itbhu.ac.in", "@iitbhu.ac.in"];

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          for (var i = 0; i < ALLOWED_DOMAINS.length; i++) {
            if (email.endsWith(ALLOWED_DOMAINS[i])) return true;
          }
          return false;
        },
        message: "Only @itbhu.ac.in or @iitbhu.ac.in email addresses are allowed.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    image_url: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  var salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.toClientJSON = function () {
  return {
    ID: this._id.toString(),
    name: this.name,
    email: this.email,
    image_url: this.image_url || null,
    CreatedAt: this.createdAt,
    UpdatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("User", userSchema);