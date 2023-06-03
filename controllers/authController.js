// const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const jwtSecret = 'privatekey';
const jwt_expiration = 60 * 60 * 1000; // 1 hour in milliseconds

exports.signup = async (req, res) => {

  try {
    const User = req.models.User;
    const {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: password,
      internship: internship,
    } = req.body;
    
    const existingUser = await User.findOne({ email });
      if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use',
      });
    }
  // user does not exist so proceed with creating the user
    //  hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
// build the user from the req.body data
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: hashedPassword,
      internship: internship,
    });
// save the user in mongodb
    const savedUser = await newUser.save();
// send the response
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: savedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the user',
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const User = req.models.User;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, jwtSecret, {
      expiresIn: jwt_expiration,
    });
    // Save the token as a cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + jwt_expiration),
      httpOnly: true,
      // secure: true, // Uncomment this line if you are using HTTPS
    });


    res.status(200).json({
       message: 'User authenticated',
       token: token, // Send the token in the response body
       expiresIn: jwt_expiration, // Send the expiration time in the response body
       userId :user._id
       });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while signing in' });
  }
};