const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "s.nidafathima@gmail.com", // mockmail4me@gmail.com
        pass: "faatimah",      //dnvoerscnkohtwew
    },
});

exports.transporter = transporter;