import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9]+$/,
  },
  password: { type: String, minLength: 6, required: true }, 
  father: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //mother: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mother: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // brothers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // sisters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  daughter: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  //spouse_male: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  spouse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 // emailId: { type: String, unique: true },
  emailId: { type: String,  },
  education: { type: String,  },
  working: { type: String,  },
  gotar: { type: String,  },
  village_city: { type: String,  },
  taluka: { type: String,  },
  district: { type: String,  },
  state: { type: String,  },
  address_permanent : { type: String,  },
  address_local: { type: String,  },
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
    required: true,
  },
  // slug: {
  //   type: String,
  //   slug: "first_name",
  //   unique: true,
  //   permanent: true,
  //   immutable: true,
  // },
  image: {
    type: String,            
  },  
 
  //dob: { type: Date, required: true },
  dob: { type: Date},
  age: { type: Number },
  moblile: { type: Number },
  moblile_second: { type: Number },
  gender: {
      type: String,
     // enum: enums.values.Genders,
      required: true,
     // default: enums.values.Genders["PreferNotToSay"],
    },
  isDeleted: { type: Boolean, default: false },
});

// Model
const UserModel = mongoose.model("user", userSchema)

export default UserModel