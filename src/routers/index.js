const Router = require("express").Router();
const { citizenController } = require("../controllers");

Router.put(
  "/citizens/vaccine/booking/:phoneNo",
  citizenController.createBooking
);
Router.put(
  "/citizens/vaccine/received/:phoneNo",
  citizenController.recievedVaccine
);

module.exports = Router;
