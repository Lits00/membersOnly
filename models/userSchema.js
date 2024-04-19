const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 100 },
    lastName: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true },
    isMember: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
});

userSchema.virtual("fullName").get(function () {
    // if condition is true returns the fullName value, else returns an empty string.
    const fullName = (this.firstName && this.lastName) ? `${this.firstName} ${this.lastName}` : ""; 
    return fullName;
})

userSchema.virtual("url").get(function () {
    return `${this.id}`;
});

module.exports = mongoose.model("User", userSchema);