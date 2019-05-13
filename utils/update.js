const fs = require('fs');

module.exports = {
  /**
   * update object data in data.json
   *
   * @param {string} type whether looking for "teachers" or "pupils"
   * @param {string} withProp the property we are checking for
   * @param {string} checkVal the value we check the property against
   * @param {string} prop the property we want to edit
   * @param {string} newVal the new value for prop
   * @param {Function} callback function to call afterwards
   */
  updateObj: function(type, withProp, checkVal, prop, newVal, callback) {
    try {
      //get the data from the file
      var dataFile = fs.readFileSync('data.json');
      var data = JSON.parse(dataFile);

      if (type.toLowerCase() == "teachers") {
		    for (let teacher of data["teachers"]) {
          if (teacher[withProp] == checkVal) {
            teacher[prop] = newVal;
          }
        }
      } else if (type.toLowerCase() == "pupils") {
        for (let pupil of data["pupils"]) {
          if (pupil[withProp] == checkVal) {
            pupil[prop] = newVal;
          }
        }
      }

      //format data to be readable
      var dataJSON = JSON.stringify(data, null, 4);
      // write the new data to data.json
      fs.writeFileSync('data.json', dataJSON);
      // due to the way glitch.com works, if you want
      // to see the updated data.json file in editor
      // you need to run 'refresh' from the console.

      callback(false);

    } catch (err) {
      callback(err);
    }
  }
}