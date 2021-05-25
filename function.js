const logger = require("./lib/logger");

var self = (module.exports = {
  logCons: require("./utils/constant/logcontant"),
  logger: logger,

  printLog: function (level, msg, type, method) {
    // TODO:if msg is json then use JSON.stringify()
    if (typeof type !== "undefined") {
      switch (type) {
        case 0: // ENTER
          if (method) {
            msg = this.logCons.LOG_ENTER_INTO_FUNC + msg + " Method:" + method;
          } else {
            msg = this.logCons.LOG_ENTER_INTO_FUNC + msg;
          }

          break;
        case 1: // EXIT
          if (method) {
            msg = this.logCons.LOG_EXIT_FROM_FUNC + msg + " Method:" + method;
          } else {
            msg = this.logCons.LOG_EXIT_FROM_FUNC + msg;
          }
          break;
      }
    }
    switch (level) {
      case this.logCons.LOG_LEVEL_ERROR:
        logger.error(msg);
        break;
      case this.logCons.LOG_LEVEL_WARN:
        logger.warn(msg);
        break;
      case this.logCons.LOG_LEVEL_DEBUG:
        logger.debug(msg);
        break;
      case this.logCons.LOG_LEVEL_SILLY:
      case this.logCons.LOG_LEVEL_VERBOSE:
        logger.trace(msg);
        break;
      case this.logCons.LOG_LEVEL_INFO:
      default:
        logger.info(msg);
    }
  },

  // new Common functions
});
