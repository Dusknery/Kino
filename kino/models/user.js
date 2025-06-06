const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});

// Hasha lösenord innan spara
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Jämför lösenord
UserSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);