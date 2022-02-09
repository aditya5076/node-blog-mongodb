const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await mongoClient.connect("mongodb://localhost:27017");
  database = client.db("node_blog");
}

function getDb() {
  if (!database) throw { message: "db is not connected yet" };
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
