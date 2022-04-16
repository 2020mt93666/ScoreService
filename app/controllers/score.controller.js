const db = require("../models");
const config = require("../config/db.config");
const axios = require("axios");
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
    await updateMatch(data);
    await updatePlayer(data);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the score."
    });
  }
};

let updateMatch = async (score) => {
  axios.get(config.matchApiUrl + "?name=" + score.match)
    .then(function (response) {
      // handle success
      if (response.data) {
        if (score.type == "Run") {
          response.data.actual = response.data.actual + score.count
          if (score.endOfMatch == true) {
            if (response.data.target > response.data.actual)
              response.data.status = response.data.teamA + " Won";
            else if (response.data.target < response.data.actual)
              response.data.status = response.data.teamB + " Won";
            else
              response.data.status = "Match Tied";
          }
          axios.put(config.matchApiUrl + "/" + response.data.id, {
            actual : response.data.actual,
            status : response.data.status
          }).then(function (response) {
            // handle success
            if (response.data.message == "match was updated successfully.")
              console.log("Success");
            else
              console.log(response.data.message);
          }).catch(function (error) {
            // handle error
            console.log(error);
          });
        }
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

let updatePlayer = async (score) => {
  axios.get(config.playerApiUrl + "?name=" + score.player)
    .then(function (response) {
      // handle success
      if (response.data) {
        if (score.type == "Run")
          response.data.runs = response.data.runs + score.count;
        else if (score.type == "Wicket")
          response.data.wickets = response.data.wickets + score.count;
        else if (score.type == "Catch")
          response.data.catches = response.data.catches + score.count;
        axios.put(config.playerApiUrl + "/" + response.data.id, {
          runs: response.data.runs,
          wickets: response.data.wickets,
          catches: response.data.catches
        }).then(function (response) {
          // handle success
          if (response.data.message == "player was updated successfully.")
            console.log("Success");
          else
            console.log(response.data.message);
        }).catch(function (error) {
          // handle error
          console.log(error);
        });
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

// Retrieve all scores from the database.
exports.findAll = async (req, res) => {
  const name = req.query.name;
  var condition = name ? {
    name: name
  } : {};

  try {
    if (name) {
      const data = await ScoreModel.findOne(condition);
      res.send(data);
    } else {
      const data = await ScoreModel.find(condition);
      res.send(data);
    }
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