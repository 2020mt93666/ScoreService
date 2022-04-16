const db = require("../models");
const ScoreModel = db.scores;

// Create and Save a new score
exports.create = async (req, res, next) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a score
  const score = new ScoreModel({
    name: req.body.name,
    match: req.body.match,
    player: req.body.player,
    type: req.body.type,
    count: req.body.count,
    endOfMatch: req.body.endOfMatch ? req.body.endOfMatch : false
  });

  try {
    // Save score in the database
    const data = await score.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the score."
    });
  }
};

// Retrieve all scores from the database.
exports.findAll = async (req, res) => {
  const name = req.query.name;
  var condition = name ? {
    name: {
      $regex: new RegExp(name),
      $options: "i"
    }
  } : {};

  try {
    const data = await ScoreModel.find(condition);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving scores."
    });
  }
};

// Find a single score with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await ScoreModel.findById(id);
    if (!data)
      res.status(404).send({
        message: "Not found score with id " + id
      });
    else res.send(data);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving score with id=" + id
    });
  }
};

// Update a score by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  try {
    const data = await ScoreModel.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false
    });
    if (!data) {
      res.status(404).send({
        message: `Cannot update score with id=${id}. Maybe score was not found!`
      });
    } else res.send({
      message: "score was updated successfully."
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating score with id=" + id
    });
  }
};

// Delete a score with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await ScoreModel.findByIdAndRemove(id, {
      useFindAndModify: false
    });
    if (!data) {
      res.status(404).send({
        message: `Cannot delete score with id=${id}. Maybe score was not found!`
      });
    } else {
      res.send({
        message: "score was deleted successfully!"
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete score with id=" + id
    });
  }
};