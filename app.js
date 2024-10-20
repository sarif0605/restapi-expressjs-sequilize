const express = require("express");
const app = express();

const cors = require("cors");
const CategoryRouter = require("./routes/categories");
const AuthRouter = require("./routes/AuthRouter");
const ProductController = require("./controller/ProductController");
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler);
app.use(notFound);
app.use(morgan("dev"));
app.use(cors());

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "/public/uploads"))
);

app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/products", ProductController);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
