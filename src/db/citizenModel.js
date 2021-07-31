const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  age: {
    type: Number,
    required: [true, "Please tell us your age"],
  },
  gender: {
    type: String,
  },
  address: {
    city: String,
    country: String,
    zipcode: Number,
  },
  phoneNo: {
    type: String,
    min: 10,
    max: 10,
  },
  lastHospitalCode: Number,
  vaccinations: [
    {
      _id: false,
      code: Number,
      date: String,
      isVaccinated: { type: Boolean, default: false },
    },
  ],
});

const Citizen = mongoose.model("Citizen", citizenSchema, "citizen");

module.exports = Citizen;
