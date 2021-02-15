const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser")
const mongodb = require("mongodb");
//const { compareHash } = require("../services/bcrypt");
//const { decodeToken } = require("../services/jwt");
const mongoClient = mongodb.MongoClient;

const url = "mongodb+srv://Nidhu06:Munn@0631@cluster0.ld8wh.mongodb.net/loginapp?retryWrites=true&w=majority";
const cookieParser = require("cookie-parser")
router.use(cookieParser());
router.use(bodyParser.json())
router.route("/deactivate").post(async (req, res) => {
  /*  let jwtcookie = req.cookies.jwt;
    if (!jwtcookie) {
    
      return res.json({
        message: "Login to continue..",
      });
    } else { */
  try {
    // let token = await decodeToken(jwtcookie);

    const user = req.body.email;
    // let email = token.email;
    // if (!email) {
    //   return res.json({
    //     error: "Login to continue..",
    //   });} 
    // else {
    let client = await mongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    let db = client.db("loginapp");
    let user_ = db.collection("users");
    user_.findOneAndUpdate(
      {
        email: user,
      },
      {
        $set: {
          activated: false,
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
            message: "Account deactivation successful...",
          });
        }
      })

  // }
      } 
      catch (error) {
  console.log(error);
  return res.json({
    error: "something went wrong",
  });
}
    // }
  });

router.route("/activate").post(async (req, res) => {
  /*let jwtcookie = req.cookies.jwt;
  if (!jwtcookie) {

    return res.json({
      message: "Login to continue..",
    });
  } else {*/
    try {
      //let token = await decodeToken(jwtcookie);

      const user = req.body.email;
     // let email = token.email;
      // if (!email) {
      //   return res.json({
      //     error: "Login to continue..",
      //   });
      // } else {
        let client = await mongoClient.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        let db = client.db("loginapp");
        let user_ = db.collection("users");
        user_.findOneAndUpdate(
          {
            email: user,
          },
          {
            $set: {
              activated: true,
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
                message: "Account activation successful...",
              });
            }
          })

      // }
    } catch (error) {
      console.log(error);
      return res.json({
        error: "something went wrong",
      });
    }
  // }
});

module.exports = router;