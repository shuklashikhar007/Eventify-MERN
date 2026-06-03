const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ALLOWED_DOMAINS = ["@itbhu.ac.in", "@iitbhu.ac.in"];

const userSchema = new mongoose.Schema(
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
          return ALLOWED_DOMAINS.some((domain) => email.endsWith(domain));
        },
        message: "Only @itbhu.ac.in or @iitbhu.ac.in email addresses are allowed.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never returned in queries by default
    },
    image_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with hashed
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Shape output to match what the frontend expects (mirrors Go User struct field names)
userSchema.methods.toClientJSON = function () {
  return {
    ID: this._id.toString(),
    name: this.name,
    email: this.email,
    image_url: this.image_url,
    CreatedAt: this.createdAt,
    UpdatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("User", userSchema);
