module.exports = app => {
  const scores = require("../controllers/score.controller.js");

  var router = require("express").Router();

  // Retrieve all scores
  router.get("/", scores.findAll);

  // Retrieve a single score with id
  router.get("/:id", scores.findOne);

  // Create a new score
  router.post("/", scores.create);

  // Update a score with id
  router.put("/:id", scores.update);

  // Delete a score with id
  router.delete("/:id", scores.delete);

  app.use("/api/scores", router);
};
