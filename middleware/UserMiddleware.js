const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
  let token;
  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith("Bearer")
  //   ) {
  //     token = req.headers.authorization.split(" ")[1];
  //   }
  token = req.cookies.jwt;
  if (!token) {
    return next(
      res.status(401).json({
        status: "fail",
        message: "anda belum login/register token tidak ditemukan",
      })
    );
  }
  let decode;
  try {
    decode = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(
      next(
        res.status(401).json({
          status: "fail",
          message: "token invalid",
        })
      )
    );
  }
  const currentUser = await User.findByPk(decode.id);
  if (!currentUser) {
    return next(
      res.status(401).json({
        status: "fail",
        message: "user not found",
      })
    );
  }
  req.user;
  next();
};

exports.permissionUser = (...roles) => {
  return async (req, res, next) => {
    const roleData = await Role.findByPk(req.user.role_id);
    const roleName = roleData.name;
    if (!roles.includes(roleName)) {
      return next(
        res.status(403).json({
          status: "fail",
          message: "anda tidak memiliki permission",
        })
      );
    }
    next();
  };
};
