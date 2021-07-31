const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us hospital name!"],
  },
  hospitalCode: {
    type: Number,
    required: [true, "Please tell us hospital code"],
  },
  address: {
    city: String,
    country: String,
    zipcode: Number,
  },
  lastHospitalCode: Number,
  totalVacsinStorage: [
    {
      _id: false,
      code: Number,
      count: Number,
    },
  ],
  bookedSlot: [
    {
      _id: false,
      code: Number,
      count: Number,
    },
  ],
  staffData: [
    {
      name: String,
      position: { type: String, min: 1, max: 1 },
      code: Number,
    },
  ],
});

const Hospital = mongoose.model("Hospital", hospitalSchema, "hospital");

module.exports = Hospital;
