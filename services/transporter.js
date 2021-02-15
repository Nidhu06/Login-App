const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "s.nidafathima@gmail.com", 
        pass: "xevnwwhapfnnqkwv",      
    },
});

exports.transporter = transporter;
