const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {

    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {

      user = await User.create({
        name,
        email,
        password: "google-auth",
        profileImage: picture,
        role: "customer"
      });

    }

    res.json({
      user,
      token: generateToken(user._id)
    });

  } catch (error) {

    res.status(401).json({
      message: "Google authentication failed"
    });

  }
};