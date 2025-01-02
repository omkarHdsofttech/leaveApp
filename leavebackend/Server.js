
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
/* const SendMail = require("../SendMail");
 */
const server = express();

const crypto = require('crypto');


const serverless = require('serverless-http');
require("dotenv").config();


main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(`${process.env.DBURL}`, {});
  console.log("db connected");
}

// server.use(bodyParser.json({ limit: '5mb' }));
// server.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },

});
async function getNextTLId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'TL_id' }, // Use 'TL_id' as the identifier for this counter
    { $inc: { seq: 1 } }, // Increment the sequence
    { new: true, upsert: true } // Create the counter document if it doesn't exist
  );

  // Format the sequence to 'L001', 'L002', etc.
  const nextId = `L${String(counter.seq).padStart(3, '0')}`;
  return nextId;
}
async function getNextEPId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'U_id' }, // Use 'TL_id' as the identifier for this counter
    { $inc: { seq: 1 } }, // Increment the sequence
    { new: true, upsert: true } // Create the counter document if it doesn't exist
  );

  // Format the sequence to 'L001', 'L002', etc.
  const nextId = `E${String(counter.seq).padStart(3, '0')}`;
  return nextId;
}

const Counter = mongoose.model("counter", counterSchema);

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
}
const designationSchema = new mongoose.Schema({
  D_id: { type: String, unique: true },
  Designame: String,
  Activeyn: String,
});

const Designation_master = mongoose.model(
  "Designation_master",
  designationSchema
);

const departmentSchema = new mongoose.Schema({
  DP_id: { type: String, unique: true },
  DP_name: String,
  activeyn: String,
});
const Department_master = mongoose.model("Department_master", departmentSchema);

const leaveTypeSchema = new mongoose.Schema({
  LeaveType_id: { type: String, unique: true },
  LeaveType_name: String,
  LeaveTypeactiveyn: String,
});
const leaveType_master = mongoose.model(" leaveType_master", leaveTypeSchema);

const teamleaderSchema = new mongoose.Schema({
  TL_id: { type: String, unique: true },
  Name: String,
  Designation: String,
  Department: String,
  Temail: String,
});
const teamleader_master = mongoose.model("teamleader_master", teamleaderSchema);

const hierarchySchema = new mongoose.Schema({
  hierarchy_id: { type: String, unique: true },
  user_id: String,
  hierarchy_srno: String,
  teamleader_id: String,
  teamleader_desig: String,
  hierarchy_activefromdate: Date,
  hierarchy_activetodate: Date,
  hierarchy_latestyn: String,
  hierarchy_activeyn: String,
  create_date: Date,
  create_user: String,
  create_host: String,
});
const hierarchy_tbl = mongoose.model("hierarchy_tbl", hierarchySchema);


const userSchema = new mongoose.Schema({
  U_id: { type: String, unique: true },
  U_name: String,
  f_name: String,
  l_name: String,
  m_name: String,
  U_desig: String,
  U_email: String,
  U_password: String,
  Activeyn: String,
  DOJ: Date,
  gender: String,
  U_phone: String,
  U_DOB: Date,
  age: Number,
  U_maritalstatus: String,
  nationality: String,
  phyhandicap: String,
  State: String,
  City: String,
  Pincode: String,
  address: String,
  user: String,
  host: String,
  createdate: Date,
  delsn: String,
  deldate: Number,
  deluser: String,
});

const user_masters = mongoose.model("user_masters", userSchema);

const leaveapplnSchema = new mongoose.Schema({
  leaveappln_id: { type: String, unique: true },
  leaveappln_date: String,
  leaveappln_appliedto: String,
  user_id: String,
  leaveappln_user: String,
  leaveappln_host: String,
  leaveappln_createdate: String,
  activeyn: { type: String, default: "Y" },
});
const leaveappln_tbl = mongoose.model("leaveappln_tbl ", leaveapplnSchema);

const leaveapplndtlSchema = new mongoose.Schema({
  leaveappln_id: { type: String, unique: true },
  leaveappln_date: String,
  LeaveType: String,
  leaveappln_reason: String,
  FullDay: [Array],
  HalfDay: [Array],
  MorningHalf: [Array],
  AfternoonHalf: [Array],
  user_desig: String,
  teamleaderEmail: String,
  teamleaderid: String,
  status: { type: String, default: "Pending" },
  user_id: String,
  U_name: String,
  emplyEmail: String,
  StartDate: Date,
  EndDate: Date,
  DOJ: String,
  totalLeaveDays: Number,
  activeyn: { type: String, default: "Y" },
  leaveappln_user: String,
  leaveappln_host: String,
  leaveappln_createdate: String
});

const leaveapplndtl_tbl = mongoose.model(
  "leaveapplndtl_tbl ",
  leaveapplndtlSchema
);

const leaveBalanceSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  alloted_SL: Number,
  alloted_CL: Number,
  alloted_PL: Number,
  alloted_LWP: Number,
  alloted_ML: Number,
  alloted_PTL: Number,
  taken_SL: Number,
  taken_CL: Number,
  taken_PL: Number,
  taken_LWP: Number,
  taken_ML: Number,
  taken_PTL: Number,
  remaining_SL: Number,
  remaining_CL: Number,
  remaining_PL: Number,
  remaining_LWP: Number,
  remaining_ML: Number,
  remaining_PTL: Number,
});
const leaveapplBalance = mongoose.model("leaveapplBalance", leaveBalanceSchema);

const forwardSchema = new mongoose.Schema({
  leaveappln_id: String,

  movedto_id: String,
  movedto_email: String,
  movedto_name: String,
  selcetd_status: String,
  Remark: String,
});
const forward_tbl = mongoose.model("forward_tbl", forwardSchema);

const movementSchema = new mongoose.Schema({
  leaveappln_id: String,
  leaveappln_SN: Array,
  movedfrom_id: String,
  movedfrom_desig: String,
  movedto_id: String,
  movedto_desig: String,
  moved_action: String,
  moved_remark: String,
  moved_actiondate: String,
  activeyn: String,
  latestyn: String
});
const movement_tbl = mongoose.model("movement_tbl", movementSchema);

const publicHolidaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true, unique: true },
  year: { type: Number, required: true },
  description: { type: String },
  createdBy: { type: String }, // Optional: Admin user ID
  createdAt: { type: Date, default: Date.now },
});
const PublicHoliday = mongoose.model('PublicHoliday', publicHolidaySchema);




const docnamemasterSchema = new mongoose.Schema({
  docname_id: String,
  docname_name: String,
  // docname_activeyn:String,
});
const docnamemaster_tbl = mongoose.model(
  "docnamemaster_tbl",
  docnamemasterSchema
);

// doc_byte:String,
// docname_id:String,
// doc_activeyn:String,
// doc_user:String,
// doc_date:String,
// doc_host:String,
// docn_name:String,
// leaveappln_id:String,
const docSchema = new mongoose.Schema({
  leaveappln_id: String,
  doc_srno: Array,
  doc_ext: Array,
  docname_id: String,
  docn_name: String,
  binary_data: Buffer,
});
const doc_tbl = mongoose.model("doc_tbl", docSchema);


const userotpSchema = new mongoose.Schema({
  user_otp_empid: String,
  user_otp_srno: Number,
  user_otp_emailid: String,
  user_otp_gendatetime: String,
  user_otp_otpno: Number,
  user_otp_useddatetime: String,
  user_otp_activeyn: String,
  user_otp_latestyn: String,

});
const userotp_tbl = mongoose.model("userotp_tbl", userotpSchema);

server.use(cors());
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


