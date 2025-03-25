const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleWare = (req, res, next) => {
  // console.log("checkToken", req.headers.token);
  const userId = req.params.id;
  const checkToken = req.headers.token;
  if (!checkToken) {
    return res.status(404).json({
      message: "Token undefined",
      status: "ERROR",
    });
  }
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
    // console.log(user);
    const { payload } = user;
    if (payload?.isAdmin || payload.id.toString() === userId) {
      // console.log("true");
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};
const adminAuthMiddleWare = (req, res, next) => {
  const checkToken = req.headers.token;
  if (!checkToken) {
    return res.status(404).json({
      message: "Token undefined",
      status: "ERROR",
    });
  }
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
    const { payload } = user;
    if (payload?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};
module.exports = {
  authMiddleWare,
  adminAuthMiddleWare,
};
