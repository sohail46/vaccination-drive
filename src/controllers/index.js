const citizenController = require("./citizenController");
const hospitalController = require("./hospitalController");
const vaccinationController = require("./vaccinationController");

// module.exports.index = (req, res) => {
//   res.send({
//     message: "hello",
//   });
// };

module.exports = {
  citizenController,
  hospitalController,
  vaccinationController,
};
