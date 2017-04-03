import * as mongoose from 'mongoose';

export interface IProfile extends mongoose.Document {
  email: string;
  username: string;

};

let Profile = new mongoose.Schema({
  email: {type: String, required: true, unique: true, lowercase: true },
  username: {type: String, required: true, unique: true, lowercase: true},
});

export default mongoose.model <IProfile> ('Profile', Profile);
