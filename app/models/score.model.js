module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      match: String,
      player: String,
      type: String,
      count: Number,
      endOfMatch: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const score = mongoose.model("score", schema);
  return score;
};
