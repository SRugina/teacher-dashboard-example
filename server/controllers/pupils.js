const appendObj = require('../../utils/append').appendObj;
const find = require('../../utils/find').find;
const findAll = require('../../utils/find').findAll;
const updateObj = require('../../utils/update').updateObj;
const deleteObj = require('../../utils/delete').deleteObj;

const PDFDocument = require('../../utils/pdfkit-tables');
const { Base64Encode } = require('base64-stream');

module.exports = {
    /**
	* get pupil with matching id
	*
	* @param {Request} req http request object, i.e. request from user
	* @param {Response} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" containing pupil info (if success is true, otherwise "data" = null)
	*/
    getById: function(req, res, callback) {
        console.log(req.body);
        find("pupils", "id", req.params.pupilId, (err, pupilInfo) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                console.log(pupilInfo);
                if (pupilInfo[0] == false) { //i.e. no pupils found
                    res.json({ success: false, message: "No Pupil Found", data: null });
                } else {
                    res.json({ success: true, message: "Pupil Found", data: { pupils: pupilInfo } });
                }
            }
        });
    },

    /**
	* create a pupil's report with matching pupil id, containing the properties in the POST request's body
	*
	* @param {Request} req http request object, i.e. request from user
	* @param {Response} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" containing the report as base64 (if success is true, otherwise "data" = null)
	*/
    createReport: function(req, res, callback) {
        find("pupils", "id", req.params.pupilId, (err, pupilInfo) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                console.log(pupilInfo);
                if (pupilInfo[0] == false) { //i.e. no pupils found
                    res.json({ success: false, message: "No Pupil Found", data: null });
                } else {
                    const doc = new PDFDocument;

                    let table = {
                        headers: ['', ''],
                        rows: []
                    };

                    console.log(req.body);

                    for (item of req.body.reportOptions) {
                        console.log(item);
                        table.rows.push([item, pupilInfo[0][item]]);
                    }

                    doc.fontSize(25).text(req.body.reportType);

                    doc.table(table, {
                        prepareHeader: () => doc.font('Helvetica-Bold'),
                        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
                    });

                    let base64String = ''; // contains the base64 string
                    const stream = doc.pipe(new Base64Encode());

                    doc.end(); // will trigger the stream to end

                    stream.on('data', function(chunk) {
                        base64String += chunk;
                    });

                    stream.on('end', function() {
                        // the stream is at its end, so push the resulting base64 string to the response
                        if (base64String != '') {
                            const finalString = "data:application/pdf;base64," + base64String;
                            res.json({ success: true, message: "Pupil Report Generated", data: { report: finalString } });
                        } else {
                            res.json({ success: false, message: "No Pupil Report Generated", data: null });
                        }
                    });
                }
            }
        });
    },

    /**
	* get all pupils
	*
	* @param {Request} req http request object, i.e. request from user
	* @param {Response} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" containing the list of pupils (if success is true, otherwise "data" = null)
	*/
    getAll: function(req, res, callback) {
        findAll("pupils", (err, pupils) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "pupils list found", data: { pupils: pupils } });
            }
        });
    },

    /**
	* update pupil with matching id
	*
	* @param {Request} req http request object, i.e. request from user
	* @param {Response} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" (always = null)
	*/
    updateById: function(req, res, callback) {

        updateObj("pupils", "id", req.params.pupilId, req.body.toReplace, req.body.newValue, (err) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "Pupil updated successfully", data: null });
            }
        });
    },

    /**
	* delete pupil with matching id
	*
	* @param {Request} req http request object, i.e. request from user
	* @param {Response} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
    * @returns {JSON} json with "success" (true/false), "message" explaining what has occured, and "data" (always = null)
	*/
    deleteById: function(req, res, callback) {

        deleteObj("pupils", "id", req.params.pupilId, (err) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "Pupil deleted successfully", data: null });
            }
        });
    },

    /**
	* create new pupil
	*
	* @param {Request} req http request object, i.e. request from user
	* @param {Response} res http response object, i.e. response to send to user
	* @param {Function} callback function to call afterwards
	*/
    create: function(req, res, callback) {
        //append to data file
        appendObj("pupils", { surname: req.body.surname, forename: req.body.forename, dob: req.body.dob, homeAddress: req.body.homeAddress, homePhone: req.body.homePhone, gender: req.body.gender, tutorGroup: req.body.tutorGroup, schoolEmail: req.body.schoolEmail, grades: req.body.gradesArray }, (err, pupilId) => {
            if (err) {
                callback(err); //pass error over to express error handling
            } else {
                res.json({ success: true, message: "Pupil created successfully", data: { pupilId: pupilId } });
            }
        });
    }

};