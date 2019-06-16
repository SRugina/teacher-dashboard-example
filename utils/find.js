const fs = require('fs');

module.exports = {
    /**
   * find the item(s) with provided property and value
   *
   * @param {string} type whether looking for "teachers" or "pupils"
   * @param {string} prop the property type we are searching for
   * @param {string} val the value we want to check for
   * @param {Function} callback function to call afterwards
   */
    find: function (type, prop, val, callback) {
        try {
            //get the data from the file
            var dataFile = fs.readFileSync('data.json');
            var data = JSON.parse(dataFile);
            let results = [];

            if (type.toLowerCase() == "teachers") {
                for (let prof of data["teachers"]) { // for each teacher
                    if (prof[prop] == val) { // if the property matches the check value
                        results.push(prof); // add teacher to list
                    }
                }
                if (results.length == 0) {
                    callback(false, [ false ]); // tell callback no error occurred and no results
                } else {
                    callback(false, results); // tell callback no error occurred and give results
                }
            } else if (type.toLowerCase() == "pupils") {
                for (let kid of data["pupils"]) {
                    if (kid[prop] == val) {
                        results.push(kid);
                    }
                }
                if (results.length == 0) {
                    callback(false, [ false ]); // tell callback no error occurred and no results
                } else {
                    callback(false, results); // tell callback no error occurred and give results
                }
            }
        } catch (err) {
            callback(err, null);
        }

    },

    /**
   * find all items with type "teachers" or "pupils"
   *
   * @param {string} type whether looking for "teachers" or "pupils"
   * @param {Function} callback function to call afterwards
   */
    findAll: function (type, callback) {
        try {
            //get the data from the file
            var dataFile = fs.readFileSync('data.json');
            var data = JSON.parse(dataFile);
            let list = [];

            if (type.toLowerCase() == "teachers") {
                list = data["teachers"];
            } else if (type.toLowerCase() == "pupils") {
                list = data["pupils"];
            }
            callback(false, list);
        } catch (err) {
            callback(err, null);
        }

    }
};