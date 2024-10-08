// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true,  
 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],  

    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'  

  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;