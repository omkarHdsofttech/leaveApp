// const nodemailer = require("nodemailer");
// require("dotenv").config();


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.USER,
//         pass: process.env.APP_PASSWORD,
//     },
// });

// const sendMail = async (data, teamLeaderEmail, reason) => {
//     const mailOptions = {
//         from: {
//             name: "web",
//             address: process.env.USER
//         },
//         to: ["t93403534@gmail.com", teamLeaderEmail], // Add the team leader's email to the recipients
//         subject: "Leave Application ",
//         text: `Leave Type: ${data.LeaveType}\nReason: ${reason}\nMorning Half: ${data.MorningHalf}\nAfternoon Half: ${data.AfternoonHalf}\nFull Day: ${data.FullDay}`,
//         html: `<b>Leave Application</b><br><br><p><strong>Leave Type:</strong> ${data.LeaveType}</p><p><strong>Reason:</strong> ${reason}</p><p><strong>Morning Half:</strong> ${data.MorningHalf}</p><p><strong>Afternoon Half:</strong> ${data.AfternoonHalf}</p><p><strong>Full Day:</strong> ${data.FullDay}</p>`,
//     };

//     try {
//         await transporter.sendMail(mailOptions); // Corrected function name
//         console.log("Email sent");

//         // Check if the email was sent to the selected team leader
//         if (teamLeaderEmail) {
//             console.log(`Email sent to selected team leader: ${teamLeaderEmail}`);
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };
// module.exports = sendMail; // Corrected function name

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
    },
});

const sendMail = async (data, teamLeaderEmail, reason, leaveType, MorningHalf, AfternoonHalf, FullDay) => {
    console.log("Data:", data); // Check the structure of the data object
    console.log("Reason:", reason); // Check if reason is accessible
    consfole.log("Reason:", MorningHalf);
    const mailOptions = {
        from: {
            name: "web",
            address: process.env.USER
        },
        to: [process.env.USER], // Send email to the address mentioned in the environment file
        subject: "Leave Application",
        text: `Leave Type: ${leaveType}\nReason: ${reason}\nFull Day: ${FullDay}\nMorning Half: ${MorningHalf}\nAfternoon Half: ${AfternoonHalf}`,
        html: ` <b>Leave Application</b><br><br><p><strong>Leave Type:</strong> ${leaveType}</p><p><strong>Reason:</strong> ${reason}</p><p><strong>Full Day:</strong> ${FullDay}</p><p><strong>Morning Half:</strong> ${MorningHalf}</p><p><strong>Afternoon Half:</strong> ${AfternoonHalf}</p>`,
    };

    // Add team leader's email to recipients if available
    if (teamLeaderEmail) {
        mailOptions.to.push(teamLeaderEmail);
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent");

        if (teamLeaderEmail) {
            console.log(`Email sent to selected team leader: ${teamLeaderEmail}`);
        }
    } catch (error) {
        console.log(error);
    }
};


module.exports = sendMail;
