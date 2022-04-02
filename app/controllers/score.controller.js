const db = require("../models");
const ScoreModel = db.scores;

// Create and Save a new score
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a score
  const score = new ScoreModel({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save score in the database
  score
    .save(score)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the score."
      });
    });
};

// Retrieve all scores from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  ScoreModel.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving scores."
      });
    });
};

// Find a single score with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ScoreModel.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found score with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving score with id=" + id });
    });
};

// Update a score by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  ScoreModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update score with id=${id}. Maybe score was not found!`
        });
      } else res.send({ message: "score was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating score with id=" + id
      });
    });
};

// Delete a score with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ScoreModel.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete score with id=${id}. Maybe score was not found!`
        });
      } else {
        res.send({
          message: "score was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete score with id=" + id
      });
    });
};