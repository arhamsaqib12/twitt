const  {Users}  = require('./usermodal'); // Ensure the correct path
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';

async function login(req, res) {
  const { email, password } = req.body ?? {};

  try {
    const user = await Users.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json("User is not registered, please create an account");
    }

    if (!password) {
      return res.status(401).json("Password is required");
    }

    const isEqual = await bcrypt.compare(password, user.dataValues.password);

    if (!isEqual) {
      return res.status(401).json("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      secretKey,
      { expiresIn: '24h' } // Token expiration time
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic, // Include profilePic
        headerPic: user.headerPic,   // Include headerPic
        bio: user.bio                // Include bio
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json("Internal server error");
  }
}

async function signup(req, res) {
  const { name, email = "", password, dateOfBirth, profilePic, headerPic, bio } = req.body ?? {};

  try {
    const existingUser = await Users.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(401).json("User is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      profilePic,
      headerPic,
      bio
    });

    // Automatically log in the user after signup
    req.body = { email, password }; // Set the email and password for the login function
    return login(req, res); // Call the login function
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json("Internal server error");
  }
}

module.exports = {
  login,
  signup,
  secretKey,
};
