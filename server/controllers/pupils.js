const appendObj = require('../../utils/append').appendObj;
const find = require('../../utils/find').find;
const findAll = require('../../utils/find').findAll;
const updateObj = require('../../utils/update').updateObj;
const deleteObj = require('../../utils/delete').deleteObj;

module.exports = {
    /**
	* get pupil with matching id
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    getById: function (req, res, callback) {
        console.log(req.body);
        find("pupils", "id", req.params.pupilId, (err, pupilInfo) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "Pupil Found", data: { pupils: pupilInfo } });
            }
        });
    },

    /**
	* get all pupils
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    getAll: function (req, res, callback) {
        findAll("pupils", (err, pupils) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "pupils list found", data: { pupils: pupils } });
            }
        });
    },

    /**
	* update pupil with matching id
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    updateById: function (req, res, callback) {

        updateObj("pupils", "id", req.params.pupilId, req.body.toReplace, req.body.newValue, (err) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "Pupil updated successfully", data: null });
            }
        });
    },

    /**
	* delete pupil with matching id
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    deleteById: function (req, res, callback) {

        deleteObj("pupils", "id", req.params.pupilId, (err) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "Pupil deleted successfully", data: null });
            }
        });
    },

    /**
	* create new pupil
	*
	* @param {object} req http request object, i.e. request from user
	* @param {object} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    create: function (req, res, callback) {
        //append to data file
        appendObj("pupils", { surname: req.body.surname, forename: req.body.forename, dob: req.body.dob, homeAddress: req.body.homeAddress, homePhone: req.body.homePhone, gender: req.body.gender, tutorGroup: req.body.tutorGroup, schoolEmail: req.body.schoolEmail, grades: req.body.gradesArray }, (err, pupilId) => {
            if (err) {
                callback(err);
            } else {
                res.json({ success: true, message: "Pupil created successfully", data: {pupilId: pupilId} });
            }
        });
    }

};