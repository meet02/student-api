const mongoose = require("mongoose");
const func = require("../function");
let confi = require("../config");

let liveDbUrl =
  "mongodb://student:ctvkyfsMbyoMCON7@cluster0-shard-00-00.rpgy8.mongodb.net:27017,cluster0-shard-00-01.rpgy8.mongodb.net:27017,cluster0-shard-00-02.rpgy8.mongodb.net:27017/student?ssl=true&replicaSet=atlas-fxh7js-shard-0&authSource=admin&retryWrites=true&w=majority";
let localDbUrl = "mongodb://localhost:27017/student";

mongoose
  .connect(liveDbUrl, {
    useNewUrlParser: true,
  })
  .then((result) => {
    func.printLog(
      func.logCons.LOG_LEVEL_INFO,
      "Database connected successfully",
      func.logCons.LOG_ENTER
    );
  })
  .catch((error) => {
    console.log(error);
    func.printLog(func.logCons.LOG_LEVEL_ERROR, JSON.stringify(error));
  });

const dbConnection = mongoose.connection;
