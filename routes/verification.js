const express = require("express");
const router = express.Router();
const mongodb = require("mongodb"); //MongoDB driver
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const { encodeToken, decodeToken } = require("../services/jwt");
const { compareHash, generateHash } = require("../services/bcrypt");
const { transporter } = require("../services/transporter");
const mongoClient = mongodb.MongoClient;

const url =
  "mongodb+srv://Nidhu06:Munn@0631@cluster0.ld8wh.mongodb.net/loginapp?retryWrites=true&w=majority";

router.use(bodyparser.json());
router.use(cookieParser())

router.route("/register").post(async (req, res) => {
  const { fname, lname, role,email, password } = req.body; 
  let errors = [];
  if (!fname) {
    errors.push("fname field is required !!");
  }
  if (!role) {
    errors.push("role field is required !!");
  }
  if (!lname) {
    errors.push("lname field is required !!");
  }
  if (!password) {
    errors.push("password field is required !!");
  }
  
  if (errors.length === 0) {
    try {
      let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }); 
      let db = client.db("loginapp"); 
      let user = db.collection("users"); 
      user.findOne(
        {
          email: email,
        },
        async (err, result) => {
          
         /* if (err) {
            return res.json({
              error: "something went wrong",
            });
          }*/
          if (result == null) {
            let hashedPwd = await generateHash(password);
            user.insertOne(
              {
                fname: fname,
                lname: lname,
                role : role,
                email: email,
                password: hashedPwd,
                verified: false,
                activated: true,
                confirmed: false,
              },
              async (err, result) => {
                if (err) console.log(err);
                if (result) {
                  let emailToken = await encodeToken(email);
                  let Tokenurl = `https://login-app6.herokuapp.com/auth/${emailToken}`;
                  let name = fname + " " + lname;
                  transporter.sendMail(
                    {
                      from: '"Login Application 🤝" <noreply@loginapp.com>',
                      to: `${email}`,
                      subject: "Account Confirmation Link",
                      html: `Hello ${name} , Here's your Account verification link: <br> <a style="color:green" href="${Tokenurl}">Click Here To Confirm</a> <br> Link expires in an hour...`,
                    },
                    (error, info) => {
                      console.log(info);
                      if (error) {
                        console.log(error);
                      } else {
                        return res.json({
                          message:
                            "Registration successful...A mail sent to " +
                            email +
                            " for user confirmation...",
                        }); 
                      }
                    }
                  );
                }
              }
            );
          } else {
            return res.json({
              message: "email already exists!!",
            });
          }
        }
      );
    } catch (err) {
      console.log(Error);
    }
  } else {
    return res.json({
      error: errors,
    });
  }
});

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  let errors = [];
  if (!email) {
    errors.push("email field is required !!");
  }
  if (!password) {
    errors.push("password field is required !!");
  }
  if (errors.length === 0) {
    let client = await mongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); //connect to db
    let db = client.db("loginapp"); //db name
    let user = db.collection("users"); //collection name
    await user.findOne(
      {
        email: email,
      },
      async (err, User) => {
        if (err) {
          console.log(err);
          return res.json({
            error: err,
          });
        }
        if (User === null) {
          return res.json({
            error: `No registered user found with ${email}`,
          });
        } else {
          if (User === null) {
            return res.json({
              message: "No registered user found with " + email,
            });
          } else {
            
            let name = User.fname + " " + User.lname;
            if (User.verified === true && User.activated === true)  { 
              let passwordMatched = await compareHash(password, User.password);
              if (passwordMatched === true) {
                
                let token = await encodeToken(email);
                res
                  .cookie("jwt", token, {
                    maxAge: 1000000,
                    httpOnly: true,
                    secure: true,
                  })
                  .cookie("user", User._id, {
                    maxAge: 1000000,
                    httpOnly: true,
                   secure: true,
                  })
                  .json({
                    message:
                      "Hello " + name + " , you are successfully logged in...", 
                  });
              } else {
                return res.json({
                  error: "Invalid Credentials..", 
                });
              }
            } else {
              return res.json({
                error: "User Identity not verified..",
              });
            }
          }
        }
      }
    );
  } else {
    return res.json({
      error: errors,
    });
  }
});

router.route("/logout").get(async (req, res) => {
  res.clearCookie('jwt').json({
      type_: 'success',
      message: 'Logging Out...'
  })
});
//endpoint for account verification
router.route("/auth/:token").get(async (req, res) => {
  const token = req.params.token;
  try {
    let decoded = await decodeToken(token);
    if (decoded) {
      let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      let db = client.db("loginapp"); //db name
      let user = db.collection("users"); //collection name
      user.findOneAndUpdate(
        {
          email: decoded.email,
        },
        {
          $set: {
            verified: true,
          },
        },
        (err, result) => {
          if (err) {
            return res.json({
              error: err,
            });
          }
          if (result) {
            return res.json({
              message: "Account verification successful...",
            });
          }
        }
      );
    } else {
      return res.json({
        error: "unauthorized request",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      error: "something went wrong",
    });
  }
});


module.exports = router;