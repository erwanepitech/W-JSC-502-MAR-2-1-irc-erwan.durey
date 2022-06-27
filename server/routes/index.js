const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.post("/login", (req, res) => {
  socket.emit("new-connection", { login: req.body.login });
})

module.exports = router;