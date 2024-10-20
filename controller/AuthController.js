const { User, Profile, Product, Category } = require("../models");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};
exports.registerUser = async (req, res) => {
  try {
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    createToken(user, 201, res);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.errors.map((err) => err.message),
    });
  }
};

exports.loginUser = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({
      status: "Fail",
      message: "Error Validasi",
      error: "Please input email/password",
    });
  }
  const userData = await User.findOne({ where: { email: req.body.email } });
  if (
    !userData ||
    !(await userData.CorrectPassword(req.body.password, userData.password))
  ) {
    return res.status(401).json({
      status: "Fail",
      message: "Error Validasi",
      error: "Invalid Email or Password",
    });
  }
  createToken(userData, 200, res);
};

exports.logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.getMyUser = async (req, res) => {
  const currentUser = await user.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: Profile,
        attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
      },
      {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt", "category_id"] },
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      },
    ],
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });
  if (currentUser) {
    return res.status(200).json({
      data: currentUser,
    });
  }
  return res.status(400).json({
    status: "fail",
    message: "data tidak ditemukan",
  });
};