server.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await user_masters.findOne({ U_email: email });

    if (!user) {
      // If user is not found, send an error response
      return res.status(404).json({ error: "Invalid credentials" });
    }

    // Compare the hashed password with the provided password
    const passwordMatch = await bcrypt.compare(password, user.U_password);

    if (passwordMatch) {
      // Passwords match, login successful

      // Destructure user object for required fields
      const { U_desig, U_id, DOJ, U_name } = user;

      if (U_desig === "D003" || U_desig === "D002" || U_desig === "D011" || U_desig === "D012" || U_desig === "D010") {
        // If user is a team leader, fetch their TL_id
        const teamLeader = await teamleader_master.findOne({ Temail: email });
        if (teamLeader) {
          // Team leader found, send response with TL_id
          return res.status(200).json({
            message: "Login successful",
            U_desig,
            U_id,
            DOJ,
            U_name,
            TL_id: teamLeader.TL_id,
          });
        } else {
          // Team leader not found, send error response
          return res.status(404).json({ error: "Team leader not found with this email" });
        }
      } else {
        // User is not a team leader, send response without TL_id
        return res.status(200).json({
          message: "Login successful",
          U_desig,
          U_id,
          DOJ,
          U_name,
        });
      }
    } else {
      // Passwords don't match, send an error response
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.post('/userdata', async (req, res) => {
  console.log("POST request received with data:", req.body);
  try {
    const {
      U_id, DOJ, leaveType, totalLeaveDays, U_name, tid, serialNumbers, user, host, udate, emplyemail, teamLeaderEmail,
      fileExtensions, docId, docName, base64DataArray, reason, fullDayLeaves, halfDayLeaves, morningHalfLeaves, afternoonHalfLeaves, activeyn
    } = req.body; // Extract totalLeaveDays from the request body
    console.log("Extracted tid:", tid, user, host, udate);

    const userLeaveBalance = await leaveapplBalance.findOne({ user_id: U_id });

    if (!userLeaveBalance) {
      console.log("User not found in leave balance table:", U_id);
      return res.status(404).json({ message: "User not found in leave balance table" });
    }

    console.log("User found in leave balance table:", userLeaveBalance);

    // Fetch remaining leave balance based on selected leave type
    let remainingLeavetype;
    switch (leaveType) {
      case "Sick Leave":
        remainingLeavetype = userLeaveBalance.remaining_SL;
        break;
      case "Casual Leave":
        remainingLeavetype = userLeaveBalance.remaining_CL;
        break;
      case "Privilege Leave":
        remainingLeavetype = userLeaveBalance.remaining_PL;
        break;
      case "Maternity Leave":
        remainingLeavetype = userLeaveBalance.remaining_ML;
        break;
      case "Leave Without Pay":
        remainingLeavetype = userLeaveBalance.remaining_LWP;
        break;
      case "Paternity Leave":
        remainingLeavetype = userLeaveBalance.remaining_PTL;
        break;
      default:
        remainingLeavetype = 0;
    }

    // Compare remaining leave balance with total leave days
    if (remainingLeavetype < totalLeaveDays) {
      // If total leave days exceed remaining balance, return error response
      return res.status(400).json({ message: `No Enough Balance` });
    } else {

      const selectedDates = req.body.selectedDates; // Assuming you have an array of selected dates in req.body.selectedDates
      // console.log("Selected Dates:", selectedDates);

      // Save the leave application details using the selected dates
      const leaveappln_id = 'L' + ('000' + await getNextSequenceValue('leaveappln')).slice(-3);

      // Find the LeaveType_id based on the LeaveType_name
      const selectedLeaveType = await leaveType_master.findOne({ LeaveType_name: leaveType });

      // Find the team leader details based on the provided name
      const teamLeaderDetails = await teamleader_master.findOne({ Name: req.body.teamLeader });
      const teamLeaderEmail = teamLeaderDetails ? teamLeaderDetails.Temail : '';
      const teamLeaderId = teamLeaderDetails ? teamLeaderDetails.TL_id : '';
      // const startDate = new Date(req.body.startDate);
      // const endDate = new Date(req.body.endDate);

      const newLeaveApplication = new leaveappln_tbl({
        leaveappln_id,
        leaveappln_date: req.body.currentDate,
        leaveappln_appliedto: req.body.teamLeader,
        user_id: U_id,
        leaveappln_user: user,
        leaveappln_host: host,
        leaveappln_createdate: udate,
        activeyn: activeyn,
      });

      const savedLeaveApplication = await newLeaveApplication.save();

      if (serialNumbers && serialNumbers.length > 0) {
        for (let i = 0; i < serialNumbers.length; i++) {
          const docEntry = new doc_tbl({
            leaveappln_id,
            doc_srno: serialNumbers[i],
            doc_ext: fileExtensions[i],
            docname_id: docId,
            docn_name: docName,
            binary_data: await Buffer.from(base64DataArray[serialNumbers[i] - 1], "base64")
          });
          console.log("docentry", docEntry)
          await docEntry.save();
        }
      }

      const newLeaveApplicationdtl = new leaveapplndtl_tbl({
        leaveappln_id,
        leaveappln_date: req.body.currentDate,
        LeaveType: selectedLeaveType.LeaveType_id,
        leaveappln_reason: req.body.reason,
        FullDay: req.body.fullDayLeaves,
        HalfDay: req.body.halfDayLeaves,
        MorningHalf: req.body.morningHalfLeaves,
        AfternoonHalf: req.body.afternoonHalfLeaves,
        user_id: U_id, emplyEmail: emplyemail,
        teamleaderEmail: req.body.teamLeaderEmail,
        teamleaderid: req.body.tid,
        totalLeaveDays: totalLeaveDays,
        DOJ: DOJ,
        U_name: U_name,
        StartDate: req.body.startDate, // Correctly access startDate from req.body
        EndDate: req.body.endDate, activeyn: req.body.activeyn,
        leaveappln_user: user,
        leaveappln_host: host,
        leaveappln_createdate: udate
      });

      await newLeaveApplicationdtl.save();

      console.log("newup", newLeaveApplicationdtl);

      // Send email if the application is not saved as a draft
      if (activeyn !== 'X') {
        const transporter = nodemailer.createTransport({
          service: 'outlook', // e.g., Gmail, Outlook, etc.
          auth: {
            user: 'support@hdsofttech.com',
            pass: 'Sup04122024'
          }
        });

        let leaveDetails = `
  <p>Hello,</p>
  <p>A leave application has been submitted by <strong>${U_name}</strong> (<a href="mailto:${emplyemail}">${emplyemail}</a>).</p>
  <p>Details of the leave application are as follows:</p>
  <p><strong>Leave Type:</strong> ${leaveType}</p>
  <p><strong>Reason:</strong> ${reason}</p>
`;
        leaveDetails += `<p><strong>Full Day Leaves:</strong> ${fullDayLeaves || '-'}</p>`;
        leaveDetails += `<p><strong>First Half Leaves:</strong> ${morningHalfLeaves || '-'}</p>`;
        leaveDetails += `<p><strong>Second Half Leaves:</strong> ${afternoonHalfLeaves || '-'}</p>`;

        leaveDetails += `
<p>Click <a href="http://auditace.hdsofttech.org/" target="_blank">&nbsp;View Leave application&nbsp;</a> to review the leave application.</p>
  <p>*** This is an auto-generated notification, please do not reply to this email. In case of any queries, write to us at
  <a href="mailto:info@hdsoft.com">info@hdsoft.com</a> ***</p>
`;


        const mailOptions = {
          from: {
            name: 'Leave Management',
            address: 'info@hdsofttech.com'
          },
          to: req.body.teamLeaderEmail,
          subject: 'Requesting Leave',
          html: leaveDetails
        };

        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send("Failed to send Application. Please try again later.");
          } else {
            console.log('Email sent: ' + info.response);
            return res.json({ status: "User Exists", userId: U_id });
          }
        });
      } else {
        return res.status(200).json({ message: "Leave application saved as draft", data: savedLeaveApplication });
      }

      return res.status(200).json({ message: "Leave application saved successfully", data: savedLeaveApplication });
    }
  } catch (error) {
    console.error("Error saving leave application:", error);
    return res.status(500).send("Internal server error");
  }
});



