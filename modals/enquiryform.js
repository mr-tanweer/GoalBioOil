const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({

  appoinment: {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agent",
    },
    agentName: String, // Store the agent name directly in the document
  },

    Name: { type: String, required: true },
    firmName: { type: String, required: true },
    contactNo: { type: String, required: true },
    whatsappNo: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    Block: { type: String, required: true },
    po: { type: String, required: true },
    ps: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    pin: { type: String, required: true },
    landmark: { type: String, required: true },
    profession: { type: String, required: true },
    annualIncome: { type: String, required: true },
    panCardNo: { type: String, required: true },
    aadharNo: { type: String, required: true },
    Industries: { type: String },
    Lubricant: { type: String},
    LPG: { type: String },
    FuelPurchase: { type: String },
    ElectricVehicle: { type: String },
    UCO: { type: String, required: true },
    placeName:{type:String, required:true},
    
    // selfieImage: {
    //     data: Buffer,
    //     contentType: String,
    //   },
     
  date: { type: Date, default: Date.now },
});

const enquiryform = mongoose.model("enquiryform", userSchema);
enquiryform.createIndexes();

module.exports = enquiryform;
