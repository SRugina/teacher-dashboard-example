const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const appendObj = require('../../utils/append').appendObj;
const find = require('../../utils/find').find;
const isset = require('../../utils/isset').isset;

module.exports = {
  /**
   * create new teacher
   *
   * @param {object} req http request object, i.e. request from user
   * @param {object} res http response object, i.e. response to send to user
   * @param {Function} callback function to call afterwards
   */
  create: function (req, res, callback) {
    try {

      find("teachers", "email", req.body.email, (err, profInfo) => {
        if (!profInfo.length == 0) {
          res.json({ status: "error", message: "teacher with that email already exists", data: null });
        } else {

        }
      });

      //hash their password
      let password = bcrypt.hashSync(req.body.password, saltRounds);

      //append to data file
      appendObj("teachers", { name: req.body.name, email: req.body.email, password: password, formGroup: req.body.formGroup }, (err) => {
        if (err) {
          callback(err);
        } else {
          //notify of success
          res.json({ status: "success", message: "Teacher added successfully!!!", data: null });
        }
      });
    } catch (err) {
      // catch errors and pass them on to express
      callback(err);
    }
  },

  /**
   *  authenticate a teacher's details for sign-in
   *
   * @param {object} req http request object, i.e. request from user
   * @param {object} res http response object, i.e. response to send to user
   * @param {Function} callback function to call afterwards
   */
  authenticate: function (req, res, callback) {
    try {
      find("teachers", "email", req.body.email, (err, profInfo) => {
        if (err) {
          callback(err);
        } else {
          console.log(profInfo);
          console.log(profInfo.length);
          for (let i = 0; i <= profInfo.length; i++) {
            if (isset(() => profInfo[i]) && bcrypt.compareSync(req.body.password, profInfo[i]["password"])) {
              const token = jwt.sign({ id: profInfo[i].id }, req.app.get('secretKey'), { expiresIn: '1h' });
              res.json({ status: "success", message: "teacher found", data: { teacher: profInfo[i], token: token } });
            } else {
              res.json({ status: "error", message: "Invalid email/password", data: null });
            }
          }
        }
      });
    } catch (err) {
      // catch errors and pass them on
      callback(err);
    }
  }
}
