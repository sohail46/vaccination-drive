const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us hospital name!"],
  },
  code: {
    type: Number,
    required: [true, "Please tell us hospital code"],
  },
  totalVac: Number,
});

const Vaccination = mongoose.model("vaccinationsData", vaccinationSchema);

module.exports = Vaccination;
