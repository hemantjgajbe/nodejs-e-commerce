require("dotenv").config();
require("express-async-errors");
const express = require("express");

const app = express();

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// database
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  console.log(req);
  res.send("e-commerce api");
});

app.get("/api/v1", (req, res) => {
  res.send("e-commerce api");
});

// Performance brocali compression

app.get("*.js", (req, res, next) => {
  req.url = req.url + ".br";
  res.set("Content-Encoding", "br");
  res.set("Content-Type", "application/javascript; charset=UTF-8");
  next();
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.port || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
