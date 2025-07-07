// const airplaneRoute = require("./airplane-route");
const express = require("express");

const router = express.Router();

// router.use("/", airplaneRoute);

router.get("/", (req, res) => {
  res.json({ hellow: "Hellow" });
});

module.exports = router;
