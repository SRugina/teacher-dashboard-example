const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const appendObj = require('../../utils/append').appendObj;
const find = require('../../utils/find').find;
const isset = require('../../utils/isset').isset;
const findAll = require('../../utils/find').findAll;
const updateObj = require('../../utils/update').updateObj;
const deleteObj = require('../../utils/delete').deleteObj;

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
                    res.json({ success: false, message: "teacher with that email already exists", data: null });
                } else {
                    //hash their password
                    let password = bcrypt.hashSync(req.body.password, saltRounds);

                    //append to data file
                    appendObj("teachers", { name: req.body.name, email: req.body.email, password: password, formGroup: req.body.formGroup }, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            //notify of success
                            res.json({ success: true, message: "Teacher added successfully", data: null });
                        }
                    });
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
                    let i = 0;
                    while (i <= profInfo.length) {
                        if (isset(() => profInfo[i]) && bcrypt.compareSync(req.body.password, profInfo[i]["password"])) {
                            const token = jwt.sign({ id: profInfo[i].id }, req.app.get('SECRET_KEY'), { expiresIn: '1h' });
                            res.json({ success: true, message: "teacher found", data: { teacher: profInfo[i], token: token } });
                            break; // exit while loop as teacher found
                        }
                        i++;
                    }
                    if (i > profInfo.length) { // ie while loop above found nothing
                            res.json({ success: false, message: "Invalid email/password", data: null });

                        }
                }
            });
        } catch (err) {
            // catch errors and pass them on
            callback(err);
        }
    },

   /**
	* delete teacher with matching id
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    deleteById: function (req, res, callback) {
        deleteObj("teachers", "id", req.params.profId, (err) => {
            if (err) {
                callback(err);
            } else {
                req.headers['x-access-token'] = '';
                res.json({ success: true, message: "Teacher deleted successfully", data: null });
            }
        });
    },

   /**
	* update teacher with matching id
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    updateById: function (req, res, callback) {

        updateObj("teachers", "id", req.params.profId, req.body.toReplace, req.body.newValue, (err) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "Teacher updated successfully", data: null });
            }
        });
    },

    /**
	* get all teachers
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    getAll: function (req, res, callback) {
        findAll("teachers", (err, teachers) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "teachers list found", data: { teachers: teachers } });
            }
        });
    },

    /**
	* get teacher with matching id
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    getById: function (req, res, callback) {
        console.log(req.body);
        find("teachers", "id", req.params.profId, (err, profInfo) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "Teacher Found", data: { teachers: profInfo } });
            }
        });
    }
};