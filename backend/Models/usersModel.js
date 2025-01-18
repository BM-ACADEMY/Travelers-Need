const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validates email format
      },
      message: 'Invalid email format',
    },
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validates 10-digit phone number
      },
      message: 'Phone number must be 10 digits',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Prevent password from being returned in queries
  },
  role: {
    type: [String], // Array of strings
    enum: ['user', 'admin', 'vendor', 'affiliate'], // Allowed values for roles
    default: ['user'], // Default value is an array containing 'user'
  },
  isActive: {
    type: Number,
    enum: [1, 0], // 1 for active, 0 for inactive
    default: 1, // Default value is 1 (active)
  },
  token: {
    type: String, // Store the user's JWT token
    default: null,
  },
}, { timestamps: true });

// Pre-save middleware to hash the password
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   // Hash the password
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Instance method to compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Instance method to generate and store JWT token
// userSchema.methods.generateAuthToken = async function () {
//   const token = jwt.sign(
//     { id: this._id, email: this.email, role: this.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '1d' }
//   );
//   this.token = token;
//   await this.save(); // Save the token to the database
//   return token;
// };
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Pre-update middleware to hash the password during updates
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    // Hash the password if it is being updated
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate and store JWT token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  this.token = token;
  await this.save(); // Save the token to the database
  return token;
};


// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
