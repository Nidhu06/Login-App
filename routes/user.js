const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { decodeToken } = require("../services/jwt");
// const nodemailer = require("nodemailer")

const { transporter } = require("../services/transporter");
router.use(cookieParser());
router.use(bodyParser.json());

router.post("/sendmail", async (req, res) => {
    
    // const jwt = req.cookies.jwt
    
    const {
        email,
        message
    } = req.body;
    let errors = [];
    if (!email) {
        errors.push("email field is required !!");
        
    }
    
    // if (!jwt) {
        
    //     errors.push("unauthorized request");} 
    //  else {
        console.log("no")
        // let verify = await decodeToken(jwt)
        // let user = verify.email
       try{ 
           let mailOptions =  {
            from: '"Login Application 🤝" <noreply@loginapp.com>',
            to: `${email}`,
            subject: "Account Confirmation Link",
            html: `${message}`
        }
      await transporter.sendMail(
           mailOptions,
            /*  (error, info) => {
                  console.log(info);
                  if (error) {
                      console.log(error);
                  } else {
                      
                      return res.json({
                          message:
                              `Successfully sent mail to ${email}`
                               
                      }); */
            function (err, data) {
                if (err) {
                    console.log("error has occurred",err)
                    return res.status(404);
                    // return;
                }
                else {
                    console.log("email sent successfully")
                    return res.send("Hi")
                }
            })
                
        // }
       }
       catch(e){
           res.json("Error occured while sending email.!")
       }

    
});

module.exports = router; //es6
