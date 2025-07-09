const express = require("express");
const { serverConfig, logger } = require("./config");
const { Enums } = require("./utils/common");
const scheduledCrons = require("./utils/common/cron-jobs");
const { ErrorResponse } = require("./utils/common");
const morgan = require("morgan");

const { STATUS_CODE } = Enums;

const apiRoute = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", apiRoute);

app.use((req, res, next) => {
  ErrorResponse.message = `${req.method} ${req.path} not found`;
  ErrorResponse.statusCode = STATUS_CODE.NOT_FOUND;

  res.status(STATUS_CODE.NOT_FOUND).json(ErrorResponse);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  ErrorResponse.message = err.message || "Internal Server Error";
  res.status(err.statusCode || 500).json(ErrorResponse);
});

app.listen(serverConfig.PORT, () => {
  console.log("Server started on port", serverConfig.PORT);
  scheduledCrons.scheduledCrons();
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});
