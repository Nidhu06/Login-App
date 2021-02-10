const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { decodeToken } = require("../services/jwt");
const { transporter } = require("../services/transporter");
router.use(cookieParser());
router.use(bodyParser.json());



router.route("/sendmail").post(async (req, res) => {
    const jwt = req.cookies.jwt
    const {
        email,
        message
    } = req.body;
    let errors = [];
    if (!email) {
        errors.push("email field is required !!");
    }
    if(!jwt){
        errors.push("unauthorized request");
    }else{
        let verify = await decodeToken(jwt) 
        let user = verify.email
        transporter.sendMail(
            {
                from: '"Login Application 🤝" <noreply@loginapp.com>',
                to: `${email}`,
                subject: "Account Confirmation Link",
                html: `Hello ${email} , you got a message from ${user} : ${message}` 
            },
            (error, info) => {
                console.log(info);
                if (error) {
                    console.log(error);
                } else {
                    
                    return res.json({
                        message:
                            `Successfully sent mail to ${email}`
                             
                    }); 
                }
            }
        );  
    }
    
});
                
module.exports = router; //es6
