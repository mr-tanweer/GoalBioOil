const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    Name: { type: String, required: true },
    Fathersname: { type: String, required: true },
    Contactno: { type: String, required: true },
    email: { type: String, required: true },
    Address: { type: String, required: true },
    Block: { type: String, required: true },
    Post: { type: String, required: true },
    Ps: { type: String, required: true },
    Disrict: { type: String, required: true },
    Pin: { type: String, required: true },
    State: { type: String, required: true },
    Landmark: { type: String, required: true },
    Aadhar: { type: String, required: true },
    Pan: { type: String, required: true },
    profileImage: {
        data: Buffer,
        contentType: String,
      },
      educationQualifications: [
        {
           
            college: { type: String, required: true },
            session: { type: String, required: true },
            division: { type: String, required: true },
        }
    ],
      Experience:{
        type:String
      },
     

  date: { type: Date, default: Date.now },
});

const appoinment = mongoose.model("appointment", userSchema);
appoinment.createIndexes();

module.exports = appoinment;
