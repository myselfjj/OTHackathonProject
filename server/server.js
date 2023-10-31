const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

mongoose.connect(
  "mongodb+srv://jayeshjadhav1411:jB3UcAjurtNMDOFu@cluster0.owmmr56.mongodb.net/healthCare?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.once("open", () => {
  console.log("DB Connection Established");
});

const app = express();

// app.use(morgan("dev"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/patientData", async (req, res) => {
  const patientMailID = req.query.patientMailID;
  try {
    const data = await db
      .collection("patientData")
      .find({ patientMailId: patientMailID })
      .toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(data));
  } finally {
    res.end();
  }
});

app.post("/hideFromDoctor", async (req, res) => {
  const prescriptionId = req.body.hidePresID;
  const hideFromDoctorId = req.body.hideDocMailId;
  try {
    const check = await db.collection("patientData").updateMany(
      {
        "prescription.prescriptionId": prescriptionId,
      },
      {
        $push: {
          "prescription.$[elem].hideFromDoctorId": ", " + hideFromDoctorId,
        },
      },
      {
        arrayFilters: [
          {
            "elem.prescriptionId": prescriptionId,
          },
        ],
      }
    );

    if (check) {
      res.json(JSON.stringify(check));
    } else {
      res.json("Error");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/addPrescription", async (req, res) => {
  const { patientMailId, prescriptionName, addedOn, doctorName, medicines } =
    req.body;
  try {
    const result = db.collection("patientData").aggregate([
      {
        $match: {
          patientMailId: patientMailId,
        },
      },
      {
        $project: {
          prescriptionCount: { $size: "$prescription" },
        },
      },
      {
        $project: {
          prescriptionCountString: { $toString: "$prescriptionCount" },
        },
      },
    ]);
    const prescriptionCountString = await result.toArray();
    console.log(prescriptionCountString);

    const prescriptionCount =
      prescriptionCountString[0]?.prescriptionCountString;

    console.log(
      `Prescription count for ${patientMailId}: ${prescriptionCount}`
    );
    const finalCount = (parseInt(prescriptionCount) + 1).toString();

    const check = await db.collection("patientData").updateOne(
      { patientMailId: patientMailId },
      {
        $push: {
          prescription: {
            prescriptionName: prescriptionName,
            prescriptionId: finalCount,
            addedOn: addedOn,
            doctorName: doctorName,
            hideFromDoctorId: [],
            medicines: medicines,
          },
        },
      }
    );

    if (check) {
      res.json(check.modifiedCount);
    } else {
      res.json("Error");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/sendOtp", async (req, res) => {
  const otp = req.body.otp;
  const receiverEmail = req.body.receiverEmail;
  console.log(otp);
  console.log(receiverEmail);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jayeshjadhav1411@gmail.com",
      pass: "euxolwbonzrxyibv",
    },
  });

  const mailOptions = {
    from: "jayeshjadhav1411@gmail.com",
    to: receiverEmail,
    subject: "OTP to get patient details",
    html: `${otp} is your OTP`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});
