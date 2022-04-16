const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  MATCH_HOST,
  PLAYER_HOST
} = process.env;
module.exports = {
  url: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
  matchApiUrl: `http://${MATCH_HOST}:8080/api/matches`,
  playerApiUrl: `http://${PLAYER_HOST}:8080/api/players`
};
