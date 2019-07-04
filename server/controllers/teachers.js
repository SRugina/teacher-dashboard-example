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
   * create new teacher (req.body must contain name, email, password, formGroup)
   *
   * @param {Request} req http request object, i.e. request from user
   * @param {Response} res http response object, i.e. response to send to user
   * @param {Function} callback function to call afterwards
   * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" (always = null)
   */
    create: function(req, res, callback) {
        try {

            find("teachers", "email", req.body.email, (err, profInfo) => {
                if (err) {
                    callback(err); //pass error over to express error handling
                } else {
                    if (!profInfo.length == 0) {
                        res.json({ success: false, message: "teacher with that email already exists", data: null });
                    } else {
                        //hash their password
                        let password = bcrypt.hashSync(req.body.password, saltRounds);

                        //append to data file
                        appendObj("teachers", { name: req.body.name, email: req.body.email, password: password, formGroup: req.body.formGroup }, (err, profId) => {
                            if (err) {
                                callback(err); //pass error over to express error handling
                            } else {
                                //notify of success
                                res.json({ success: true, message: "Teacher added successfully", data: null });
                            }
                        });
                    }
                }
            });
        } catch (err) {
            // catch errors and pass them on to express
            callback(err); //pass error over to express error handling
        }
    },

    /**
   *  authenticate a teacher's details for sign-in (req.body must contain email, password)
   *
   * @param {Request} req http request object, i.e. request from user
   * @param {Response} res http response object, i.e. response to send to user
   * @param {Function} callback function to call afterwards
   * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" containing jwt token and the teacher's info (if success true, otherwise = null)
   */
    authenticate: function(req, res, callback) {
        try {
            console.log(req.body);
            find("teachers", "email", req.body.email, (err, profInfo) => {
                if (err) {
                    callback(err); //pass error over to express error handling
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
            callback(err); //pass error over to express error handling
        }
    },


    /**
   *  verify a teacher's token to make sure the token is still valid (hasn't expired) (req.body must contain token)
   *
   * @param {Request} req http request object, i.e. request from user
   * @param {Response} res http response object, i.e. response to send to user
   * @param {Function} callback function to call afterwards
   * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" (always = null)
   */
    verify: function(req, res, callback) {
        try {
            jwt.verify(req.body.token, req.app.get('SECRET_KEY'), function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: "invalid token", data: null });
                } else {
                    res.json({ success: true, message: "token is valid", data: null });
                }
            });
        } catch (err) {
            // catch errors and pass them on
            callback(err); //pass error over to express error handling
        }
    },

     /**
    * logout teacher by removing token from headers
    *
    * @param {Request} req http request object, i.e. request from user
    * @param {Response} res http response object, i.e. response to send to user
    * @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" containing an empty token string (should always be '')
    */
    logout: function(req, res, callback) {
        req.headers['x-access-token'] = '';
        res.json({ success: true, message: "Teacher logged out successfully", data: { token: req.headers['x-access-token'] } });
    },

    /**
     * delete teacher with matching id (req.params must contain profId)
     *
     * @param {Request} req http request object, i.e. request from user
     * @param {Response} res http response object, i.e. response to send to user
     * @param {Function} callback function to call afterwards
     * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" (always = null)
     */
    deleteById: function(req, res, callback) {
        deleteObj("teachers", "id", req.params.profId, (err) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "Teacher deleted successfully", data: null });
            }
        });
    },

    /**
     * update teacher with matching id (req.body must contain toReplace, newValue, and req.params must contain profId)
     *
     * @param {Request} req http request object, i.e. request from user
     * @param {Response} res http response object, i.e. response to send to user
     * @param {Function} callback function to call afterwards
     * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" (always = null)
     */
    updateById: function(req, res, callback) {

        updateObj("teachers", "id", req.params.profId, req.body.toReplace, req.body.newValue, (err) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "Teacher updated successfully", data: null });
            }
        });
    },

    /**
    * get all teachers
    *
    * @param {Request} req http request object, i.e. request from user
    * @param {Response} res http response object, i.e. response to send to user
    * @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" containing array of teachers (if success true, otherwise = null)
    */
    getAll: function(req, res, callback) {
        findAll("teachers", (err, teachers) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "teachers list found", data: { teachers: teachers } });
            }
        });
    },

    /**
    * get teacher with matching id (req.params must contain profId)
    *{Request} req
    * @param {Response} resq http request object, i.e. request from user
    * @param {Response} res http response object, i.e. response to send to user
    * @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" containing teacher's info (if success true, otherwise = null)
    */
    getById: function(req, res, callback) {
        console.log(req.body);
        find("teachers", "id", req.params.profId, (err, profInfo) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "Teacher Found", data: { teachers: profInfo } });
            }
        });
    }
};