const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * remove object form data.json
   *
   * @param {string} type whether looking for "teachers" or "pupils"
   * @param {string} withProp the property we are checking for
   * @param {string} checkVal the value we check the property against
   * @param {Function} callback function to call afterwards
   */
  deleteObj: function(type, withProp, checkVal, callback) {
    try {
      //get the data from the file. note: fs reads relative to root directory
      var dataFile = fs.readFileSync('data.json');
      var data = JSON.parse(dataFile);

      if (type.toLowerCase() == "teachers") {
        for (let i = 0; i < data["teachers"].length(); i++) { // for each teacher
          if (data["teachers"][i][withProp] == checkVal) { // with property that equals our check value
            data["teachers"].splice(i, 1); // remove that teacher
          }
        }
      } else if (type.toLowerCase() == "pupils") {
        for (let i = 0; i < data["pupils"].length(); i++) { // for each pupil
          if (data["pupils"][i][withProp] == checkVal) { // with property that matches our check value
            data["pupils"].splice(i, 1); // remove that teacher
          }
        }
      }

      //format data to be readable, with 4-space indents
      var dataJSON = JSON.stringify(data, null, 4);
      // write the new data to data.json
      fs.writeFileSync('data.json', dataJSON);
      // due to the way glitch.com works, if you want
      // to see the updated data.json file in editor
      // you need to run 'refresh' from the console.

      callback(false); // tell callback function no error occured

    } catch (err) {
      callback(err); // tell callback function an error occured
    }
  }
}