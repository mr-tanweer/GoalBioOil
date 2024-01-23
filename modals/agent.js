const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin:{
        type:Boolean,
        default:true
      },
    
      clockHistory: [
        {
            type: { type: String, enum: ["clockin", "clockout"], required: true },
            timestamp: { type: Date, default: Date.now },
            // Add any other relevant properties
        }
    ],
    date: { type: Date, default: Date.now },
});

const Agent = mongoose.model("Agent", userSchema);
Agent.createIndexes();

module.exports = Agent;
