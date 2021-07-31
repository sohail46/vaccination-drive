const { Citizen, Hospital } = require("../db/index");
const catchAsync = require("../utils/catchAsync");

exports.createBooking = catchAsync(async (req, res, next) => {
  const { phoneNo } = req.params;

  const { vacsinCode, hospitalCode } = req.body;

  const citizen = await Citizen.findOne({ phoneNo });
  let error;

  if (!citizen) {
    error = {
      statusCode: 404,
      status: "fail",
      message: "Citizen not found",
    };
    return res.status(404).json(error);
  }

  if (
    vacsinCode == undefined ||
    hospitalCode == undefined ||
    vacsinCode == "" ||
    hospitalCode == ""
  ) {
    error = {
      statusCode: 400,
      status: "fail",
      message: "Invalid Data",
    };
    return res.status(400).json(error);
  }

  const hospital = await Hospital.findOne({ hospitalCode });

  if (!hospital) {
    error = {
      statusCode: 404,
      status: "fail",
      message: "Hospital not found",
    };
    return res.status(404).json(error);
  }

  const vaccineCheck = hospital.totalVacsinStorage.find(
    (el) => el.code == vacsinCode && el.count > 0
  );

  if (!vaccineCheck) {
    error = {
      statusCode: 404,
      status: "fail",
      message: "Vaccine not available",
    };
    return res.status(404).json(error);
  }

  const citizenData = {
    $addToSet: {
      vaccinations: { code: vacsinCode, date: new Date().toString() },
    },
    $set: { lastHospitalCode: hospitalCode },
  };

  await Citizen.updateOne({ phoneNo }, citizenData);

  let hospitalQuery = {
    hospitalCode,
    "bookedSlot.code": vacsinCode,
  };

  let hospitalData = { $inc: { "bookedSlot.$.count": 1 } };

  const slotCheck = hospital.bookedSlot.find((el) => el.code == vacsinCode);

  if (!slotCheck) {
    hospitalQuery = {
      hospitalCode,
    };

    hospitalData = { $push: { bookedSlot: { code: vacsinCode, count: 1 } } };
  }

  await Hospital.findOneAndUpdate(hospitalQuery, hospitalData);

  let response = {
    statusCode: 200,
    status: "success",
    message: "Vaccine slot booked successfully",
  };
  res.status(200).json(response);
});

exports.recievedVaccine = catchAsync(async (req, res, next) => {
  const { phoneNo } = req.params;

  const { vacsinCode, hospitalCode } = req.body;

  const citizen = await Citizen.findOne({
    phoneNo,
    lastHospitalCode: hospitalCode,
    "vaccinations.code": vacsinCode,
  });
  let error;

  if (!citizen) {
    error = {
      statusCode: 404,
      status: "fail",
      message:
        "Citizen not found or last hospital not matched or vaccination slot not booked",
    };
    return res.status(404).json(error);
  }

  if (
    vacsinCode == undefined ||
    hospitalCode == undefined ||
    vacsinCode == "" ||
    hospitalCode == ""
  ) {
    error = {
      statusCode: 400,
      status: "fail",
      message: "Invalid Data",
    };
    return res.status(400).json(error);
  }

  let hospital = await Hospital.findOne({
    hospitalCode,
    "totalVacsinStorage.code": vacsinCode,
  });

  if (!hospital) {
    error = {
      statusCode: 404,
      status: "fail",
      message: "Hospital not found",
    };
    return res.status(404).json(error);
  }

  const vaccineCheck = hospital.totalVacsinStorage.find(
    (el) => el.code == vacsinCode && el.count > 0
  );

  if (!vaccineCheck) {
    error = {
      statusCode: 404,
      status: "fail",
      message: "Vaccine not available",
    };
    return res.status(404).json(error);
  }

  const citizenQuery = {
    phoneNo,
    "vaccinations.code": vacsinCode,
    "vaccinations.isVaccinated": false,
  };

  const citizenData = {
    $set: { "vaccinations.$.isVaccinated": true },
  };

  await Citizen.updateOne(citizenQuery, citizenData);

  hospital.totalVacsinStorage = hospital.totalVacsinStorage.map((el) => {
    if (el.code == vacsinCode) {
      el.count--;
    }
    return el;
  });

  hospital.bookedSlot = hospital.bookedSlot.map((el) => {
    if (el.code == vacsinCode) {
      el.count--;
    }
    return el;
  });

  await Hospital.findOneAndUpdate({ hospitalCode }, hospital);

  let response = {
    statusCode: 200,
    status: "success",
    message: "Vaccine received successfully",
  };
  res.status(200).json(response);
});
