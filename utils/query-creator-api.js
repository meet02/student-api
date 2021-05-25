"use strict";

const _ = require("underscore");
const mongoose = require("mongoose");
const logger = require("./logger");
const dbConnection = require("./db-connection");

module.exports = {
  /**
   * Select query where comparison is done by unique columns and values.
   *
   * @collectionName {string} collectionName to select from
   * @returns {object} - JSON object
   */
  selectWithAnd: (
    collectionName,
    comparisonColumnsAndValues,
    columnsToSelect,
    sortColumnAndValues
  ) => {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection
        .find(comparisonColumnsAndValues, columnsToSelect, (error, data) => {
          if (error) {
            console.log(error);
            reject(error);
            return;
          }

          resolve(data);
          return;
        })
        .sort(sortColumnAndValues);
    });
  },

  /**
   * Count how many records in table and comparison is done by unique columns and values.
   *
   * @collectionName {string} collectionName to select from
   * @returns {object} - JSON object
   */

  countRecord: (collectionName, comparisonColumnsAndValues) => {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.count(comparisonColumnsAndValues, (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows);
        return;
      });
    });
  },

  /**
   * Select query where comparison is done by unique columns and values.
   *
   * @collectionName {string} collectionName to select from
   * @returns {object} - JSON object
   */
  selectWithAndOne: (
    collectionName,
    comparisonColumnsAndValues,
    columnsToSelect
  ) => {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.findOne(
        comparisonColumnsAndValues,
        columnsToSelect,
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(data);
          return;
        }
      );
    });
  },

  updateSinglWithUpdateRecodePromise: function (
    collectionName,
    columnsToUpdate,
    targetColumnsAndValues,
    columnToSelect
  ) {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.findOneAndUpdate(
        targetColumnsAndValues,
        columnsToUpdate,
        { new: true, projection: columnToSelect },
        function (error, data) {
          if (error) {
            console.log("errpr=>" + error);
            logger("Error: making async main query");
            reject(error);
            return;
          }

          resolve(data);
          return;
        }
      );
    });
  },

  /**
   * Inserts single record
   *
   * @collectionName {string} collectionName to select from
   * @param {object} columnsAndValues Values and column
   *     to insert
   * @returns {object} - JSON object
   */
  insertSingle: (collectionName, columnsAndValues) => {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.create(columnsAndValues, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(data);
        return;
      });
    });
  },

  /**
   * Updates a single record
   *
   * @collectionName {string}collectionName to update
   * @columnsToUpdate {Object}  Columns and values to update
   * @targetColumnsAndValues {Object} targetColumnsAndValues to identify the update record
   *
   * @returns {object} - JSON object
   */

  updateSingle: function (
    collectionName,
    columnsToUpdate,
    targetColumnsAndValues
  ) {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.update(
        targetColumnsAndValues,
        columnsToUpdate,
        { multi: true },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(data);
          return;
        }
      );
    });
  },

  updateMultiple: (collectionName, columnsToUpdate, targetColumnsAndValues) => {
    return new Promise((resolve, reject) => {
      try {
        const dbCollection = mongoose.model(collectionName);
        var options = {
          multi: true,
        };
        dbCollection.updateMany(
          targetColumnsAndValues,
          {
            $set: columnsToUpdate,
          },
          options,
          function (error, data) {
            if (error) {
              console.log(error);

              logger("Error: can not update document");
              reject(error);
              return;
            }
            resolve(data);
            return;
          }
        );
      } catch (error) {
        reject(error);
        return;
      }
    });
  },

  /**
   * Deletes a multiple record
   *
   * @collectionName {string}collectionName to update
   * @columnsToUpdate {Object}  Columns and values to update
   * @targetColumnsAndValues {Object} targetColumnsAndValues to identify the update record
   *
   * @returns {object} - JSON object
   */

  removeMultiple: function (collectionName, targetColumnsAndValues) {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.remove(targetColumnsAndValues, function (error, data) {
        if (error) {
          reject(error);
          return;
        }

        resolve(data);
        return;
      });
    });
  },

  /**
   * Inserts Multiple records
   *
   * @collectionName {string} table Name of table to select from
   * @columnsAndValues {Array} columns to insert
   * @returns {object} - JSON object
   */

  insertMultiple: function (collectionName, columnsAndValues) {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.insertMany(columnsAndValues, function (error, data) {
        if (error) {
          reject(error);
          return;
        }

        resolve(data);
        return;
      });
    });
  },

  /**
   * Select join query where comparison is done by unique columns and values.
   *
   * @collectionName {string} collectionName to select from
   * @returns {array} - JSON array of objects
   */
  joinWithAnd: function (collectionName, params) {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.aggregate(params).exec(function (error, data) {
        if (error) {
          reject(error);
          return;
        }
        resolve(data);
        return;
      });
    });
  },

  updateSinglWithUpdateRecodePromise: function (
    collectionName,
    columnsToUpdate,
    targetColumnsAndValues,
    columnToSelect
  ) {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.findOneAndUpdate(
        targetColumnsAndValues,
        columnsToUpdate,
        { new: true, projection: columnToSelect },
        function (error, data) {
          if (error) {
            console.log("errpr=>" + error);
            logger("Error: making async main query");
            reject(error);
            return;
          }

          resolve(data);
          return;
        }
      );
    });
  },

  selectWithAndSort: (
    collectionName,
    comparisonColumnsAndValues,
    columnsToSelect,
    sizePerPage,
    page,
    sortBy
  ) => {
    return new Promise((resolve, reject) => {
      try {
        const dbCollection = mongoose.model(collectionName);
        page = parseInt(page) - 1;
        sizePerPage = parseInt(sizePerPage);
        console.log("page", page);
        console.log("sizePerPage", sizePerPage);
        dbCollection
          .find(
            comparisonColumnsAndValues,
            columnsToSelect,
            function (error, data) {
              if (error) {
                logger("Error: making async main query");
                reject(error);
                return;
              }
              resolve(data);
              return;
            }
          )
          .sort(sortBy)
          .limit(sizePerPage)
          .skip(sizePerPage * page);
      } catch (error) {
        reject(error);
        return;
      }
    });
  },

  findDistinct: function (collectionName, filed, matchColumn) {
    return new Promise((resolve, reject) => {
      const dbCollection = mongoose.model(collectionName);
      dbCollection.distinct(filed, matchColumn).exec(function (error, data) {
        if (error) {
          reject(error);
          return;
        }
        resolve(data);
        return;
      });
    });
  },
};
