const fs = require('fs');
const path = require('path');

const rand = require('./rand').rand;

module.exports = {
    /**
   * add new object to data.json
   *
   * @param {string} type whether looking for "teachers" or "pupils"
   * @param {JSON} obj the object we want to add
   * @param {Function} callback function to call afterwards
   */
    appendObj: function(type, obj, callback) {
        try {
            //get the data from the file, note: fs reads relative to root directory
            var dataFile = fs.readFileSync('data.json');
            var data = JSON.parse(dataFile);

            if (type.toLowerCase() == "teachers") {
                obj.id = rand(); //generate new random id for teacher
                data["teachers"].push(obj);
            } else if (type.toLowerCase() == "pupils") {
                obj.id = rand(); //generate new random id for teacher
                data["pupils"].push(obj);
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
};