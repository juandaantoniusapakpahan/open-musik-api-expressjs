const jwtTokenMeneger = require("../middlewares/jwtTokenManager");

const cookieToken = (user, res) => {
  const { id } = user;
  const token = jwtTokenMeneger.generateAccessToken(id);

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  user.password = undefined;
  res.status(200).cookie("token", token, options).json({
    status: "success",
    token,
    user,
  });
};

module.exports = cookieToken;
