import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
    minlength: [8, 'password must be at least 8 characters'],
    validate: function (value){
      return value === this.passwordConfirmation;
    }
  },
  passwordConfirmation: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
},{timestamps: true}
)

userSchema.pre("save",async function (next) {
  if (!this.isModified('password')) { return next() }
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirmation = undefined;
  next()
})

export default mongoose.model("user",userSchema);