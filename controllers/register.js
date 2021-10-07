const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const register =async (req,res)=>{
    try {
        const { first_name, last_name, email, password,eth_add } = req.body;   
        //res.send(req.body);
        // Validate user input
        if (!(email && password && first_name && last_name && eth_add)) {
          res.send("All input is required");
          return res.status(400).send("All input is required");
        }
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
        if (oldUser) {
          res.send("User Exist");
          console.log("User Exist");
          //return res.status(409).send("User Already Exist. Please Login");
        }
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
        // Create user in our database
        const user = await User.create({
          first_name,
          eth_add,
          last_name,
          email: email.toLowerCase(),
          password: encryptedPassword,
        });
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          //process.env.TOKEN_KEY,
          'rtatrartartatrattatar',
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
    
        // return new user
        return res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
}

const login = async(req,res)=>{
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          return res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            //process.env.TOKEN_KEY,
            'rtatrartartatrattatar',
            {
              expiresIn: "2h",
            }
          );
          // save user token
          user.token = token;
          // user
          //return res.status(200).json(user);
         return  res.render("balance.ejs")
        }
       return res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
}

module.exports ={register,login};