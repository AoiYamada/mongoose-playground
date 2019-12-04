const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const mongod = new MongoMemoryServer();

mongod
  .getConnectionString()
  .then(uri => {
    mongoose
      .connect(
        uri,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      )
      .then(() => {
        console.log("MongoDB Connected")
      })
      .catch(err => console.log(err));
  });

module.exports = mongod;