server.get("/docdata", async (req, res) => {
  try {
    // Get the binary data from your table
    const docData = await doc_tbl.find({}, "binary_data");
    // Convert buffer to base64 before sending to the frontend
    const base64DataArray = docData.map(doc => doc.binary_data.toString('base64'));
    res.status(200).json({ data: base64DataArray }); // Sending back as a JSON object
  } catch (error) {
    console.error("Error fetching document data:", error);
    res.status(500).send("Internal server error");
  }
});
// server.get("/check-document/:leaveappln_id", async (req, res) => {
//   try {
//     // Extract the leaveappln_id from the URL params
//     const { leaveappln_id } = req.params;

//     // Log the received leaveappln_id
//     console.log("Received leave application ID:", leaveappln_id);

//     // Check if a document with the given leaveappln_id exists in doc_tbls
//     const document = await doc_tbl.findOne({ leaveappln_id: leaveappln_id });
//     console.log("doc", document);

//     if (document) {
//       // Document found, include the matched leave application ID in the response
//       console.log("Document found for leave application ID:", leaveappln_id);
//       res.status(200).json({ 
//         message: "Document present for the given leave application ID",
//         matched_leaveappln_id: leaveappln_id  // Include matched ID here
//       });
//     } else {
//       // No document found
//       console.log("No document found for leave application ID:", leaveappln_id);
//       res.status(404).json({ 
//         message: "No document present for the given leave application ID",
//         matched_leaveappln_id: null  // Indicate no match
//       });
//     }
//   } catch (error) {
//     // Handle errors gracefully
//     console.error("Error checking document:", error);
//     res.status(500).send("Internal server error");
//   }
// });
server.get("/check-document/:leaveappln_id", async (req, res) => {
  try {
    // Extract the leaveappln_id from the URL params
    const { leaveappln_id } = req.params;

    // Log the received leaveappln_id
    console.log("Received leave application ID:", leaveappln_id);

    // Check if a document with the given leaveappln_id exists in doc_tbl
    const document = await doc_tbl.findOne({ leaveappln_id: leaveappln_id });

    if (document && document.binary_data) {
      // Convert the binary data to Base64
      const base64Data = document.binary_data.toString('base64');

      // Return the document and matched ID in the response
      res.status(200).json({
        message: "Document present for the given leave application ID",
        matched_leaveappln_id: leaveappln_id,
        documentData: `data:application/pdf;base64,${base64Data}`  // Include MIME type if it's a PDF
      });
    } else {
      // No document found
      console.log("No document found for leave application ID:", leaveappln_id);
      res.status(404).json({
        message: "No document present for the given leave application ID",
        matched_leaveappln_id: null
      });
    }
  } catch (error) {
    // Handle errors gracefully
    console.error("Error checking document:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/teamleadermaster", async (req, res) => {
  try {
    // Get the binary data from your table (assuming it's base64-encoded or similar)
    const namerequest = await teamleader_master.find({}, " TL_id  Name");
    // console.log("data",docdata)
    res.status(200).json({ namerequest }); // Sending back as a JSON object
  } catch (error) {
    console.error("Error fetching document data:", error);
    res.status(500).send("Internal server error");
  }
});


server.get("/leavehistory", async (req, res) => {
  try {
    const leaveApplications = await leaveappln_tbl
      .find({ user_id: req.query.U_id })
      .populate("leaveappln_id");
    const leaveDetails = await leaveapplndtl_tbl
      .find({ user_id: req.query.U_id })
      .populate("leaveappln_id");

    res.status(200).json({ leaveApplications, leaveDetails });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/historyremark", async (req, res) => {
  try {
    // Get the binary data from your table (assuming it's base64-encoded or similar)
    const historyremark = await movement_tbl.find({}, " leaveappln_id moved_remark");
    // console.log("data",docdata)
    res.status(200).json({ historyremark }); // Sending back as a JSON object
  } catch (error) {
    console.error("Error fetching document data:", error);
    res.status(500).send("Internal server error");
  }
});


server.get("/leaveapprove", async (req, res) => {
  try {
    const leaveDetailss = await leaveapplndtl_tbl.find({
      user_id: req.query.U_id,
    });

    res.status(200).json({ leaveDetailss });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/leaverequest", async (req, res) => {
  try {
    const leaveDetails = await leaveapplndtl_tbl.find();

    res.status(200).json({ leaveDetails });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/leaverequestmovement", async (req, res) => {
  try {
    const requestmovement = await movement_tbl.find();

    res.status(200).json({ requestmovement });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/serialnoleaverequest", async (req, res) => {
  try {
    const serialnoleaverequest = await movement_tbl.find();

    res.status(200).json({ serialnoleaverequest });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.post("/leaverequestdatad", async (req, res) => {
  const {
    leaveid,
    teamLeader,
    tdesig,
    TL_id,
    U_desig,
    remark,
    status,
    Serial_No,
    actionDate, activeyn, latestyn
  } = req.body;
  console.log("daa", req.body)
  try {
    if (leaveid && U_desig && status && Serial_No) {
      const movementInstance = new movement_tbl({
        leaveappln_id: leaveid,
        leaveappln_SN: Serial_No,
        movedfrom_id: TL_id,
        movedfrom_desig: U_desig,
        movedto_id: teamLeader,
        movedto_desig: tdesig,
        moved_remark: remark,
        moved_action: status,
        moved_actiondate: actionDate,
        activeyn: activeyn,
        latestyn: latestyn
      });
      console.log("days", movementInstance)
      await movementInstance.save();
      res.status(200).send("Data saved to movement table successfully");
    } else {
      res.status(400).send("Missing required data");
    }
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).send("Error saving data to movement table");
  }
});

server.post("/leaverequestdataf", async (req, res) => {
  const {
    leaveid,
    TL_id,
    U_desig,
    serial,
    userrdesig,
    userrid,
    remark,
    status,
    actionDatef, activeyn, latestyn
  } = req.body;

  try {
    if (
      !leaveid ||
      !serial ||
      !userrid ||
      !userrdesig ||
      !TL_id ||
      !U_desig ||
      !status
    ) {
      return res.status(400).send("Missing required fields");
    }

    // Check if an entry with this leaveid and serial already exists
    const existingEntry = await movement_tbl.findOne({
      leaveappln_id: leaveid,
      leaveappln_SN: serial,
    });

    if (existingEntry) {
      return res.status(409).send("Duplicate entry detected"); // Return a 409 status for conflict
    }

    const movementInstance = new movement_tbl({
      leaveappln_id: leaveid,
      leaveappln_SN: serial,
      movedfrom_id: TL_id,
      movedfrom_desig: U_desig,
      movedto_id: userrid,
      movedto_desig: userrdesig,
      moved_remark: remark,
      moved_action: status,
      moved_actiondate: actionDatef,
      activeyn: activeyn,
      latestyn: latestyn
    });

    await movementInstance.save();

    res.status(200).send("Data saved to movement table successfully");
  } catch (error) {
    console.error("Error saving data to movement table:", error);
    res.status(500).send("Error saving data to movement table");
  }
});






server.post("/logdata", async (req, res) => {
  const {
    leaveappln_id,
    status,
    remark,
    teamleader_id,
    teamleader_desig,
    actionDate, activeyn, latestyn
  } = req.body;

  console.log("Request body:", req.body);

  try {
    // Validate that all necessary fields are present
    if (
      leaveappln_id &&
      teamleader_id &&
      teamleader_desig &&
      remark &&
      status &&
      actionDate && activeyn && latestyn
    ) {
      const parsedActionDate = new Date(actionDate); // Parse the date

      const movementInstance = new movement_tbl({
        leaveappln_id,
        leaveappln_SN: 1,
        movedfrom_id: teamleader_id,
        movedfrom_desig: teamleader_desig,
        moved_remark: remark,
        moved_action: status,
        moved_actiondate: parsedActionDate,
        activeyn: activeyn,
        latestyn: latestyn
      });

      await movementInstance.save();
      res.status(200).send({ success: true, message: "Data saved successfully" });
    } else {
      res.status(400).send({ success: false, message: "Missing required fields" });
    }
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});





server.get("/movementapproveforward", async (req, res) => {
  try {
    const approveforwarddetails = await movement_tbl.find();
    res.status(200).json({ approveforwarddetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/teamleader", async (req, res) => {
  try {
    const teamleaderDetails = await teamleader_master.find();
    res.status(200).json({ teamleaderDetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});
server.get("/movementTL", async (req, res) => {
  try {
    const movementdetails = await movement_tbl.find(
      {},
      "leaveappln_id movedto_id"
    );
    res.status(200).json({ movementdetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});
server.get("/movementleavedtl", async (req, res) => {
  try {
    // const leaveDetails = await leaveapplndtl_tbl.find();
    const movementleavedetails = await leaveapplndtl_tbl.find();
    res.status(200).json({ movementleavedetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/editdraftteamleader", async (req, res) => {
  try {
    const teamleaderDetails = await teamleader_master.find(
      {},
      "Name TL_id Temail"
    );
    res.status(200).json({ teamleaderDetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/editdraftleavetype", async (req, res) => {
  try {
    const leavetypeDetails = await leaveType_master.find(
      {},
      "LeaveType_name LeaveType_id "
    );
    res.status(200).json({ leavetypeDetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/hierarchy", async (req, res) => {
  try {
    const hierarchyDetails = await hierarchy_tbl.find(
      { hierarchy_srno: 1 },
      "user_id teamleader_id"
    );
    res.status(200).json({ hierarchyDetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/teamleaderhierachy", async (req, res) => {
  try {
    const teamleaderhierachy = await teamleader_master.find(
      {},
      "TL_id Name Temail"
    );
    res.status(200).json({ teamleaderhierachy });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/usermasterrequest", async (req, res) => {
  try {
    const usermasterdetail = await user_masters.find({}, "U_id U_desig");
    res.status(200).json({ usermasterdetail });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/usermasteleaveapplication", async (req, res) => {
  try {
    const usermasterdetail = await user_masters.find({}, "U_id gender");
    res.status(200).json({ usermasterdetail });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/hierarchys", async (req, res) => {
  try {
    const hierarchyDetails = await hierarchy_tbl.find(
      {},
      "user_id teamleader_id teamleader_desig"
    );
    res.status(200).json({ hierarchyDetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});
server.get("/teamleaderhierachys", async (req, res) => {
  try {
    const teamleaderhierachy = await teamleader_master.find(
      {},
      "TL_id Name Temail Designation"
    );
    res.status(200).json({ teamleaderhierachy });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/requestbalance", async (req, res) => {
  try {
    const balanceDetails = await leaveapplBalance.find();
    res.status(200).json({ balanceDetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/forwardlid", async (req, res) => {
  try {
    const fapplication = await leaveapplndtl_tbl.find();
    res.status(200).json({ fapplication });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});


server.patch("/leaverequest/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const { status, remark } = req.body; // Extract status and remark from the request body
    console.log("status ", req.body.status);
    // Update the leave request in the database with the provided status and remark
    const updatedLeaveRequest = await leaveapplndtl_tbl.findOneAndUpdate(
      { leaveappln_id: id },
      { status, remark },
      { new: true }
    );

    if (status === "Approved") {
      // Fetch the user's data from the balance table
      const userBalanceData = await leaveapplBalance.findOne({
        user_id: updatedLeaveRequest.user_id,
      });

      // Determine which fields to log based on the leave type
      let allotedField, takenField, remainingField, leaveTypeName;
      switch (updatedLeaveRequest.LeaveType) {
        case "SL":
          leaveTypeName = "Sick Leave";
          allotedField = "alloted_SL";
          takenField = "taken_SL";
          remainingField = "remaining_SL";
          break;
        case "CL":
          leaveTypeName = "Casual Leave";
          allotedField = "alloted_CL";
          takenField = "taken_CL";
          remainingField = "remaining_CL";
          break;
        case "PL":
          leaveTypeName = "Privilege Leave";
          allotedField = "alloted_PL";
          takenField = "taken_PL";
          remainingField = "remaining_PL";
          break;
        case "LWP":
          leaveTypeName = "Leave Without Pay";
          allotedField = "alloted_LWP";
          takenField = "taken_LWP";
          remainingField = "remaining_LWP";
          break;
        case "ML":
          leaveTypeName = "Maternity Leave";
          allotedField = "alloted_ML";
          takenField = "taken_ML";
          remainingField = "remaining_ML";
          break;
        case "PTL":
          leaveTypeName = "Paternity Leave";
          allotedField = "alloted_PTL";
          takenField = "taken_PTL";
          remainingField = "remaining_PTL";
          break;
        default:
          console.error("Invalid Leave Type");
          return res.status(400).send("Invalid Leave Type");
      }

      // Log the previous leave balance before updating
      console.log("Previous Leave Balance:");
      console.log("Alloted:", userBalanceData[allotedField]);
      console.log("Taken:", userBalanceData[takenField]);
      console.log("Remaining:", userBalanceData[remainingField]);

      userBalanceData[takenField] += updatedLeaveRequest.totalLeaveDays;
      userBalanceData[remainingField] -= updatedLeaveRequest.totalLeaveDays;

      // Ensure remaining leave balance doesn't go below 0
      userBalanceData[remainingField] = Math.max(
        0,
        userBalanceData[remainingField]
      );



      // Save the updated balance data
      await userBalanceData.save();

      // Log the updated leave balance after updating
      console.log("Updated Leave Balance:");
      console.log("Alloted:", userBalanceData[allotedField]);
      console.log("Taken:", userBalanceData[takenField]);
      console.log("Remaining:", userBalanceData[remainingField]);
    }

    res.status(200).json({ message: "Leave request updated successfully" });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/leavebalances", async (req, res) => {
  try {
    const U_id = await req.headers.authorization;
    console.log('id', U_id)
    // Fetch only approved leave applications
    const leaveBalances = await leaveapplBalance.find({
      user_id: U_id,
    });
    console.log(
      "balance", leaveBalances
    )
    await res.status(200).json({ leaveBalances });
  } catch (error) {
    console.error("Error fetching leave balances:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/picture", async (req, res) => {
  try {
    const U_id = req.headers.authorization; // Get U_id from request headers

    // Fetch the user by U_id from the user_master collection
    const user = await user_master.findOne({ U_id: U_id }).select('profilePicture');

    if (user) {
      console.log('Profile Picture inn:', user.profilePicture);
      res.json({ profilePicture: user.profilePicture });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).send("Internal server error");
  }
});



server.get("/leavebalancesleavetype", async (req, res) => {
  try {
    // const { U_id } = req.query;
    // Fetch only approved leave applications
    const leaveBalancesleavetype = await leaveType_master.find({}, 'LeaveType_name');
    res.status(200).json({ leaveBalancesleavetype });
  } catch (error) {
    console.error("Error fetching leave balances:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/teamleader/names_departments", async (req, res) => {
  try {
    const departments = await Department_master.find({}, "DP_name"); // Fetch only the department names
    const teamLeaders = await teamleader_master.find({}, "Name"); // Fetch only the team leader names
    res
      .status(200)
      .json({
        departments: departments.map((dep) => dep.DP_name),
        teamLeaders: teamLeaders.map((leader) => leader.Name),
      }); // Send both department names and team leader names to the frontend
  } catch (error) {
    console.error("Error fetching departments and team leaders:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/department", async (req, res) => {
  try {
    const { id } = req.query;
    const department = await Department_master.findOne({ DP_name: id });
    res.status(200).json({ DP_id: department.DP_id });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/teamleader/names_departments", async (req, res) => {
  try {
    const teamLeaders = await teamleader_master.find({}, "Name"); // Fetch only the team leader names
    res
      .status(200)
      .json({ teamLeaders: teamLeaders.map((leader) => leader.Name) }); // Send only team leader names to the frontend
  } catch (error) {
    console.error("Error fetching team leaders:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/teamleader/email-id", async (req, res) => {
  try {
    const { name } = req.query;
    const teamLeader = await teamleader_master.findOne({ Name: name });
    if (teamLeader) {
      res
        .status(200)
        .json({ Temail: teamLeader.Temail, TL_id: teamLeader.TL_id });
    } else {
      res.status(404).json({ message: "Team leader not found" });
    }
  } catch (error) {
    console.error("Error fetching team leader email and ID:", error);
    res.status(500).send("Internal server error");
  }
});
server.post("/forwardrequest", async (req, res) => {
  try {
    const {
      leaveappln_id,
      movedto_id,
      movedto_email,
      movedto_name,
      selected_status,
      Remark,
    } = req.body;

    // Create a new document in forward_tbl collection
    const newForwardRequest = new forward_tbl({
      leaveappln_id,
      movedto_id,
      movedto_email,
      movedto_name,
      selected_status,
      Remark,
    });

    // Save the new document to the database
    await newForwardRequest.save();

    // Send a success response to the frontend
    res.status(200).json({ message: "Forward request saved successfully" });
  } catch (error) {
    console.error("Error saving forward request:", error);
    // Send an error response to the frontend
    res.status(500).send("Internal server error");
  }
});

server.post("/movementrequests", async (req, res) => {
  try {
    const {
      leaveappln_id,
      movedto_id,
      movedto_desig,
      movedfrom_id,
      movedfrom_desig,
      moved_remark,
    } = req.body;

    // Create a new document in forward_tbl collection
    const newmovementRequest = new movement_tbl({
      leaveappln_id,
      movedto_id,
      movedto_desig,
      movedfrom_id,
      movedfrom_desig,
      moved_remark,
    });

    // Save the new document to the database
    await newmovementRequest.save();

    // Send a success response to the frontend
    res.status(200).json({ message: "Forward request saved successfully" });
  } catch (error) {
    console.error("Error saving forward request:", error);
    // Send an error response to the frontend
    res.status(500).send("Internal server error");
  }
});

server.get("/forwardrequests", async (req, res) => {
  try {
    const forwardRequests = await forward_tbl.find();
    res.status(200).json({ forwardRequests });
  } catch (error) {
    console.error("Error fetching forward requests:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/summarypage", async (req, res) => {
  try {
    const summaryDetails = await leaveapplndtl_tbl.find();
    res.status(200).json({ summaryDetails });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/summaryleader", async (req, res) => {
  try {
    const teamleader = await teamleader_master.find();

    res.status(200).json({ teamleader });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/editdraft", async (req, res) => {
  try {
    const teamleader = await teamleader_master.find();

    res.status(200).json({ teamleader });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/editleader", async (req, res) => {
  try {
    const teamleader = await teamleader_master.find();
    res.status(200).json({ teamleader });
  } catch (error) {
    console.error("Error fetching team leader details:", error);
    res.status(500).send("Internal server error");
  }
});

server.patch("/updateLeaveApplication/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    console.log("new", newData);

    // Update the leave application details in the database based on the leaveappln_id
    const updatedLeaveApplication = await leaveapplndtl_tbl.findOneAndUpdate(
      { leaveappln_id: id },
      newData,
      { new: true }
    );

    if (updatedLeaveApplication) {
      if (newData.activeyn === 'Y') {
        // Leave type mapping
        const leaveTypeMapping = {
          SL: 'Sick Leave',
          CL: 'Casual Leave',
          ML: 'Maternity Leave',
          PL: 'Privilege Leave',
          PTL: 'Paternity Leave',
          LWP: 'Leave Without Pay'
        };

        const leaveType = leaveTypeMapping[newData.LeaveType] || newData.LeaveType;

        // Prepare email details
        const transporter = nodemailer.createTransport({
          service: 'outlook',
          auth: {
            user: 'info@hdsofttech.com',
            pass: 'Kup58869'
          }
        });

        const leaveDetails = `
          <p>Hello,</p>
          <p>A leave application has been submitted by <strong>${newData.U_name}</strong> (<a href="mailto:${newData.emplyEmail}">${newData.emplyEmail}</a>).</p>
          <p>Details of the leave application are as follows:</p>
          <p><strong>Leave Type:</strong> ${leaveType}</p>
          <p><strong>Reason:</strong> ${newData.leaveappln_reason}</p>
          ${newData.FullDay ? `<p><strong>Full Day Leaves:</strong> ${newData.FullDay}</p>` : ''}
          ${newData.MorningHalf ? `<p><strong>First Half Leaves:</strong> ${newData.MorningHalf}</p>` : ''}
          ${newData.AfternoonHalf ? `<p><strong>Second Half Leaves:</strong> ${newData.AfternoonHalf}</p>` : ''}

        <p>*** This is an auto-generated notification, please do not reply to this email. In case of any queries, write to us at
        <a href="mailto:info@hdsoft.com">info@hdsoft.com</a> ***</p>
      `;

        const mailOptions = {
          from: {
            name: 'Leave Management',
            address: 'info@hdsofttech.com'
          },
          to: newData.teamleaderEmail,
          subject: 'Requesting Leave',
          html: leaveDetails
        };

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send("Failed to send update notification. Please try again later.");
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({
              message: "Leave application updated successfully and email notification sent",
              data: updatedLeaveApplication,
            });
          }
        });
      } else {
        // If activeyn is 'X', skip sending the email
        return res.status(200).json({
          message: "Leave application updated successfully",
          data: updatedLeaveApplication,
        });
      }
    } else {
      res.status(404).json({ message: "Leave application not found" });
    }
  } catch (error) {
    console.error("Error updating leave application:", error);
    res.status(500).send("Internal server error");
  }
});


server.post("/leaverequestdata", (req, res) => {
  const requestData = req.body;
  console.log("Received data from client:", requestData);

  res.sendStatus(200); // Send success status
});

server.get("/docmaster", async (req, res) => {
  try {
    const docmasterdetail = await docnamemaster_tbl.find();
    res.status(200).json({ docmasterdetail });
  } catch (error) {
    console.error("Error fetching team leader data:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/leavesummaryuser", async (req, res) => {
  try {
    const leavesummaryuserDetails = await user_masters.find(
      {},
      "U_id U_name DOJ"
    );

    res.status(200).json({ leavesummaryuserDetails });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/leavesummarybalance", async (req, res) => {
  try {
    const leavesummarybalanceDetails = await leaveapplBalance.find(
      {},
      "user_id alloted_SL alloted_CL alloted_PL alloted_LWP alloted_ML alloted_PTL taken_SL taken_CL taken_PL taken_LWP taken_ML taken_PTL"
    );

    res.status(200).json({ leavesummarybalanceDetails });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/leavesummaryfilter", async (req, res) => {
  try {
    const leaveApplicationssummary = await leaveapplndtl_tbl.find({}, 'user_id StartDate EndDate status totalLeaveDays LeaveType')

    res.status(200).json({ leaveApplicationssummary });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/pendingcolumn", async (req, res) => {
  try {
    const pendingcolumn = await leaveapplndtl_tbl.find({}, "leaveappln_id  user_id LeaveType totalLeaveDays"); // Fetch only the team leader names
    res
      .status(200)
      .json({ pendingcolumn }); // Send only team leader names to the frontend
  } catch (error) {
    console.error("Error fetching team leaders:", error);
    res.status(500).send("Internal server error");
  }
});



const userMasterSchema = new mongoose.Schema({
  U_id: String,
  U_name: String,
  U_desig: String,
  U_email: String,
  U_password: String,
  Activeyn: { type: String, default: 'Y' },
  DOJ: String,
  gender: String,
  U_phone: String,
  f_name: String,
  l_name: String,
  m_name: { type: String, default: '' },
  U_DOB: String,
  age: Number,
  U_maritalstatus: String,
  nationality: String,
  phyhandicap: String,
  State: String,
  City: String,
  Pincode: String,
  address: String,
  user: { type: String, default: 'ADMIN' },
  host: { type: String, default: '127.0.0.1' },
  createdate: { type: String, default: new Date().toISOString() },
  delsn: { type: String, default: null },
  deldate: { type: String, default: null },
  deluser: { type: String, default: null },
  profilePicture: { type: String, default: '' },
});

const user_master = mongoose.model('user_master', userMasterSchema);
const teamleaderMasterSchema = new mongoose.Schema({
  TL_id: String,
  Name: String,
  Designation: String,
  Department: { type: String, default: '' }, // Default empty string
  Temail: String,
  activeyn: String,
});



server.post('/addEmployee', async (req, res) => {
  try {
    const employeeData = req.body;
    const { teamLeader } = req.body;
    console.log("data received", employeeData);
    console.log("dada", teamLeader)

    // Hash the password
    const hashedPassword = await bcrypt.hash(employeeData.U_password, 10);
    const nextEId = await getNextEPId();
    // Create the new user document using the model
    const newUser = new user_master({
      U_id: nextEId,
      U_name: `${employeeData.f_name} ${employeeData.l_name}`,
      U_desig: employeeData.U_desig,
      U_email: employeeData.U_email,
      U_password: hashedPassword,
      Activeyn: employeeData.Activeyn,
      DOJ: employeeData.DOJ,
      gender: employeeData.gender,
      U_phone: employeeData.U_phone,
      f_name: employeeData.f_name,
      l_name: employeeData.l_name,
      m_name: employeeData.m_name || '', // Default to empty string if not provided
      U_DOB: employeeData.U_DOB,
      age: parseInt(employeeData.age, 10), // Ensure it's stored as a number
      U_maritalstatus: employeeData.U_maritalstatus,
      nationality: employeeData.nationality,
      phyhandicap: employeeData.phyhandicap,
      State: employeeData.State,
      City: employeeData.City,
      Pincode: employeeData.Pincode,
      address: employeeData.address,
      user: 'ADMIN', // Default value
      host: '127.0.0.1', // Default value
      createdate: new Date().toISOString(), // Current timestamp
      delsn: null, // Null by default
      deldate: null, // Null by default
      deluser: null, // Null by default
      profilePicture: employeeData.profilePicture || '',
    });

    // Save the document to MongoDB
    await newUser.save();

    if (teamLeader === 'Y') {
      // Fetch the last TL_id and generate the next one
      const lastTeamLeader = await teamleader_master.findOne().sort({ TL_id: -1 }).exec();
      const lastId = lastTeamLeader?.TL_id || 'L000';
      const nextId = await getNextTLId();

      // Create the new team leader document
      const newTeamLeader = new teamleader_master({
        TL_id: nextId,
        Name: `${employeeData.f_name} ${employeeData.l_name}`,
        Designation: employeeData.U_desig,
        Department: employeeData.Department,
        Temail: employeeData.U_email,
        activeyn: teamLeader, // 'Y' or 'N'
      });

      await newTeamLeader.save();
    }

    // Respond with success
    res.status(201).send({
      message: 'Employee added successfully',
      data: newUser, // The inserted document
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).send('Internal server error');
  }
});

server.get("/udesigname", async (req, res) => {

  try {
    const udesigname = await Designation_master.find({}, "D_id Designame");
    console.log("Fetched designations:", udesigname);  // Log the fetched designations
    res.status(200).json({ udesigname });
  } catch (error) {
    console.error("Error fetching designations:", error);  // Error message in case of failure
    res.status(500).send("Internal server error");
  }
});




const nodemailer = require("nodemailer");


server.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await user_masters.findOne({ U_email: email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists" });
    } else {
      const userId = oldUser.U_id; // Assuming U_id is the field name


      const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP

      // Get the current date and time
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString(); // Format date as ISO string

      // Log the OTP and the date/time to the console
      console.log("Generated OTP:", otp);
      console.log("OTP Generation Time:", formattedDate);

      // Find the latest OTP entry for the user
      const latestOTPRecord = await userotp_tbl.findOne({ user_otp_empid: userId }).sort({ user_otp_srno: -1 });

      // Update the previous OTP entry to mark it as not the latest one
      if (latestOTPRecord) {
        latestOTPRecord.user_otp_latestyn = 'N';
        await latestOTPRecord.save();
      }

      // Find the latest serial number in the OTP table
      let nextSerialNo = 1;
      if (latestOTPRecord && latestOTPRecord.user_otp_srno) {
        nextSerialNo = latestOTPRecord.user_otp_srno + 1;
      }

      // Create a new document for the userotp_tbl collection
      const newOTPRecord = new userotp_tbl({
        user_otp_srno: nextSerialNo,
        user_otp_empid: userId,
        user_otp_emailid: email,
        user_otp_gendatetime: formattedDate,
        user_otp_otpno: otp,
        user_otp_activeyn: 'Y',
        user_otp_latestyn: 'Y'
      });

      // Save the document to the collection
      await newOTPRecord.save();

      const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'support@hdsofttech.com',
          pass: 'Sup04122024'
        }
      });

      const mailOptions = {
        from: {
          name: 'Leave Management',
          address: 'info@hdsofttech.com'
        },
        to: email,
        subject: 'Password Reset OTP',
        html: `
          <p>Hello,</p>
          <p>The One Time Password for your password reset is <strong>${otp}</strong>. This OTP will expire in 10 minutes.</p>
         
          <p>*** This is an auto-generated notification, please do not reply to this email. In case of any queries, write to us at <a href="mailto:info@hdsoft.com">info@hdsoft.com</a> ***</p>
        `
      };


      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Failed to send OTP. Please try again later.");
        } else {
          console.log('Email sent: ' + info.response);
          return res.json({ status: "User Exists", userId, otp, generatedAt: formattedDate }); // Optionally send the OTP and generation time in the response
        }
      }
      );
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).send("Server error");
  }
}
);


// server.post('/validateOtp', async (req, res) => {
//   const { email, otp } = req.body;
//   console.log("data",req.body)

//   try {
//     const user = await user_masters.findOne({ U_email: email });
//     if (!user) {
//       return res.json({ status: "User Not Found" });
//     } else {
//       const userId = user.U_id;

//       console.log("Userid",user.U_id)
//       const latestOTPRecord = await userotp_tbl.findOne({ 
//         user_otp_empid: userId, 
//         user_otp_latestyn: 'Y' 
//       }).sort({ user_otp_srno: -1 });

//       if (!latestOTPRecord) {
//         console.log("No OTP found");
//         return res.json({ status: "No OTP Found" });
//       }


//       const otpGenerationTime = new Date(latestOTPRecord.user_otp_gendatetime);
//       const currentTime = new Date();


//       const expirationTimeLimit = 10; 


//       const timeDifferenceInMinutes = (currentTime - otpGenerationTime) / (1000 * 60); // Convert milliseconds to minutes

//       if (timeDifferenceInMinutes > expirationTimeLimit) {

//         console.log("OTP has expired");
//         return res.json({ status: "OTP Expired" });
//       }
// console.log("validating",latestOTPRecord.user_otp_otpno,otp)
//       if (latestOTPRecord.user_otp_otpno === otp) {
//         console.log("Valid OTP");


//         latestOTPRecord.user_otp_useddatetime = new Date().toISOString();
//         await latestOTPRecord.save();

//         return res.json({ status: "OTP Matched" });
//       } else {
//         console.log("Invalid OTP");
//         return res.json({ status: "Invalid OTP" });
//       }
//     }
//   } catch (error) {
//     console.error("Error validating OTP:", error);
//     return res.status(500).json({ status: "Internal Server Error" });
//   }
// });
server.post('/validateOtp', async (req, res) => {
  const { email, otp } = req.body;
  console.log("data", req.body);

  try {
    const user = await user_masters.findOne({ U_email: email });
    if (!user) {
      return res.json({ status: "User Not Found" });
    } else {
      const userId = user.U_id;
      console.log("Userid", user.U_id);

      const latestOTPRecord = await userotp_tbl.findOne({
        user_otp_empid: userId,
        user_otp_latestyn: 'Y'
      }).sort({ user_otp_srno: -1 });

      if (!latestOTPRecord) {
        console.log("No OTP found");
        return res.json({ status: "No OTP Found" });
      }

      const otpGenerationTime = new Date(latestOTPRecord.user_otp_gendatetime);
      const currentTime = new Date();
      const expirationTimeLimit = 10; // OTP expires after 10 minutes

      const timeDifferenceInMinutes = (currentTime - otpGenerationTime) / (1000 * 60); // Convert milliseconds to minutes

      if (timeDifferenceInMinutes > expirationTimeLimit) {
        console.log("OTP has expired");
        return res.json({ status: "OTP Expired" });
      }

      console.log("validating", latestOTPRecord.user_otp_otpno, otp);
      if (latestOTPRecord.user_otp_otpno.toString().trim() === otp.toString().trim()) {
        console.log("Valid OTP");

        latestOTPRecord.user_otp_useddatetime = new Date().toISOString();
        await latestOTPRecord.save();

        return res.json({ status: "OTP Matched" });
      } else {
        console.log("Invalid OTP");
        return res.json({ status: "Invalid OTP" });
      }
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    return res.status(500).json({ status: "Internal Server Error" });
  }
});



const bcrypt = require('bcryptjs');
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
server.post('/changePassword', async (req, res) => {
  try {

    const { email, newPassword } = req.body;


    const hashedPassword = await hashPassword(newPassword);


    const user = await user_masters.findOneAndUpdate(
      { U_email: email },
      { U_password: hashedPassword },
      { new: true }
    );

    if (!user) {

      return res.status(404).json({ error: "User not found" });
    }


    console.log("Password successfully updated for user:", user.U_email);
    res.json({ status: "Password Changed" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



server.post('/saveLeaveApplicationData', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);

  const { U_name, FullDay, MorningHalf, AfternoonHalf, status, emplyEmail, teamleadername, teamleadermail, fromname, userleaveType, userreason, hrgmmail } = data;
  console.log("hrgmmail", hrgmmail)

  const leaveDates = [
    ...FullDay.map(date => `Full Day: ${date.join(', ')}`),
    ...MorningHalf.map(date => `Morning Half: ${date.join(', ')}`),
    ...AfternoonHalf.map(date => `Afternoon Half: ${date.join(', ')}`),
  ].join('\n');
  const fullDayLeaves = FullDay.length ? FullDay.map(date => date.join(', ')).join(', ') : '-';
  const morningHalfLeaves = MorningHalf.length ? MorningHalf.map(date => date.join(', ')).join(', ') : '-';
  const afternoonHalfLeaves = AfternoonHalf.length ? AfternoonHalf.map(date => date.join(', ')).join(', ') : '-';

  let leaveDetails = '';
  leaveDetails += `<p><strong>Full Day Leaves:</strong> ${fullDayLeaves}</p>`;
  leaveDetails += `<p><strong>First Half Leaves:</strong> ${morningHalfLeaves}</p>`;
  leaveDetails += `<p><strong>Second Half Leaves:</strong> ${afternoonHalfLeaves}</p>`;

  let emailContent;
  let recipientEmail;

  const ccEmails = status === 'Approved' ? hrgmmail.GMHRmail.map(hr => hr.U_email) : [];
  const leaveTypeMap = {
    SL: 'Sick Leave',
    CL: 'Casual Leave',
    ML: 'Maternity Leave',
    LWP: 'Leave Without Pay',
    PL: 'Privilege Leave',
    PTL: 'Paternity Leave'
  };

  const leaveTypeName = leaveTypeMap[userleaveType] || userleaveType;

  if (status === 'Approved and forwarded') {
    emailContent = `
      <p>Dear ${teamleadername},</p>
      <p>Leave application by ${U_name} has been <strong>Approved and Forwarded</strong> to you by ${fromname}. Following are the details:</p>
      ${leaveDetails}
      <p><strong>Leave Type: </strong>${leaveTypeName}</p>
      <p><strong>Reason: </strong>${userreason}</p>
      <p>To view the reason for the action taken, visit <a href="http://auditace.hdsofttech.org/">Leave Management System</a>.</p>

      <p>*** This is an auto-generated notification, please do not reply to this email. In case of any queries, write to us at <a href="mailto:info@hdsoft.com">info@hdsoft.com</a> ***</p>
    `;

    recipientEmail = teamleadermail;
  } else {
    emailContent = `
    <p>Dear ${U_name},</p>
    <p>Your leave application has been <strong>${status}</strong> for the following dates:</p>
    <p> ${leaveDetails}</p>
    <p>To view the reason for the action taken, visit <a href="http://auditace.hdsofttech.org/">Leave Management System</a>.</p>

    <p>*** This is an auto-generated notification, please do not reply to this email. In case of any queries, write to us at <a href="mailto:info@hdsoft.com">info@hdsoft.com</a> ***</p>
  `;
    recipientEmail = emplyEmail;
    ccEmail = hrgmmail;
  }


  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'info@hdsofttech.com',
      pass: 'Kup58869',
    },
  });


  const mailOptions = {
    from: 'info@hdsofttech.com',
    to: recipientEmail,
    subject: `Leave Application ${status}`,
    html: emailContent,
    cc: ccEmails,

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:'
      , info.response);
    res.status(200).send('Data received and email sent successfully');
  });
});




server.post('/saveLeaveApplicationDataf', (req, res) => {
  const data = req.body;
  console.log('Received datas:', data);

  const { userName, userEmail, fullDay, morningHalf, afternoonHalf, status, hrgmmail } = data;
  const ccEmails = status === 'Approved' ? hrgmmail.GMHRmail.map(hr => hr.U_email) : [];

  let leaveDetails = '';
  if (fullDay && fullDay.length > 0) {
    leaveDetails += `<strong>Full Day:</strong> ${fullDay.flat().join(', ')}<br>`;
  }
  if (morningHalf && morningHalf.length > 0) {
    leaveDetails += `<strong>Morning Half:</strong> ${morningHalf.flat().join(', ')}<br>`;
  }
  if (afternoonHalf && afternoonHalf.length > 0) {
    leaveDetails += `<strong>Afternoon Half:</strong> ${afternoonHalf.flat().join(', ')}<br>`;
  }
  if (!fullDay.length && !morningHalf.length && !afternoonHalf.length) {
    leaveDetails = 'No leave type selected';
  }

  const emailContent = `
    <p>Dear ${userName},</p>
    <p>Your leave application has been <strong>${status}</strong> for the following dates:</p>
    <p>${leaveDetails}</p>
    <p>To view the reason for the action taken, visit <a href="http://auditace.hdsofttech.org/">Leave Management System</a>.</p>

    <p>*** This is an auto-generated notification, please do not reply to this email. In case of any queries, write to us at <a href="mailto:info@hdsoft.com">info@hdsoft.com</a> ***</p>
  `;


  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'info@hdsofttech.com',
      pass: 'Kup58869',
    },
  });


  const mailOptions = {
    from: 'info@hdsofttech.com',
    to: userEmail,
    subject: `Leave Application ${status}`,
    html: emailContent,
    cc: ccEmails,

  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Data received and email sent successfully');
  });
});

server.get("/forwardmail", async (req, res) => {
  try {
    const forwardmail = await leaveapplndtl_tbl.find({}, "leaveappln_id  U_name emplyEmail FullDay MorningHalf AfternoonHalf"); // Fetch only the team leader names
    res
      .status(200)
      .json({ forwardmail }); // Send only team leader names to the frontend
  } catch (error) {
    console.error("Error fetching team leaders:", error);
    res.status(500).send("Internal server error");
  }
});

server.get("/GMHRmail", async (req, res) => {
  try {
    const GMHRmail = await user_masters.find(
      { U_desig: { $in: ["D012", "D011"] } },
      " U_email"
    );

    res.status(200).json({ GMHRmail });
  } catch (error) {
    console.error("Error fetching GMHRmail:", error);
    res.status(500).send("Internal server error");
  }
});

server.get('/duplicatedatesrestriction', async (req, res) => {
  const U_id = req.query.U_id;
  console.log('Received U_id:', U_id);

  try {
    const duplicatedates = await leaveapplndtl_tbl.find(
      { user_id: U_id }, // Ensure you're matching user_id with U_id
      'FullDay MorningHalf AfternoonHalf' // Fetch only the required fields
    );

    res.status(200).json({ duplicatedatesrestriction: duplicatedates });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const moment = require('moment'); // You can use Moment.js for date manipulation

// server.get('/upcoming-history', async (req, res) => {
//   const { view, days } = req.query; // Retrieve query parameters from the URL
//   const currentDate = new Date(); // Get the current date
//   const endDate = moment(currentDate).add(days, 'days').toDate(); // Calculate the end date

//   console.log("Received Filters - View:", view, "Days:", days);
//   console.log("Current Date:", currentDate);
//   console.log("End Date (Next " + days + " Days):", endDate);

//   try {
//     // Query the leaveapplndtl_tbl for records within the calculated date range
//     const leaveApplications = await leaveapplndtl_tbl.find({
//       StartDate: { $gte: currentDate, $lte: endDate }, // StartDate should be within the range
//       activeyn: "Y", // Ensure the leave is active
//     });

//     // Map the results to only include leave application ID and email
//     const leaveData = leaveApplications.map((app) => ({
//       leaveappln_id: app.leaveappln_id,
//       teamleaderEmail: app.teamleaderEmail,
//       emplyEmail: app.emplyEmail,
//     }));
// console.log("ddd",leaveData)
//     res.json({
//       message: "Leave applications within the specified date range",
//       receivedFilters: { view, days },
//       leaveData, // Send the filtered leave data
//     });
//   } catch (err) {
//     console.error("Error fetching leave applications:", err);
//     res.status(500).json({
//       message: "Error fetching leave applications",
//       error: err.message,
//     });
//   }
// });


server.get('/upcoming-history', async (req, res) => {
  const { view, days } = req.query; // Retrieve query parameters from the URL
  const currentDate = new Date(); // Get the current date
  let startDate, endDate;

  console.log("Received Filters - View:", view, "Days:", days);
  console.log("Current Date:", currentDate);

  if (view === "Upcoming") {
    // Calculate the end date (for upcoming leave applications within the next 'days' days)
    endDate = moment(currentDate).add(days, 'days').toDate();
    startDate = currentDate; // Start from today
    console.log("End Date (Next " + days + " Days):", endDate);
  } else if (view === "History") {
    // Calculate the start date (for past leave applications within the last 'days' days)
    startDate = moment(currentDate).subtract(days, 'days').toDate();
    endDate = currentDate; // End at today
    console.log("Start Date (Last " + days + " Days):", startDate);
  }

  try {
    // Query the leaveapplndtl_tbl for records within the calculated date range
    const leaveApplications = await leaveapplndtl_tbl.find({
      StartDate: { $gte: startDate, $lte: endDate }, // StartDate should be within the range
      activeyn: "Y", // Ensure the leave is active
    });

    const leaveData = leaveApplications.map((app) => ({
      leaveappln_id: app.leaveappln_id,
      teamleaderEmail: app.teamleaderEmail,
      emplyEmail: app.emplyEmail,
      U_name: app.U_name, // User name
      LeaveType: app.LeaveType, // Leave type (e.g., PL, SL, etc.)
      FullDay: app.FullDay.flat(), // Flatten the FullDay array
      HalfDay: app.HalfDay.flat(), // Half day leave dates
      totalLeaveDays: app.totalLeaveDays, // Total number of leaves
      status: app.status, // Status of the leave (e.g., Pending, Approved)
      leaveappln_reason: app.leaveappln_reason, // Reason for the leave
      StartDate: app.StartDate, // Start date of the leave
      EndDate: app.EndDate, // End date of the leave
    }));
    console.log('fdd', leaveData)
    res.json({
      message: "Leave applications within the specified date range",
      receivedFilters: { view, days },
      leaveData, // Send the filtered leave data
    });
  } catch (err) {
    console.error("Error fetching leave applications:", err);
    res.status(500).json({
      message: "Error fetching leave applications",
      error: err.message,
    });
  }
});

server.post("/holidays", async (req, res) => {
  try {
    const holidayData = req.body; // This should include an array of holiday objects

    console.log("Received Holiday Data:", holidayData);

    // Loop through the holiday data and create new holiday documents
    const newHolidays = holidayData.map((holiday) => {
      return new PublicHoliday({
        name: holiday.name,
        date: holiday.date, // Ensure this is a valid Date object
        year: holiday.year, // The selected year
        description: holiday.description || '', // Optional description
        createdBy: holiday.createdBy || 'ADMIN', // Default value (can be the logged-in user ID)
        createdAt: new Date().toISOString(), // Current timestamp
      });
    });

    // Save the new holiday documents to the database
    await PublicHoliday.insertMany(newHolidays);

    // Respond with success message and the inserted holidays
    res.status(201).send({
      message: 'Public Holidays added successfully',
      data: newHolidays, // The inserted documents
    });
  } catch (error) {
    console.error('Error adding public holidays:', error);
    res.status(500).send('Internal server error');
  }
});


server.get('/publicHolidays', async (req, res) => {
  try {
    const holidays = await PublicHoliday.find();  // Fetch all public holidays
    res.status(200).send(holidays);
  } catch (error) {
    console.error('Error fetching public holidays:', error);
    res.status(500).send('Internal server error');
  }
});



server.listen(8001, () => {
  console.log("Server started");
});
module.exports.handler = serverless(server);