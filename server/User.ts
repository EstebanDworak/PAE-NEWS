import * as mongoose from "mongoose";
import {Schema} from 'mongoose'

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('user', UserSchema);


export default User